import { MongoClient, Db, Collection } from "mongodb";
import { User } from "../../models/user.js"; // Ensure this path correctly points to your User model

// Environment variable for MongoDB connection string
const dbConnection: string | undefined = process.env.CONNECTION_STRING;

export async function connectToDatabase(): Promise<
  [Collection<User>, MongoClient]
> {
  if (!dbConnection) {
    console.error(
      "Database connection string is missing in the environment settings."
    );
    throw new Error("Database connection string is undefined.");
  }

  const mongoClient: MongoClient = await MongoClient.connect(dbConnection);
  const database: Db = mongoClient.db("Chappy");
  const userCollection: Collection<User> = database.collection<User>("user");

  return [userCollection, mongoClient];
}