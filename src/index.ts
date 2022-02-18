import express, { Application } from "express";
import cors from "cors";
import 'dotenv/config'


const app: Application = express();

app.use(cors());

app.get("/", (req, res, next) => {
  res.send(process.env.TEST);
});

app.listen(5000, (): void => {
  console.log("Server listening at 5000 Port");
});
