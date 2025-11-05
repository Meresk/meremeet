package handlers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/livekit/protocol/auth"
	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

type LivekitHandler struct {
	apiKey    string
	apiSecret string
	lkClient  *lksdk.RoomServiceClient
}

func NewLivekitHandler(apiKey, apiSecret string, lkCl *lksdk.RoomServiceClient) *LivekitHandler {
	return &LivekitHandler{apiKey: apiKey, apiSecret: apiSecret, lkClient: lkCl}
}

func (h *LivekitHandler) CreateRoom(c *fiber.Ctx) error {
	type Request struct {
		Name string `json:"name"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 19*time.Second)
	defer cancel()

	createReq := &livekit.CreateRoomRequest{
		Name:         req.Name,
		EmptyTimeout: 100,
	}

	room, err := h.lkClient.CreateRoom(ctx, createReq)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"name": room.Name,
	})
}

func (h *LivekitHandler) JoinRoom(c *fiber.Ctx) error {
	type Request struct {
		RoomName string `json:"room_name"`
		Nickname string `json:"nickname"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	//TODO: Проверка на существование команты + проверка на валидность и уникальность никнейма

	token, err := h.generateLkToken(req.RoomName, req.Nickname)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{"token": token})
}

func (h *LivekitHandler) generateLkToken(roomName, userIdentity string) (string, error) {
	at := auth.NewAccessToken(h.apiKey, h.apiSecret)

	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     roomName,
	}

	at.SetVideoGrant(grant).SetIdentity(userIdentity).SetValidFor(12 * time.Hour)
	token, err := at.ToJWT()
	if err != nil {
		return "", err
	}

	return token, nil
}
