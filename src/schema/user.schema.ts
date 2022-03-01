import mongoose from "mongoose";
const { Schema, model } = mongoose;

interface IUser {
  userId: string;
  displayName: string;
  email: string;
  password?: string;
  avatar?: string;
  authType: "google" | "twitter" | "custom";  
}

const userSchema = new Schema<IUser>({
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  password: String,
  authType: { type: String || null, required: true },
  avatar: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/chat-app-f368c.appspot.com/o/blank-profile-picture-973460_960_720.png?alt=media&token=bfd9ac78-bd77-42d3-867a-a95b912b508e",
  }, 
  userId: { type: String, required: true },
});
userSchema.index({ displayName: "text", email: "text" });
const UserModel = model<IUser>("User", userSchema);

export default UserModel;
