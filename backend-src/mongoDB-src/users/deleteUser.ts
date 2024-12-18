import { MongoClient, Collection, ObjectId, DeleteResult } from "mongodb";
import { User } from "../../models/users.js"; // Make sure this path is correct
import { connectToDatabase } from "./userCon.js"; // Adjust this path to point to your database connection utility

export async function deleteUser(id: ObjectId): Promise<DeleteResult | null> {
  const [userCollection, client]: [Collection<User>, MongoClient] =
    await connectToDatabase();

  try {
    const result: DeleteResult = await userCollection.deleteOne({ _id: id });
    if (!result.acknowledged) {
      console.error("Could not delete the user - operation not acknowledged");
      return null;
    }
    console.log(`Deleted ${result.deletedCount} user(s).`);
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    await client.close();
  }
}