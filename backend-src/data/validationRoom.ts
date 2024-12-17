import Joi from "joi";
import { Room } from "../models/Room.js";

export const roomSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  isActive: Joi.boolean().required(),
});

export function validateRoom(room: Room): boolean {
  const result = roomSchema.validate(room);
  return !result.error;
}