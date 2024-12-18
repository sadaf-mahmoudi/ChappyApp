import { MongoClient, Collection, WithId, ObjectId, FindCursor } from "mongodb";
import { User } from "../../models/users.js";
import { connectToDatabase } from "./userCon.js";

async function fetchUserById(userId: ObjectId): Promise<WithId<User>[]> {
  try {
    const [userCollection, databaseClient]: [Collection<User>, MongoClient] =
      await connectToDatabase();
    const query = { _id: userId };
    const userCursor: FindCursor<WithId<User>> = userCollection.find(query);
    const userResult: WithId<User>[] = await userCursor.toArray();
    if (userResult.length === 0) {
      console.log("No user available with the provided ID.");
    }
    await databaseClient.close();
    return userResult;
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    throw error;
  }
}

export { fetchUserById };