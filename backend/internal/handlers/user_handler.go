package handlers

import (
	"database/sql"
	"mere-meet/backend/internal/logger"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	db        *sql.DB
	jwtSecret string
	logger    *logger.Logger
}

func NewUserHandler(db *sql.DB, jwtSecret string, logger *logger.Logger) *UserHandler {
	return &UserHandler{db: db, jwtSecret: jwtSecret, logger: logger}
}

func (h *UserHandler) CreateUser(c *fiber.Ctx) error {
	requestLogger := c.Locals("logger").(*logger.Logger)
	requestID := c.Locals("requestID").(string)
	requestLogger.Request(requestID, "USER", "Starting user creation")

	type Request struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		requestLogger.Request(requestID, "USER", "Failed to parse request body: %v", err)
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		requestLogger.Request(requestID, "USER", "Password hashing failed: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	var id int
	err = h.db.QueryRow(
		"INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id",
		req.Login, string(hashedPass),
	).Scan(&id)

	if err != nil {
		requestLogger.Request(requestID, "USER", "Database error: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	requestLogger.Request(requestID, "USER", "User created successfully: %s (ID: %d)", req.Login, id)
	return c.Status(201).JSON(fiber.Map{
		"id":    id,
		"login": req.Login,
	})
}

func (h *UserHandler) Authenticate(c *fiber.Ctx) error {
	requestLogger := c.Locals("logger").(*logger.Logger)
	requestID := c.Locals("requestID").(string)
	clientIP := c.Locals("clientIP").(string)
	userAgent := c.Locals("userAgent").(string)

	requestLogger.Request(requestID, "AUTH", "Starting authentication")

	type Request struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		requestLogger.Request(requestID, "AUTH", "Failed to parse request body: %v", err)
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	requestLogger.RequestWithMeta(requestID, "AUTH", clientIP, userAgent,
		"Authentication attempt for user: %s", req.Login)

	var id int
	var password string
	err := h.db.QueryRow(
		"SELECT id, password FROM users WHERE login = $1",
		req.Login,
	).Scan(&id, &password)

	if err != nil {
		if err == sql.ErrNoRows {
			requestLogger.Request(requestID, "AUTH", "User not found: %s", req.Login)
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid credentials",
			})
		}
		requestLogger.Request(requestID, "AUTH", "Database error for user %s: %v", req.Login, err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(req.Password))
	if err != nil {
		requestLogger.Request(requestID, "AUTH", "Invalid password for user: %s", req.Login)
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	token, err := h.generateToken(id, req.Login)
	if err != nil {
		requestLogger.Request(requestID, "AUTH", "Token generation failed for %s: %v", req.Login, err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	requestLogger.Request(requestID, "AUTH", "Successful authentication for user: %s (ID: %d)", req.Login, id)

	return c.Status(200).JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"id":    id,
			"login": req.Login,
		},
	})
}

func (h *UserHandler) generateToken(id int, login string) (string, error) {
	claims := jwt.MapClaims{
		"sub":     login,
		"user_id": id,
		"exp":     time.Now().Add(time.Hour * 2).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.jwtSecret))
}
