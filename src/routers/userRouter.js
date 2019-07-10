import express from "express";
import routes from "../routes";
import { users } from "../controllers/userController";

const router = express.Router();
router.get("/", users);

export default router;
