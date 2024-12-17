import { RoomMessage } from "../../models/RoomMessage";

// fetchRoomsMessages.ts
export async function fetchRoomMessages(
  roomId: string
): Promise<RoomMessage[] | null> {
  try {
    const response = await fetch(`/api/message/getMessages/${roomId}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.error("Failed to fetch messages, status:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
}
export async function fetchRoomName(roomId: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/room/name/${roomId}`, { method: "GET" });
    if (!response.ok) {
      console.error("Failed to fetch room name, status:", response.status);
      return null;
    }
    const { name } = await response.json();
    return name;
  } catch (error) {
    console.error("Error fetching room name:", error);
    return null;
  }
}