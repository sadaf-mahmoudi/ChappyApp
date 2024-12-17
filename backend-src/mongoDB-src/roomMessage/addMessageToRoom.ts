import { connectToChatDB } from "../../mongoDB-src/roomMessage/roomMessageCon.js";
import { ChatMessage } from "../../models/ChatMessage.js";

async function addMessageToRoom(
  roomId: string,
  content: string,
  sender: string
): Promise<void> {
  const [collection, client] = await connectToChatDB();
  const newMessage: ChatMessage = {
    sender,
    message: content, // If 'content' corresponds to 'message'
    channel: roomId, // Adjust if 'roomId' aligns with 'channel'
    timestamp: new Date(), // Ensure the type is Date if required by the model
  };

  try {
    await collection.insertOne(newMessage);
  } finally {
    await client.close();
  }
}

export { addMessageToRoom };