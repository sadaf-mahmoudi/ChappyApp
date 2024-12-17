import { ObjectId } from "mongodb";
import { dmConnect } from "./DMCon.js";

export async function deleteDM(dmId: ObjectId): Promise<boolean> {
  const [collection, client] = await dmConnect();
  try {
    const result = await collection.deleteOne({ id: new ObjectId(dmId) }); // Explicitly use ObjectId
    return result.deletedCount === 1;
  } finally {
    await client.close();
  }
}