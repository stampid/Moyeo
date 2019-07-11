import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createJWT = email => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        email
      },
      process.env.JWTSECRET,
      {
        expiresIn: "1m"
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;
  const result = { isLogin: null };

  jwt.verify(token, process.env.JWTSECRET, (err, decode) => {
    if (err) {
      console.log("************", err);
      result.isLogin = false;
      res.status(404);
      res.send(result);
    } else {
      next();
    }
  });
};

// export const verifyJWT = token => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, process.env.JWTSECRET, (err, decode) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(decode);
//     });
//   });
// };

// jwt 생성은 됨
// refresh 기능은 아직 만들지 못함
// 토큰을 전달하는 방식은 json 파일로 클라이언트에 보내주고
// 클라이언트에서는 header에 담아서 보내준다.
// 토큰 생성 함수를 사용하기 위해서는
// async await를 사용해야한다.
