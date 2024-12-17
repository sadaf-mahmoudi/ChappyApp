// db/connectToChatDB.ts
import { MongoClient, Db, Collection } from "mongodb";
import { ChatMessage } from "../../models/ChatMessage.js";

const connectionString: string =
  process.env.CONNECTION_STRING || "yourMongoDBConnectionString";

export async function connectToChatDB(): Promise<
  [Collection<ChatMessage>, MongoClient]
> {
  if (!connectionString) {
    console.error("No connection string, check your .env file!");
    throw new Error("Connection string is undefined");
  }

  const client: MongoClient = new MongoClient(connectionString);
  await client.connect();
  console.log("Connected successfully to MongoDB server");

  const db: Db = client.db("Chappy"); // Ensure the DB name is correct
  const collection: Collection<ChatMessage> =
    db.collection<ChatMessage>("roomChat"); // Adjusted to new collection name

  return [collection, client];
}