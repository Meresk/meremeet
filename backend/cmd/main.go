package main

import (
	"fmt"
	"log"
	"mere-meet/backend/internal/config"
	"mere-meet/backend/internal/db"
	"mere-meet/backend/internal/handlers"
	"mere-meet/backend/internal/logger"
	"mere-meet/backend/internal/middlewares"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/google/uuid"

	lksdk "github.com/livekit/server-sdk-go/v2"
)

func main() {
	appLogger, err := logger.NewLogger("./logs")
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer appLogger.Close()

	appLogger.Info("APP", "Starting application...")

	// Загрузка конфига
	cfg := config.Load()
	appLogger.Info("APP", "Configuration loaded")

	// Подключение к БД и сидинг
	appLogger.Info("DB", "Connecting to database...")
	pgdb, err := db.NewPostgresDB(cfg.DbURL, cfg.AdminDefaultPass, appLogger)
	if err != nil {
		appLogger.Error("DB", "Database connection failed: %v", err)
		os.Exit(1)
	}
	defer pgdb.Close()
	appLogger.Info("DB", "Database connected successfully")

	// Лайвкит клиент для использования LiveKit api запросов
	lkRoomClient := lksdk.NewRoomServiceClient(cfg.LiveKitServerURL, cfg.LiveKitApiKey, cfg.LiveKitApiSecret)

	// Структуры с ендпоинтами
	userHandler := handlers.NewUserHandler(pgdb, cfg.JwtSecret, appLogger)
	roomHandler := handlers.NewLivekitHandler(cfg.LiveKitApiKey, cfg.LiveKitApiSecret, lkRoomClient, appLogger)

	// Мидлваер авторизации
	authMw := middlewares.NewAuthMiddleware(cfg.JwtSecret)

	// Создание и настройка api
	appLogger.Info("APP", "Creating Fiber app...")
	app := fiber.New(fiber.Config{
		AppName:               "mere-meet v1",
		DisableStartupMessage: true,
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowOrigins,
		AllowHeaders:     cfg.AllowHeaders,
		AllowMethods:     cfg.AllowMethods,
		AllowCredentials: true,
	}))
	app.Use(requestid.New(requestid.Config{
		Generator: func() string {
			return fmt.Sprintf("req-%s", uuid.New().String()[:8])
		},
		ContextKey: "requestid",
	}))
	// Кастомный middleware для логирования
	app.Use(func(c *fiber.Ctx) error {
		requestID := c.Locals("requestid").(string)
		start := time.Now()

		// Метаданные запроса
		userAgent := c.Get("User-Agent")
		ip := c.IP()

		// Начало запроса
		appLogger.Request(requestID, "HTTP", "START %s %s | IP: %s | UA: %s", c.Method(), c.Path(), ip, userAgent)
		c.Locals("logger", appLogger)
		c.Locals("requestID", requestID)
		c.Locals("clientIP", ip)
		c.Locals("userAgent", userAgent)

		err := c.Next()

		// Завершение запроса
		duration := time.Since(start)
		status := c.Response().StatusCode()

		appLogger.Request(requestID, "HTTP", "END %s %s %d %v",
			c.Method(), c.Path(), status, duration)

		return err
	})

	// Ендпоинты
	api := app.Group("/api")
	// User
	api.Post("/user", authMw.RequireLogin, userHandler.CreateUser)
	api.Post("/login", userHandler.Authenticate)

	// LiveKit Room
	api.Post("/room", authMw.RequireLogin, roomHandler.CreateRoom)
	api.Get("room", authMw.RequireLogin, roomHandler.GetAllRooms)
	api.Post("/room/join", roomHandler.JoinRoom)

	// Graceful shutdown
	go func() {
		sigchan := make(chan os.Signal, 1)
		signal.Notify(sigchan, os.Interrupt, syscall.SIGTERM)
		<-sigchan
		appLogger.Info("APP", "Received shutdown signal")
		if err := app.Shutdown(); err != nil {
			appLogger.Error("APP", "Error during shutdown: %v", err)
		}
	}()

	// Запуск сервера
	addr := fmt.Sprintf(":%s", cfg.Port)
	appLogger.Info("APP", "Server starting on %s", addr)

	if err := app.Listen(addr); err != nil {
		appLogger.Error("APP", "Server failed to start: %v", err)
		os.Exit(1)
	}

	appLogger.Info("APP", "Server stopped gracefully")
}
