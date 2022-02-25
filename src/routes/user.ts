import express, { Request } from "express";
import UserModel from "../schema/user.schema";
import bcrypt from "bcrypt";
import mongoose, { ObjectId } from "mongoose";
import { uuid } from "uuidv4";
import { auth } from "firebase-admin";
import jwt from "jsonwebtoken";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { verifyToken } from "../services/auth";
import axios from "axios";
import { RequestCustom } from "../types";

const router = express.Router();

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
  surname: string;
  avatar?: string;
  authType: string;
}

interface ILoginBody {
  email: string;
  bodyPassword: string;
}

interface ICustomUser {
  displayName: string;
  email: string;
  password?: string;
  authType: string;
  avatar?: string;
  friends?: ICustomUser[];
  userId: string;
}

router.get("/", verifyToken, async (req: RequestCustom, res, next) => {
  const { value } = req.query;

  try {
    const users = await UserModel.find(
      { $text: { $search: <string>value } },
      { password: 0 }
    );
    if (users.length <= 0) {
      return res.status(404).json({ msg: "No users found!" });
    }
    return res.status(200).json({ msg: "Users Send!", payload: users });
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong" });
  }
});

router.post("/register", async (req, res, next) => {
  let { email, password, name, surname, authType }: IRegisterBody = req.body;

  const emailRegEx = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
  const passwordRegEx = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.-_])(?=.{8,})"
  );

  try {
    if (!email || !password || !name || !surname) {
      return res.status(404).json({ msg: "Invalid Inputs" });
    }

    if (!emailRegEx.test(email) || !passwordRegEx.test(password)) {
      return res.status(406).json({ msg: "Invalid Inputs" });
    }
    email = email.toLowerCase();
    const userCheck = await UserModel.findOne({ email });
    if (userCheck) {
      return res.status(406).json({ msg: "Email is already taken!" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const displayName =
      name.slice(0, 1).toUpperCase() +
      name.slice(1) +
      " " +
      surname.slice(0, 1).toUpperCase() +
      surname.slice(1);

    const newUser = new UserModel<ICustomUser>({
      displayName: displayName,
      email: email,
      password: hashed,
      authType: authType,
      userId: uuid(),
    });

    await newUser.save();
    return res.status(200).json({ msg: "Registered!", payload: newUser });
  } catch (error) {
    return res.status(500).send("Something gone wrong!");
  }
});

router.post("/login", async (req, res, next) => {
  let { email, bodyPassword }: ILoginBody = req.body;
  const { authtype } = req.headers;
  const { authorization } = req.headers;

  if (authtype === "google" && authorization) {
    try {
      try {
        var googleUser = await auth().verifyIdToken(authorization);
      } catch (error) {
        return res.status(402).json({ msg: "Unauthorized Access!" });
      }

      const userCheck = await UserModel.findOne({
        email: googleUser.email,
      });
      if (userCheck && userCheck.authType === "custom") {
        return res.status(406).json({ msg: "Email is already exist!" });
      }

      if (userCheck) {
        return res
          .status(200)
          .json({ msg: "Successfully logged in.", payload: userCheck });
      }

      const user = new UserModel<ICustomUser>({
        displayName: googleUser.name,
        email: googleUser.email!,
        authType: authtype,
        userId: googleUser.uid,
        avatar: googleUser.picture,
      });

      await user.save();

      return res
        .status(200)
        .json({ msg: "Successfully logged in.", payload: user });
    } catch (error) {
      return res.status(500).send("Something gone wrong!");
    }
  }

  if (authtype === "custom") {
    try {
      if (!email || !bodyPassword) {
        return res.status(404).json({ msg: "Invalid Inputs" });
      }
      email = email.toLowerCase();

      const user: ICustomUser | null = await UserModel.findOne({
        email,
        authtype,
      });
      if (!user) {
        return res.status(404).json({ msg: "Email isn't exist!" });
      }

      if (!bcrypt.compareSync(bodyPassword, user.password!)) {
        return res.status(406).json({ msg: "Password isn't correct!" });
      }

      const accessToken = jwt.sign({ ...user }, `${process.env.JWT_SECRET}`, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(
        { ...user },
        `${process.env.REFRESH_SECRET}`,
        {
          expiresIn: "90days",
        }
      );

      return res.status(200).json({
        msg: "Logged in!",
        payload: { data: user, accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).send("Something gone wrong!");
    }
  }
});

router.post("/refresh-token", async (req, res, next) => {
  const { authtype } = req.headers;
  const { refreshToken } = req.body;
  if (authtype === "google") {
    try {
      const { data } = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${<string>(
          process.env.API_KEY
        )}`,
        { grant_type: "refresh_token", refresh_token: refreshToken }
      );
      return res
        .status(200)
        .json({ response: "Token renewed.", payload: data.access_token });
    } catch (error) {
      return res.status(500).send("Something Gone Wrong!");
    }
  } else {
    const data = jwt.verify(
      <string>req.body.refreshToken,
      <string>process.env.REFRESH_SECRET
    );
    const accessToken = jwt.sign(data, <string>process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ response: "Token renewed.", payload: accessToken });
  }
});

export default router;
