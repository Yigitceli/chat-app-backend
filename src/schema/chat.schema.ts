import mongoose from "mongoose";
import { type } from "os";
import { ICustomUser, IPersonChat } from "../types";
import UserModel from "./user.schema";
const { Schema, model } = mongoose;

export interface IChat {
  users: ICustomUser[];
  chats: IPersonChat[];
}

const chatSchema = new Schema<IChat>({
  users: Array,
  chats: Array,
});
const ChatModel = model<IChat>("chat", chatSchema);

export default ChatModel;
