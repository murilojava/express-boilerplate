import mongoose from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
});

export const UserModel = mongoose.model("User", userSchema);
