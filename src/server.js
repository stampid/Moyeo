import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import socketIO from "socket.io";
import socketController from "./socket.io/socketConroller";
import { sequelize } from "../models";
import routes from "./routes"; // 분기를 위한 url 모음 파일
import userRouter from "./routers/userRouter"; // userRouter 파일

// const Sequelize = require("sequelize");

require("dotenv").config();

const app = express();
const { PORT } = process.env;

app.use(logger("dev"));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes.users, userRouter);
// app.use(routes.rooms);
// app.use(routes.schedules);

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

const io = socketIO.listen(server);

io.on("connection", socket => socketController(socket));

// sequelize.sync();
