import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import chatRouter from "./routes/chat";
import { credential, ServiceAccount } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import firebaseConfig from "./firebaseConfig.json";
import morgan from "morgan";
import * as socketio from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socketTypes";

const app: Application = express();

initializeApp({
  credential: credential.cert(<ServiceAccount>firebaseConfig),
});
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/chat", chatRouter);

app.get("/", (req, res, next) => {
  res.send(process.env.TEST);
});

const server = app.listen(5000, (): void => {
  mongoose.connect(`${process.env.DATABASE_URL}`).then(() => {
    console.log("Server listening at 5000 Port");
    console.log("MongoDB Connected!");
  });
});
const io = new socketio.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: socketio.Socket) => {
  console.log(socket.connected);
});
