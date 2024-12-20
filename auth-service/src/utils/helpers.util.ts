import mongoose, { FilterQuery } from "mongoose"; // For ObjectId
import { UserDocument } from "../models/user.model";

// Helper function to check if a value is a valid ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Helper function to check if a value is a valid date
const isValidDate = (date: string) => !isNaN(Date.parse(date));

/**
 * Builds a dynamic filter object for MongoDB queries based on query parameters.
 *
 * @param query - The query parameters from the request (req.query).
 * @returns A dynamic filter object for MongoDB queries.
 */
export const buildDynamicFilter = (
  query: FilterQuery<UserDocument>,
): FilterQuery<UserDocument> => {
  const filters: FilterQuery<UserDocument> = {};
  const excludedKeys = ["sort", "page", "limit", "fields"];

  Object.entries(query).forEach(([key, value]) => {
    if (excludedKeys.includes(key)) {
      return;
    }
    if (value === "true" || value === "false") {
      filters[key] = value === "true";
    } else if (isValidObjectId(value)) {
      filters[key] = new mongoose.Types.ObjectId(value as string);
    } else if (isValidDate(value)) {
      filters[key] = new Date(value);
    } else if (!isNaN(Number(value))) {
      filters[key] = Number(value);
    } else {
      filters[key] = { $regex: new RegExp(value as string, "i") };
    }
  });

  return filters;
};
