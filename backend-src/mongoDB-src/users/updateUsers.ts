// updateUser.ts
import { MongoClient, Collection, ObjectId, UpdateResult } from "mongodb";
import { User } from "../../models/user.js";
import { connectToDatabase } from "./userCon.js";

async function updateUser(
  id: ObjectId,
  body: Partial<User>
): Promise<UpdateResult | null> {
  const [userCollection, client]: [Collection<User>, MongoClient] =
    await connectToDatabase();

  try {
    const result: UpdateResult = await userCollection.updateOne(
      { _id: id },
      { $set: body }
    );
    if (!result.acknowledged) {
      console.error("Could not update the user - update not acknowledged");
      return null;
    }
    console.log(`Updated ${result.matchedCount} user(s).`);
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export { updateUser };