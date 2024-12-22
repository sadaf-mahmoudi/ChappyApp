import express, { Express, NextFunction, Request, Response } from "express";
import userRoutes from "./routes/userRoutes.js"; 
import chatMessagesRouter from "./routes/RoomMessageRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import dmRoutes from "./routes/DMRoutes.js";

const port: number = Number(process.env.PORT || 2000);

const app: Express = express();

app.use("/", express.json());
app.use("/", (req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});
app.use("/api/user", userRoutes);
app.use("/api/message", chatMessagesRouter);
app.use("/api/room", roomRoutes);
app.use("/api/dm", dmRoutes);
app.use("/", express.static("./dist"));

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});