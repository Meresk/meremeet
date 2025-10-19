package main

import (
	"log"
	"mere-meet/backend/internal/config"
	"mere-meet/backend/internal/db"
	"mere-meet/backend/internal/handlers"
	"mere-meet/backend/internal/middlewares"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Загрузка конфига
	cfg := config.Load()

	pgdb, err := db.NewPostgresDB(cfg.DbURL, cfg.AdminDefaultPass)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer pgdb.Close()

	userHandler := handlers.NewUserHandler(pgdb, cfg.JwtSecret)

	authMw := middlewares.NewAuthMiddleware(cfg.JwtSecret)

	app := fiber.New(fiber.Config{
		AppName: "mere-meet v1",
	})

	api := app.Group("/api")
	api.Post("/user", userHandler.CreateUser, authMw.RequierLogin)
	api.Post("/login", userHandler.Authenticate)

	app.Listen(":3000")
}
