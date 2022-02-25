import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { auth } from "firebase-admin";
import UserModel from "../schema/user.schema";
import { RequestCustom, ICustomUser } from "../types/index";

type AuthType = "custom" | "google" | "twitter";

export const verifyToken = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const { authorization, authtype } = req.headers;
  if (<AuthType>authtype === "google") {
    try {
      const data = await auth().verifyIdToken(<string>authorization);
      const user = await UserModel.findOne({ userId: data.uid });
      req.user = <ICustomUser>user;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Token was expired" });
    }
  } else {
    try {
      const user = jwt.verify(
        <string>authorization,
        <string>process.env.JWT_SECRET
      );
      req.user = <ICustomUser>user;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Token was expired" });
    }
  }
};
