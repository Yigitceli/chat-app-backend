import express, { NextFunction } from "express";
import { Socket } from "socket.io";
import ChatModel from "../schema/chat.schema";
import UserModel from "../schema/user.schema";
import { verifyToken } from "../services/auth";
import { IPersonChat, RequestCustom } from "../types";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  async (req: RequestCustom, res, next: NextFunction) => {
    const user = req.user;
    try {
      const chats = await ChatModel.find({
        users: { $elemMatch: { userId: user?.userId } },
      });
      return res
        .status(200)
        .json({ msg: "Chats are successfully fetched!", payload: chats });
    } catch (error) {
      return res.status(500).json({ msg: "Something gone wrong!" });
    }
  }
);

router.put(
  "/:userID",
  verifyToken,
  async (req: RequestCustom, res, next: NextFunction) => {
    const { chatText } = req.body;
    const { userID } = req.params;
    const user = req.user;
    try {
      const chatCheck = await ChatModel.findOne({
        $and: [{ "users.userId": user?.userId }, { "users.userId": userID }],
      });
      const chatBody: IPersonChat = {
        user: user!,
        chat: chatText,
        createdAt: new Date(),
      };
      if (!chatCheck) {
        try {
          const userData = await UserModel.findOne({ userId: userID });
          const Chat = new ChatModel({
            users: [user, userData],
            chats: [chatBody],
          });
          await Chat.save();
          Socket
          return res
            .status(200)
            .json({ msg: "Chat succesfully created!", payload: Chat });
        } catch (error) {
          return res.status(404).json({ msg: "User does not exist!" });
        }
      } else {
        await chatCheck.update({ $push: { chats: chatBody } });             
        return res
          .status(200)
          .json({ msg: "Message Send", payload: chatCheck });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Something gone wrong!" });
    }
  }
);

export default router;
