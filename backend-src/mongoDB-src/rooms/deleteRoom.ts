import { ObjectId } from "mongodb";
import { connectToRoomCollection } from "../rooms/roomCon.js"; // Adjust the path as necessary

export async function deleteRoom(
  roomId?: string,
  name?: string
): Promise<boolean> {
  const [collection, client] = await connectToRoomCollection();
  try {
    const filter = roomId ? { _id: new ObjectId(roomId) } : { name };
    const result = await collection.deleteOne(filter);
    return result.deletedCount === 1;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  } finally {
    await client.close();
  }
}