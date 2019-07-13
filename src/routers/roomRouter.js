import express from "express";
import routes from "../routes";
import { verifyJWT } from "../middleware/JWThelper";
import { createRoom, roomList } from "../controllers/roomController";

const router = express.Router();

// router.use("/", verifyJWT);

router.post(routes.createRoom, createRoom);
router.get(routes.roomList, roomList);
export default router;
