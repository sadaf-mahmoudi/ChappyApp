import { MongoClient, Db, Collection } from "mongodb";
import { Dm } from "../../models/DM";

const connectionString: string | undefined = process.env.CONNECTION_STRING;

export async function dmConnect(): Promise<[Collection<Dm>, MongoClient]> {
  if (!connectionString) {
    throw new Error("Connection string is undefined. Check your .env file!");
  }

  const client: MongoClient = await MongoClient.connect(connectionString);
  const db: Db = client.db("Chappy");
  const collection: Collection<Dm> = db.collection("DmMessage");
  return [collection, client];
}