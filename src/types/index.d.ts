import { Request } from "express";
import { IChat } from "../schema/chat.schema";
import { ServerToClientEvents } from "./socketTypes";

export interface ICustomUser {
  displayName: string;
  email: string;
  password?: string;
  authType: string;
  avatar: string;
  userId: string;
}

export interface RequestCustom extends Request {
  user?: ICustomUser;
}

export interface IPersonChat {
  user: ICustomUser;
  chat: string;
  createdAt: Date;
}

export interface CustomServerToClientEvents extends ServerToClientEvents {
  recieveMessage: (data: any) => void;
}
