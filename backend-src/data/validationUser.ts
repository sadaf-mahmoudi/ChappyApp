import Joi from "joi";
import { User } from "../models/user.js";

// Set default behavior for all schemas
const schemaDefaults = Joi.defaults((schema) => schema.required());

export const userSchema = schemaDefaults.object({
  username: Joi.string().trim().min(3),
  email: Joi.string().email({ tlds: { allow: true } }), // Ensure the email is valid
  password: Joi.string().min(6),
  image: Joi.string().optional(), // Assuming 'image' is an optional field
});
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function isValidUser(user: User): boolean {
  const result = userSchema.validate(user);
  if (result.error) {
    console.error("Validation error:", result.error.details);
    return false;
  }
  return true;
}

// For PUT requests where fields may be optional
export const userSchemaPut = schemaDefaults.object({
  username: Joi.string().trim().min(3).optional(),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .optional(),
  password: Joi.string().min(6).optional(),
  image: Joi.string().optional(),
});

export function isValidUserPut(user: Partial<User>): boolean {
  const result = userSchemaPut.validate(user);
  if (result.error) {
    console.error("Validation error in PUT:", result.error.details);
    return false;
  }
  return true;
}