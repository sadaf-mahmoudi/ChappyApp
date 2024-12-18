import express, { Router, Request, Response } from "express";
import { fetchAllUsers } from "../mongoDB-src/users/getAllUser.js";
import { ObjectId, WithId } from "mongodb";
import { User } from "../models/users.js";
import { fetchUserById } from "../mongoDB-src/users/getUserById.js";
import { isValidUser } from "../data/validationUser.js";
import { addUser } from "../mongoDB-src/users/addUser.js";
import { updateUser } from "../mongoDB-src/users/updateUsers.js";
import { deleteUser } from "../mongoDB-src/users/deleteUser.js";
import { loginUser } from "../mongoDB-src/users/loginUser.js";
import { searchUser } from "../mongoDB-src/users/searchUser.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const users: WithId<User>[] = await fetchAllUsers();
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Endpoint for searching users by id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if the ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    res.status(400).send("Invalid user ID format.");
  }

  try {
    const mongoObjectId = new ObjectId(id);
    const user = await fetchUserById(mongoObjectId);

    // If no user found, return a 404
    if (!user) {
      res.status(404).send("User not found.");
    }

    // If user is found, return it
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for searching users by a query string (e.g., username)
router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.trim().length === 0) {
    res.status(400).json({ message: "Search query cannot be empty." });
    return;
  }

  try {
    const users = await searchUser(query);
    if (users.length === 0) {
      res.status(404).json({ message: "No users found." });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// endpoint for adding users
router.post("/addUser", async (req: Request, res: Response) => {
  const newUser: User = req.body;
  if (!isValidUser(newUser)) {
    res.status(400).json({ message: "Failed to create user. Invalid data." });
  }

  try {
    const userId = await addUser(newUser);
    if (!userId) {
      res.status(409).json({ message: "User already exists." });
    }
    res.status(201).json({ ...newUser, _id: userId });
  } catch (error) {
    console.error("Error adding user:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});
// Endpoint for updating users by id
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<User> = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(404).send("No users found");
    }

    const objectId = new ObjectId(id);
    const result = await updateUser(objectId, body);

    if (!result) {
      res.status(404).json({
        message: "No user found with the given ID or no changes made.",
      });
    } else if (result.matchedCount === 0) {
      res.status(404).json({ message: "No user found with the given ID." });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Endpoint for deleting users
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format." });
    }

    const objectId = new ObjectId(id);
    const result = await deleteUser(objectId);

    if (!result) {
      res.status(404).json({
        message: "No user found with the given ID or deletion failed.",
      });
    } else if (result.deletedCount === 0) {
      res.status(404).json({ message: "No user found with the given ID." });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);

  if (result.success) {
    res.status(200).json({ message: result.message, user: result.user });
  } else {
    res.status(401).json({ message: result.message });
  }
});

// Endpoint för gästinloggning
router.post("/guestLogin", async (_req: Request, res: Response) => {
  try {
    // Skapa eller hämta en generisk gästanvändarprofil
    const guestUser = {
      username: "Guest",
      role: "guest",
    };

    res.status(200).json({
      message: "Guest login successful",
      user: guestUser,
    });
  } catch (error) {
    console.error("Error handling guest login:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Logout endpoint
router.post("/logout", (_req: Request, res: Response) => {
  try {
    // Om du använder en JWT-strategi: skickar bara en bekräftelse på att logout är klar
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed." });
  }
});

// Lägg till denna endpoint i din backend i userRoutes eller i en motsvarande fil
router.get("/activeuser", (req: Request, res: Response) => {
  if (!process.env.SECRET_KEY) {
    res.sendStatus(500);
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.sendStatus(401); // Unauthorized om ingen token skickas
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
    const userId = payload.userId;
    if (userId) {
      res.status(200).json({ userId }); // Returnera användarens ID eller annan användarinformation
    } else {
      res.sendStatus(400); // Bad Request om userId saknas
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.sendStatus(401); // Unauthorized om token-verifiering misslyckas
  }
});

export default router;