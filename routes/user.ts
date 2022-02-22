import express from "express";

const router = express.Router();

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
  surname: string;
}

router.post("/register", (req, res, next) => {
  const { email, password, name, surname }: IRegisterBody = req.body;

  const emailRegEx = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
  const passwordRegEx = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.-_])(?=.{8,})"
  );

  try {
    if (!email || !password || !name || !surname) {
      return res.status(404).json({ msg: "Invalid Inputs" });
    }

    if (emailRegEx.test(email) || passwordRegEx.test(password)) {
      return res.status(406).json({ msg: "Invalid Inputs" });      
    }

    


  } catch (error) {}
});

export default router;
