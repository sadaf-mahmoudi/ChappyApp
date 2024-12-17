import Joi from "joi";
import { Dm } from "../models/DM";

export const DmMessageSchema = Joi.object({
  textMessage: Joi.string().min(1).required(),
  receiverName: Joi.string().min(1).required(),
  senderName: Joi.string().min(1).required(),
  date: Joi.date().optional(),
}).required();

export function isValidDm(dm: Dm): boolean {
  const result = DmMessageSchema.validate(dm);
  return !result.error;
}