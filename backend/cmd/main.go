package main

import (
	"log"
	"mere-meet/backend/internal/config"
	"mere-meet/backend/internal/db"
	"mere-meet/backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Загрузка конфига
	cfg := config.Load()

	pgdb, err := db.NewPostgresDB(cfg.DbURL)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer pgdb.Close()

	userHandler := handlers.NewUserHandler(pgdb)

	app := fiber.New(fiber.Config{
		AppName: "mere-meet v1",
	})

	app.Post("/users", userHandler.CreateUser)

	app.Listen(":3000")
}
