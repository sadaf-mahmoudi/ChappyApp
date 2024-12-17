import { Collection, WithId, MongoClient } from "mongodb";
import { Dm } from "../../models/DM.js";
import { dmConnect } from "./DMCon.js";

export async function getMatchingDms(username: string): Promise<WithId<Dm>[]> {
  if (!username || typeof username !== "string") {
    throw new Error("Invalid username provided");
  }

  const [collection, client]: [Collection<Dm>, MongoClient] = await dmConnect();
  try {
    const results = await collection
      .find({
        $or: [{ receiverName: username }, { senderName: username }],
      })
      .toArray();

    if (results.length === 0) {
      console.log(`No matching DMs found for user: ${username}`);
    }

    return results;
  } catch (error) {
    console.error(`Error fetching matching DMs for user: ${username}`, error);
    throw error;
  } finally {
    await client.close();
  }
}