import { MongoClient, Db, Collection } from "mongodb";
import { Room } from "../../models/Room.js";

const connectionString: string | undefined = process.env.CONNECTION_STRING;

export async function connectToRoomCollection(): Promise<
  [Collection<Room>, MongoClient]
> {
  if (!connectionString) {
    throw new Error(
      "Connection string is undefined. Check your environment variables."
    );
  }

  const mangoclient: MongoClient = await MongoClient.connect(connectionString);
  const database: Db = mangoclient.db("Chappy");
  const collection: Collection<Room> = database.collection<Room>("room");
  return [collection, mangoclient];
}