import Joi from "joi";
import { ChatMessage } from "../models/ChatMessage.js";

export const RoomMessageSchema = Joi.object({
  messageText: Joi.string().min(1).required().messages({
    "string.base": `"messageText" should be a type of 'text'`,
    "string.empty": `"messageText" cannot be an empty field`,
    "string.min": `"messageText" should have a minimum length of {#limit}`,
    "any.required": `"messageText" is a required field`,
  }),
  roomName: Joi.string().required().messages({
    "string.base": `"roomName" should be a type of 'text'`,
    "string.empty": `"roomName" cannot be an empty field`,
    "any.required": `"roomName" is a required field`,
  }),
  senderName: Joi.string().optional().messages({
    "string.base": `"senderName" should be a type of 'text'`,
  }),
  date: Joi.date().required().messages({
    "date.base": `"date" should be a valid date`,
    "any.required": `"date" is a required field`,
  }),
});

export function isValidRoomMessage(messageRoom: ChatMessage): boolean {
  const result = RoomMessageSchema.validate(messageRoom);
  if (result.error) {
    console.error("Validation Error:", result.error.details);
  }
  return !result.error;
}