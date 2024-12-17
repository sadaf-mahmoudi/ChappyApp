import { Room } from "../../models/Room.js";

export async function getAllRooms(): Promise<Room[] | null> {
  try {
    const response = await fetch("/api/getDM", { method: "GET" });
    if (!response.ok) {
      console.error("Failed to fetch rooms, status:", response.status);
      return null;
    }
    const rooms = await response.json();
    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return null;
  }
}