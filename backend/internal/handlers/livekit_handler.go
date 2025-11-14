package handlers

import (
	"context"
	"mere-meet/backend/internal/logger"
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
	logger    *logger.Logger
}

func NewLivekitHandler(apiKey, apiSecret string, lkCl *lksdk.RoomServiceClient, logger *logger.Logger) *LivekitHandler {
	return &LivekitHandler{apiKey: apiKey, apiSecret: apiSecret, lkClient: lkCl, logger: logger}
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

	roomExist, err := h.checkRoomExistence(req.Name)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if roomExist {
		return c.Status(400).JSON(fiber.Map{
			"error": "room already exist",
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

func (h *LivekitHandler) GetAllRooms(c *fiber.Ctx) error {
	res, err := h.lkClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	rooms := res.GetRooms()

	var roomNames []string
	for _, room := range rooms {
		roomNames = append(roomNames, room.Name)
	}

	return c.JSON(fiber.Map{
		"rooms": roomNames,
	})
}

func (h *LivekitHandler) JoinRoom(c *fiber.Ctx) error {
	requestLogger := c.Locals("logger").(*logger.Logger)
	requestID := c.Locals("requestID").(string)
	clientIP := c.Locals("clientIP").(string)
	userAgent := c.Locals("userAgent").(string)

	requestLogger.Request(requestID, "ROOM", "Starting join room")

	type Request struct {
		RoomName string `json:"roomname"`
		Nickname string `json:"nickname"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	requestLogger.RequestWithMeta(requestID, "ROOM", clientIP, userAgent,
		"Join room: %s attempt for user: %s", req.RoomName, req.Nickname)

	roomExist, err := h.checkRoomExistence(req.RoomName)
	if err != nil {
		requestLogger.Request(requestID, "ROOM", "LiveKit API getting rooms error: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	if !roomExist {
		requestLogger.Request(requestID, "ROOM", "Room not found: %s", req.RoomName)
		return c.Status(400).JSON(fiber.Map{
			"error": "room doesn't exist",
		})
	}

	userExist, err := h.checkParticipantExistence(req.RoomName, req.Nickname)
	if err != nil {
		requestLogger.Request(requestID, "ROOM", "LiveKit API getting participants error: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	if userExist {
		return c.Status(400).JSON(fiber.Map{
			"error": "user with this nickname already exist",
		})
	}

	token, err := h.generateLkToken(req.RoomName, req.Nickname)
	if err != nil {
		requestLogger.Request(requestID, "ROOM", "LiveKit API generating token error: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	requestLogger.RequestWithMeta(requestID, "ROOM", clientIP, userAgent,
		"Join room: %s succes for user: %s", req.RoomName, req.Nickname)

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

func (h *LivekitHandler) checkRoomExistence(roomName string) (bool, error) {
	res, err := h.lkClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	if err != nil {
		return false, err
	}

	rooms := res.GetRooms()
	roomExists := false

	for _, room := range rooms {
		if room.Name == roomName {
			roomExists = true
			break
		}
	}

	return roomExists, nil
}

func (h *LivekitHandler) checkParticipantExistence(roomName, participantId string) (bool, error) {
	res, err := h.lkClient.ListParticipants(context.Background(), &livekit.ListParticipantsRequest{
		Room: roomName,
	})
	if err != nil {
		return false, err
	}

	participants := res.GetParticipants()
	participantExists := false

	for _, p := range participants {
		if p.Identity == participantId {
			participantExists = true
			break
		}
	}

	return participantExists, nil
}
