import express from "express";
import routes from "../routes";
import {
  signup,
  login,
  logout,
  userRooms
} from "../controllers/userController";
import { verifyJWT } from "../middleware/JWThelper";

const router = express.Router();
router.post(routes.login, login); // 로그인
router.post(routes.signup, signup); // 회원가입

// router.use("/", verifyJWT); // 토큰 검증 미들웨어

router.post(routes.logout, logout); // 로그아웃

router.get(routes.userRooms, userRooms); // 내 방 리스트

export default router;
