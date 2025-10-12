package main

import (
	"log"
	"mere-meet/backend/internal/config"
	"mere-meet/backend/internal/db"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Загрузка конфига
	cfg := config.Load()

	dbpg, err := db.NewPostgresDB(cfg.DbURL)
	if err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}
	defer dbpg.Close()

	app := fiber.New(fiber.Config{
		AppName: "mere-meet v1",
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("mere-meet begining!")
	})

	app.Listen(":8080")
}
