import dotenv from "dotenv";

dotenv.config();

const rawCorsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const config = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || "dnd_workshop",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Email
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@dndworkshop.com",
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || "smtp",
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.mailtrap.io",
  EMAIL_PORT: process.env.EMAIL_PORT || 2525,
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",

  // CORS
  CORS_ORIGINS: rawCorsOrigins,

  // API
  API_VERSION: "v1",
  API_PREFIX: "/api/v1",
};

export default config;
