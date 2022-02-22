import mongoose from "mongoose";
const { Schema, model } = mongoose;

interface IUser {
  displayName: string;
  email: string;
  password: string;
  avatar?: string;
  authType: "google" | "twitter" | "custom";
  friends: IUser[];
}

const userSchema = new Schema<IUser>({
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  authType: { type: String, required: true },
  avatar: String,
  friends: Array,
});
const UserModel = model<IUser>("User", userSchema);
export default UserModel;
