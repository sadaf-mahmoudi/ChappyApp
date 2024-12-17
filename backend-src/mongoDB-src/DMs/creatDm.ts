import { MongoClient, Collection, ObjectId, InsertOneResult } from "mongodb";
import { Dm } from "../../models/DM.js";
import { dmConnect } from "./DMCon.js";

export async function creatDm(dm: Dm): Promise<ObjectId | null> {
  const [collection, client]: [Collection<Dm>, MongoClient] = await dmConnect();
  try {
    const result: InsertOneResult<Dm> = await collection.insertOne(dm);
    return result.insertedId;
  } finally {
    await client.close();
  }
}