import mongoose from "mongoose";
import { MONGO_URI, MONGO_URI_DEV, NODE_ENV } from "../constants/env.constants";
import { logger } from "../utils/logger.util";

/**
 * Connects the Auth Service to the MongoDB development database.
 * @returns {Promise<void>} A promise that resolves when the connection is established successfully.
 * @throws {Error} If there is an error connecting to the MongoDB database.
 */
const connectToDatabase = async () => {
  const uri = NODE_ENV === "development" ? MONGO_URI_DEV : MONGO_URI;
  try {
    await mongoose.connect(uri);
    logger.info("Successfully connected to MongoDB development database.");
  } catch (error) {
    logger.error("Error connecting Auth Service to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
