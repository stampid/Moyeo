import express from "express";
import routes from "../routes";
import { signup, login } from "../controllers/userController";
import { verifyJWT } from "../middleware/JWThelper";

const router = express.Router();
router.post(routes.login, login);
router.post(routes.signup, signup);

router.use("/", async (req, res, next) => {
  console.log(req.headers["x-access-token"]);
  const result = {
    isLogin: null
  };
  const decoded = await verifyJWT(req.headers["x-access-token"]);
  try {
    if (decoded) {
      next();
    } else {
      result.isLogin = false;
      res.status(404);
      res.send(result);
    }
  } catch (err) {
    result.isLogin = false;
    res.status(404);
    res.send(result);
  }
});

router.post("/test", (req, res, next) => {
  res.send("doit!");
});

export default router;
