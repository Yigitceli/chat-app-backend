import { Request } from "express";

export interface ICustomUser {  
  displayName: string;
  email: string;
  password?: string;
  authType: string;
  avatar: string;
  friends: ICustomUser[];
  userId: string;
}

export interface RequestCustom extends Request {
  user?: ICustomUser;
}
