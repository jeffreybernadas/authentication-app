import _ from "lodash";
import { SortOrder, FilterQuery } from "mongoose";

import { NOT_FOUND, OK } from "../constants/http.constants";
import UserModel, { UserDocument } from "../models/user.model";
import appAssert from "../utils/appAssert.util";
import catchErrors from "../utils/catchErrors.util";
import { buildDynamicFilter } from "../utils/helpers.util";

export const getUsersHandler = catchErrors(async (req, res) => {
  const reqQuery = req.query;
  let page = 0;
  let limit = 10;
  const sortOrder: { [key: string]: SortOrder } = {};
  let query: FilterQuery<UserDocument> = {};
  let selectFields = "";

  // **1. Pagination logic**
  if (reqQuery.page) {
    page = Number(reqQuery.page);
  }

  if (reqQuery.limit) {
    limit = Number(reqQuery.limit);
  }

  // **2. Filter logic**
  if (reqQuery.filter && typeof reqQuery.filter === "object") {
    query = buildDynamicFilter(reqQuery.filter);
  } else {
    query = buildDynamicFilter(reqQuery);
  }

  // **3. Sort logic**
  if (reqQuery.sort) {
    const [field, direction] = (reqQuery.sort as string).split(" ");
    if (field && direction) {
      sortOrder[field] = direction === "desc" ? -1 : 1;
    }
  }

  // **4. Fields logic (specific fields to return)**
  if (reqQuery.fields) {
    selectFields = (reqQuery.fields as string).split(",").join(" ");
  }

  // **5. Pagination setup (skip and limit)**
  const skip = (page) * limit;

  // **6. Count total documents (for pagination)**
  const totalCount = await UserModel.countDocuments(query);

  // **7. Execute the final query**
  const users = await UserModel.find(query)
    .select(selectFields) // Select specific fields if provided
    .sort(sortOrder) // Apply sorting
    .skip(skip) // Skip for pagination
    .limit(limit); // Limit number of documents

  // **Remove the password field from each user**
  const sanitizedUsers = users.map((user) =>
    _.omit(user.toObject(), ["password"]),
  );

  if (users.length === 0) {
    return res.status(NOT_FOUND).json({ message: "No users found." });
  }

  return res.status(OK).json({
    totalCount,
    page,
    limit,
    users: sanitizedUsers,
  });
});

export const getMeHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found.");
  return res.status(OK).json(_.omit(user.toObject(), ["password"]));
});
