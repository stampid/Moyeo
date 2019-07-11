import { users } from "../../models/index";
import hash from "../middleware/crypto";
import { createJWT } from "../middleware/JWThelper";

export const signup = (req, res) => {
  const { email, nickname, region, age, gender } = req.body;
  const result = {
    success: null
  };
  let { password } = req.body;
  password = hash(password);

  users
    .create({
      email,
      password,
      nickname,
      region,
      age,
      gender
    })
    .then(data => {
      result.success = true;
      res.status(200);
      res.send(result);
    })
    .catch(err => {
      result.error = err;
      result.success = false;
      res.status(404);
      res.send(result);
    });
};

export const login = (req, res) => {
  const { email } = req.body;
  const result = {
    isLogin: null,
    token: null,
    data: null
  };
  let { password } = req.body;

  password = hash(password);
  users
    .findOne({ where: { email, password } })
    .then(async data => {
      const token = await createJWT(data.email);
      try {
        result.isLogin = true;
        result.token = token;
        result.data = data;
        res.status(200);
        res.send(result);
      } catch (err) {
        result.isLogin = false;
        result.error = err;
        res.status(404);
        res.send(result);
      }
    })
    .catch(err => {
      result.isLogin = false;
      result.error = err;
      res.status(404);
      res.send(result);
    });
  //   res.send("hello");
};
