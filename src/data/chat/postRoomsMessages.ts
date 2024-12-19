import { RoomMessage } from "../../models/RoomMessage.js"; // Anpassa sökvägen för din modell

export async function postNewMessage(
  message: Partial<RoomMessage>
): Promise<RoomMessage | null> {
  try {
    const response = await fetch("/api/message/addMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Failed to send message, status:", response.status);
      return null;
    }

    const newMessage: RoomMessage = await response.json();
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}