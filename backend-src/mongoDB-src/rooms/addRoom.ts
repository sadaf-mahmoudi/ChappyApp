import { connectToRoomCollection } from "./roomCon.js";
import { Room } from "../../models/Room.js";
import { Collection, InsertOneResult, MongoClient, ObjectId } from "mongodb";

export async function addRoom(room: Room): Promise<ObjectId | null> {
  if (!room || !room.name) {
    throw new Error("Invalid room data: Room name is required.");
  }

  const [collection, client]: [Collection<Room>, MongoClient] =
    await connectToRoomCollection();
  try {
    // Check if a room with the same name already exists
    const existingRoom = await collection.findOne({ name: room.name });
    if (existingRoom) {
      console.log(
        `Room '${room.name}' already exists with ID: ${existingRoom._id}`
      );
      throw new Error(`Room with the name '${room.name}' already exists.`);
    }

    // If no existing room, proceed to create a new one
    const result: InsertOneResult<Room> = await collection.insertOne(room);
    console.log(`Room '${room.name}' created with ID: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  } finally {
    await client.close();
  }
}