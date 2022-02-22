import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRouter);

app.get("/", (req, res, next) => {
  res.send(process.env.TEST);
});

app.listen(5000, (): void => {
  mongoose.connect(`${process.env.DATABASE_URL}`).then(() => {
    console.log("Server listening at 5000 Port");
    console.log("MongoDB Connected!");
  });
});
