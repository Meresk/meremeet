import { API_BASE_URL } from "../../config/constants"
import { authStorage } from "../auth/storage";

export interface JoinRoomRequest {
  roomname: string;
  nickname: string;
}

export interface JoinRoomResponse {
  token: string;
}

export interface Room {
    name: string;
    participants: number;
    creationTime: number;
}

export interface GetAllRoomsResponse {
    rooms: Room[];
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

class RoomService {
  async joinRoom(roomData: JoinRoomRequest): Promise<JoinRoomResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/room/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data: JoinRoomResponse = await response.json();
      return data;
    } catch (error) {
      console.error('RoomService: Failed to join room:', error);
      throw error;
    }
  }

  async createRoom(roomName: string): Promise<any> {
    try {
      const authToken = authStorage.getToken();
      if (!authToken) {
        throw new Error('No authentication token found. Please login first.');
      }

      const response = await fetch(`${API_BASE_URL}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: roomName}),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RoomService: Failed to create room:', error);
      throw error;
    }
  }

  async getAllRooms(): Promise<Room[]> {
    try {
      const authToken = authStorage.getToken();
      if (!authToken) {
        throw new Error('No authentication token found. Please login first.');
      }

      const response = await fetch(`${API_BASE_URL}/room`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data: GetAllRoomsResponse = await response.json();
      return data.rooms;
    } catch (error) {
      console.error('RoomService: Failed to get rooms:', error);
      throw error;
    }
  }
}

export const roomService = new RoomService();