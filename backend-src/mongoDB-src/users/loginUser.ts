import { LoginResult, User } from "../../models/users.js";
import bcrypt from "bcrypt";
import { connectToDatabase } from "./userCon.js";

async function loginUser(
  username: string,
  password: string
): Promise<LoginResult> {
  const [userCollection] = await connectToDatabase();

  // Kontrollera om användarnamn och lösenord finns
  if (!username || !password) {
    console.log("Username or password is missing.");
    return { success: false, message: "Username and password are required" };
  }

  try {
    console.log("Searching for user:", username);
    const user = await userCollection.findOne<User>({
      password: password,
      username: username,
    });
    if (!user) {
      console.log("User not found");
      return { success: false, message: "Invalid username or password" };
    }

    console.log("User found:", user);
    console.log("Provided password:", password);
    console.log("Stored password hash:", user.password);

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match result:", match);

    if (match) {
      return { success: false, message: "Invalid password" };
    } else {
      return { success: true, message: "Login successful", user };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

export { loginUser };