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
import { verifyToken } from "./services/auth";
import { SENDMESSAGE } from "./controllers/chat";
import { CustomServerToClientEvents, ICustomUser, IPersonChat } from "./types";
import { users } from "./socketUsers";

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

export const io: socketio.Server<CustomServerToClientEvents> =
  new socketio.Server<
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
//final Touch

io.on("connection", (socket: socketio.Socket) => {
  socket.on("joined", ({ userId }) => {
    Object.assign(users, { [userId]: socket.id });
    socket.emit("joined", { socketId: users[userId] });
  });

  socket.on(
    "sendMessage",
    async ({
      chatUserId,
      user,
      chatText,
    }: {
      chatUserId: string;
      user: ICustomUser;
      chatText: string;
    }) => {
      const newChat = await SENDMESSAGE({ user, chatUserId, chatText });

      const user1 = <string>users[chatUserId];
      const user2 = <string>users[user.userId];
      io.to([user1, user2]).emit("recieveMessage", { newChat });
    }
  );
  socket.on("writting", ({ chatUserId, isWritting }) => {
    const user = <string>users[chatUserId];    
    socket.to(user).emit("writting", isWritting);
  });
});
