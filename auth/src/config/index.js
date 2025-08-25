import dotenv from "dotenv";
dotenv.config();

export default {
  mongoURI: process.env.MONGODB_AUTH_URI,
  jwtSecret: process.env.JWT_SECRET || "secret",
};
