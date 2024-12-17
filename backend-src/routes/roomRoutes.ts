import express, { Request, Response } from "express";
import { fetchAllRooms } from "../mongoDB-src/rooms/fetchAllRoom.js";
import { addRoom } from "../mongoDB-src/rooms/addRoom.js";
import { roomSchema } from "../data/validationRoom.js"; // Importera Joi-schema
import { Room } from "../models/Room.js";
import { deleteRoom } from "../mongoDB-src/rooms/deleteRoom.js";
import { addMessageToRoom } from "../mongoDB-src/roomMessage/addMessageToRoom.js";

const router = express.Router();

router.get("/rooms", async (req: Request, res: Response) => {
  const userType = req.query.userType; // Get userType from query parameter
  try {
    let filter = {};
    if (userType === "guest") {
      filter = { isActive: false }; // Guests see only inactive rooms
    }
    const rooms = await fetchAllRooms(filter);
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route för att lägga till ett nytt rum med Joi-validering
router.post("/addRoom", async (req: Request, res: Response) => {
  const room: Room = req.body;

  console.log("Received room data:", room); // Debug-logga inkommande data

  const { error } = roomSchema.validate(room);
  if (error) {
    res.status(400).json({
      message: "Invalid room data provided",
      details: error.details.map((detail) => detail.message),
    });
  }

  try {
    console.log("Adding room:", room); // Debug-logga innan rummet skapas
    const roomId = await addRoom(room);
    res.status(201).json({ message: "Room added successfully", roomId });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ message: "Failed to add room" });
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

// Route för att ta bort ett rum
router.delete("/:id", async (req: Request, res: Response) => {
  const roomId = req.params.id;
  try {
    const wasDeleted = await deleteRoom(roomId);
    res.status(wasDeleted ? 200 : 404).json({
      message: wasDeleted ? "Room deleted successfully" : "Room not found",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room", error });
  }
});

export default router;