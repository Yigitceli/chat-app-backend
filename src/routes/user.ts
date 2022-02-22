import express from "express";
import UserModel from "../schema/user.schema";

const router = express.Router();

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
  surname: string;
  avatar?: string;
  authType: string;
}

router.post("/register", async (req, res, next) => {
  const { email, password, name, surname, avatar, authType }: IRegisterBody =
    req.body;

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

    const displayName = name + " " + surname;

    const newUser = new UserModel({
      displayName: displayName,
      email: email,
      password: password,
      avatar: avatar,
      authType: authType,
    });

    await newUser.save();

    return res.status(200).json({ msg: "Registered!", payload: newUser });
  } catch (error) {
    return res.status(500).send("Something gone wrong!");
  }
});

export default router;
