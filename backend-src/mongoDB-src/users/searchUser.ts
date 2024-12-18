import { MongoClient, Collection, WithId } from "mongodb";
import { User } from "../../models/users.js";
import { connectToDatabase } from "./userCon.js";

async function searchUser(query: string): Promise<WithId<User>[]> {
  let dbClient: MongoClient | null = null;
  try {
    // Connect to the database and get the users collection
    const [userCollection, databaseClient]: [Collection<User>, MongoClient] =
      await connectToDatabase();
    dbClient = databaseClient;

    // Construct a case-insensitive regex pattern for partial matches
    const regexQuery = { username: { $regex: new RegExp(query, "i") } };

    // Search for users matching the query
    const users: WithId<User>[] = await userCollection
      .find(regexQuery)
      .toArray();

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  } finally {
    // Ensure the database connection is closed
    if (dbClient) {
      await dbClient.close();
    }
  }
}

export { searchUser };