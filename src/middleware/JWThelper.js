import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createJWT = email => {
  const { JWTSECRET, JWTTOKEN } = process.env;
  const token = jwt.sign({ email }, JWTSECRET, { expiresIn: JWTTOKEN }); // access Token 생성

  return token;
};

export const verifyJWT = (req, res, next) => {
  const { JWTSECRET } = process.env;
  const token = req.headers["x-access-token"] || req.query.token;
  const result = { isLogin: null };

  jwt.verify(token, JWTSECRET, (err, _) => {
    if (err) {
      result.isLogin = false;
      res.status(404);
      res.send(result);
    } else {
      next();
    }
  });
};
