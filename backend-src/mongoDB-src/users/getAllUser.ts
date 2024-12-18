import { MongoClient, Collection, WithId } from "mongodb";
import { User } from "../../models/users.js";
import { connectToDatabase } from "../users/userCon.js";

let client: MongoClient;
async function fetchAllUsers(): Promise<WithId<User>[]> {
  try {
    const [userCollection, dbClient]: [Collection<User>, MongoClient] =
      await connectToDatabase();
    client = dbClient; // Assign to outer scope for finally block

    const users: WithId<User>[] = await userCollection.find({}).toArray();
    console.log("Fetched all users from the database.", users);
    if (!users.length) {
      console.log("No users found in the database.");
    }
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error; // Rethrow after logging
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export { fetchAllUsers };