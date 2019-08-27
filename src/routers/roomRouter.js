import express from "express";
import routes from "../routes";
import { verifyJWT } from "../middleware/JWThelper";
import { createRoom, roomList, member } from "../controllers/roomController";

const router = express.Router();

// router.use("/", verifyJWT);

router.post("/", createRoom);
router.get("/", roomList);
router.get(routes.member, member);
export default router;
