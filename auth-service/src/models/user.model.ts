import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt.util";
import Audience from "../constants/audience.constants";
import OAuth from "../constants/oAuthStrategies.constants";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  role: Audience;
  oAuthStrategy?: OAuth;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String },
    verified: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      required: true,
      default: Audience.User,
    },
    oAuthStrategy: {
      type: String,
      default: OAuth.Email,
    },
  },
  {
    timestamps: true,
  },
);

// Hook to hash the password first before saving the user model
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password before saving the user model
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
