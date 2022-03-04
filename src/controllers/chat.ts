import ChatModel from "../schema/chat.schema";
import UserModel from "../schema/user.schema";
import { ICustomUser, IPersonChat } from "../types";

export const SENDMESSAGE = async ({
  user,
  chatUserId,
  chatText,
}: {
  user: ICustomUser;
  chatUserId: string;
  chatText: string;
}) => {
  try {
    const chatCheck = await ChatModel.findOne({
      $and: [{ "users.userId": user.userId }, { "users.userId": chatUserId }],
    });

    const chatBody: IPersonChat = {
      user: user!,
      chat: chatText,
      createdAt: new Date(),
    };
    if (!chatCheck) {
      try {
        const userData = await UserModel.findOne({ userId: chatUserId });
        const Chat = new ChatModel({
          users: [user, userData],
          chats: [chatBody],
        });
        await Chat.save();        
        return Chat;
      } catch (error) {}
    } else {
      await chatCheck.updateOne({ $push: { chats: chatBody } });
      const newChat = await ChatModel.findOne({
        $and: [{ "users.userId": user.userId }, { "users.userId": chatUserId }],
      });
      return newChat;
    }
  } catch (error) {
    return;
  }
};
