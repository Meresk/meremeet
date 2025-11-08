package main

import (
	"fmt"
	"log"
	"mere-meet/backend/internal/config"
	"mere-meet/backend/internal/db"
	"mere-meet/backend/internal/handlers"
	"mere-meet/backend/internal/middlewares"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

func main() {
	// Загрузка конфига
	cfg := config.Load()

	pgdb, err := db.NewPostgresDB(cfg.DbURL, cfg.AdminDefaultPass)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer pgdb.Close()

	lkRoomClient := lksdk.NewRoomServiceClient(cfg.LiveKitServerURL, cfg.LiveKitApiKey, cfg.LiveKitApiSecret)

	userHandler := handlers.NewUserHandler(pgdb, cfg.JwtSecret)
	roomHandler := handlers.NewLivekitHandler(cfg.LiveKitApiKey, cfg.LiveKitApiSecret, lkRoomClient)

	authMw := middlewares.NewAuthMiddleware(cfg.JwtSecret)

	app := fiber.New(fiber.Config{
		AppName: "mere-meet v1",
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowOrigins,
		AllowHeaders:     cfg.AllowHeaders,
		AllowMethods:     cfg.AllowMethods,
		AllowCredentials: true,
	}))

	api := app.Group("/api")
	api.Post("/user", authMw.RequireLogin, userHandler.CreateUser)
	api.Post("/login", userHandler.Authenticate)

	api.Post("/room", authMw.RequireLogin, roomHandler.CreateRoom)
	api.Get("room", authMw.RequireLogin, roomHandler.GetAllRooms)
	api.Post("/room/join", roomHandler.JoinRoom)

	addr := fmt.Sprintf(":%s", cfg.Port)
	app.Listen(addr)
}
