import express from "express";
import routes from "../routes";
import { verifyJWT } from "../middleware/JWThelper";
import { createRoom, listRoom } from "../controllers/roomController";

const router = express.Router();

// router.use("/", verifyJWT);

router.post(routes.createRoom, createRoom);
router.post(routes.entryRoom, listRoom);
export default router;
