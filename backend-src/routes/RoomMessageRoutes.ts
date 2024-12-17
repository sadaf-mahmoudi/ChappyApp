import express, { Request, Response, Router } from "express";
import { ChatMessage } from "../models/ChatMessage.js";
import { fetchAllChatMessages } from "../mongoDB-src/roomMessage/fetchAllChatMessages.js";
import { createChatMessage } from "../mongoDB-src/roomMessage/createChatMessage.js";
import {
  isValidRoomMessage,
  RoomMessageSchema,
} from "../data/validationRoomMessage.js";
import { addMessageToRoom } from "../mongoDB-src/roomMessage/addMessageToRoom.js";
import { getMessagesByRoomId } from "../mongoDB-src/roomMessage/getMessagesByRoomId.js";

export const router: Router = express.Router();

router.get("/getMessages/:roomName", async (req: Request, res: Response) => {
  const roomName = req.params.roomName;

  try {
    const messages = await fetchAllChatMessages(roomName);
    if (!messages) {
      // If no messages are found, send an empty array with a 200 status
      res.status(200).json([]);
    }
    res.json(messages);
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Route för att hämta meddelanden för ett specifikt rum
router.get("/:roomId/message", async (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  try {
    const messages = await getMessagesByRoomId(roomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages", error });
  }
});
// Route för att lägga till ett nytt meddelande i ett specifikt rum
router.post("/:roomId/message", async (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  const { content, sender } = req.body;
  try {
    const newMessage = await addMessageToRoom(roomId, content, sender);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to add message", error });
  }
});

router.post("/addMessage", async (req: Request, res: Response) => {
  console.log("Request payload received:", req.body);

  const newDmRoom: ChatMessage = req.body;

  if (!isValidRoomMessage(newDmRoom)) {
    console.log(
      "Validation failed:",
      RoomMessageSchema.validate(newDmRoom).error?.details
    );
    res.status(400).json({
      message: "Invalid message data provided. Please check the fields.",
      error: RoomMessageSchema.validate(newDmRoom).error?.details, // Added error details for debugging
    });
  }

  try {
    const messageId = await createChatMessage(newDmRoom);
    if (!messageId) {
      res
        .status(400)
        .json({ message: "Failed to create the message in the database." });
    }
    res
      .status(201)
      .json({ message: "Message created successfully", id: messageId });
  } catch (error) {
    console.error("Error inserting Message Rooms:", error);
    res
      .status(500)
      .json({ message: "Internal server error while inserting message." });
  }
});

export default router;