import express, { Request, Response } from "express";
import { dmConnect } from "../mongoDB-src/DMs/DMCon.js";
import { Dm } from "../models/DM.js";
import { getAllDms } from "../mongoDB-src/DMs/fetchUserDM.js";
import { getMatchingDms } from "../mongoDB-src/DMs/getMachningDms.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { textMessage, receiverName, senderName } = req.body;

  // Kontrollera att alla fält är ifyllda
  if (!textMessage || !receiverName || !senderName) {
    res.status(400).json({ error: "All fields are required." });
  }

  const newDm: Dm = {
    textMessage,
    receiverName,
    senderName,
    date: new Date(), // Lägg till korrekt tidsstämpel
  };

  const [collection, client] = await dmConnect();

  try {
    const result = await collection.insertOne(newDm);
    res.status(201).json({
      _id: result.insertedId,
      ...newDm,
    }); // Skicka tillbaka det nya meddelandet inklusive dess ID
  } catch (error) {
    console.error("Failed to create DM:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Hämta DM för en specifik användare
router.get("/", async (req: Request, res: Response) => {
  const username = req.query.username as string; // Tvingar TypeScript att tolka `username` som en sträng

  if (!username || typeof username !== "string") {
    res.status(400).json({ error: "Invalid or missing username." });
  }

  try {
    const dms = await getMatchingDms(username); // Använder funktionen `getMatchingDms`
    if (dms.length === 0) {
      res.status(404).json({ message: `No DMs found for user: ${username}` });
    }
    res.status(200).json(dms); // Returnerar DM-listan
  } catch (error) {
    console.error(`Error fetching DMs for user: ${username}`, error);
    res.status(500).json({ error: "Failed to fetch DMs." });
  }
});

router.get("/all", async (_req: Request, res: Response) => {
  try {
    const dms = await getAllDms(); // Använder `getAllDms` för att hämta alla DMs
    if (dms.length === 0) {
      res.status(404).json({ message: "No DMs found." });
    }
    res.status(200).json(dms); // Returnerar alla DMs
  } catch (error) {
    console.error("Error fetching all DMs:", error);
    res.status(500).json({ error: "Failed to fetch DMs." });
  }
});

// Hämta DMs mellan två användare
router.get("/between", async (req: Request, res: Response) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    res.status(400).json({ error: "Both usernames are required." });
  }

  const [collection, client] = await dmConnect();

  try {
    const messages = await collection
      .find({
        $or: [
          { senderName: user1, receiverName: user2 },
          { senderName: user2, receiverName: user1 },
        ],
      })
      .sort({ date: 1 })
      .toArray();

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    await client.close();
  }
});

// Gruppera DM per deltagare
router.get("/dm-list", async (req: Request, res: Response) => {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    res.status(400).json({ error: "A valid username is required." });
  }

  try {
    const [collection, client] = await dmConnect();

    // Hämta alla meddelanden där användaren är antingen mottagare eller avsändare
    const dms = await collection
      .find({
        $or: [{ senderName: username }, { receiverName: username }],
      })
      .toArray();

    // Extrahera unika deltagare från meddelandena
    const participants = new Set<string>();
    dms.forEach((dm) => {
      if (dm.senderName !== username) participants.add(dm.senderName);
      if (dm.receiverName !== username) participants.add(dm.receiverName);
    });

    await client.close();

    // Returnera en lista över deltagare
    res.status(200).json(Array.from(participants));
  } catch (error) {
    console.error("Error fetching DM list:", error);
    res.status(500).json({ error: "Failed to fetch DM list." });
  }
});

router.delete("/delete", async (req: Request, res: Response) => {
  const { username, recipient } = req.query;

  if (!username || !recipient) {
    res
      .status(400)
      .json({ error: "Both username and recipient are required." });
  }

  try {
    const [collection, client] = await dmConnect();

    // Ta bort DM mellan användare och recipient
    await collection.deleteMany({
      $or: [
        { senderName: username, receiverName: recipient },
        { senderName: recipient, receiverName: username },
      ],
    });

    await client.close();

    res.status(200).send({ message: "DM deleted successfully" });
  } catch (err) {
    console.error("Error deleting DM:", err);
    res.status(500).send({ error: "Failed to delete DM." });
  }
});

export default router;