import express from "express";
import routes from "../routes";
import { signup, login } from "../controllers/userController";
import { verifyJWT } from "../middleware/JWThelper";

const router = express.Router();
router.post(routes.login, login);
router.post(routes.signup, signup);

router.use("/", verifyJWT);

router.post("/test", (req, res) => {
  res.send("doit!");
});

export default router;
