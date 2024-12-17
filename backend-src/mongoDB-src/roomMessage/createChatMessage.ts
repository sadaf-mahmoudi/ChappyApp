import { MongoClient, Collection, ObjectId, InsertOneResult } from "mongodb";
import { ChatMessage } from "../../models/ChatMessage.js";
import { connectToChatDB } from "../../mongoDB-src/roomMessage/roomMessageCon.js";

// Function name corrected for standard camelCase convention
async function createChatMessage(
  roomMessage: ChatMessage
): Promise<ObjectId | null> {
  const [messageCollection, client]: [Collection<ChatMessage>, MongoClient] =
    await connectToChatDB();

  try {
    const insertResult: InsertOneResult<ChatMessage> =
      await messageCollection.insertOne(roomMessage);
    if (insertResult.acknowledged) {
      return insertResult.insertedId;
    } else {
      console.error("Insertion not acknowledged");
      return null; // Explicitly return null if not acknowledged
    }
  } catch (error) {
    console.error("Error inserting room message:", error);
    throw new Error("Failed to create room message due to database error");
  } finally {
    await client.close(); // Ensure the client is closed after operation
  }
}

export { createChatMessage };