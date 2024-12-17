import { connectToChatDB } from "../../mongoDB-src/roomMessage/roomMessageCon.js";
import { Message } from "../../models/message.js";

async function getMessagesByRoomId(roomId: string): Promise<Message[]> {
  const [collection, client] = await connectToChatDB();

  try {
    const messages = await collection.find({ roomId }).toArray();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedMessages: Message[] = messages.map((msg: any) => ({
      roomId: msg.roomId,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.timestamp).toISOString(),
    }));
    return formattedMessages;
  } finally {
    await client.close();
  }
}

export { getMessagesByRoomId };