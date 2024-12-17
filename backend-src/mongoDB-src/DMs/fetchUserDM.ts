import { MongoClient, Collection, WithId } from "mongodb";
import { Dm } from "../../models/DM.js";
import { dmConnect } from "./DMCon.js";

export async function getAllDms(): Promise<WithId<Dm>[]> {
  const [collection, client]: [Collection<Dm>, MongoClient] = await dmConnect();
  try {
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching DMs:", error);
    throw error; // Propagate the error to the caller
  } finally {
    await client.close();
  }
}