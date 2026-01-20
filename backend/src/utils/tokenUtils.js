import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export default { generateToken, verifyToken };
