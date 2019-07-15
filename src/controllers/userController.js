import { User, Room, UserRoom } from "../../models/index";
import hash from "../middleware/crypto";
import { createJWT } from "../middleware/JWThelper";
import sequelize from "sequelize";

// 회원가입 함수
export const signup = (req, res) => {
  const { email, nickname, region, age, gender } = req.body;
  const result = {
    success: null
  };
  let { password } = req.body;
  password = hash(password);

  User.create({
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

// 로그인 함수
export const login = (req, res) => {
  const { email } = req.body;
  const result = {
    isLogin: null,
    token: null,
    data: null
  };
  let { password } = req.body;

  password = hash(password);
  User.findOne({
    where: { email, password },
    attributes: ["id", "email", "nickname", "region", "age", "gender"]
  })
    .then(async data => {
      const token = createJWT(data.email);
      if (token) {
        result.isLogin = true;
        result.token = token;
        result.data = data;
        res.status(200);
        res.send(result);
      } else {
        result.isLogin = false;
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
};

// 로그아웃 함수
export const logout = (req, res) => {
  const result = {
    isLogin: false
  };
  res.status(200);
  res.send(result);
};

// 유저 룸 리스트 필터 함수
export const userRooms = (req, res) => {
  const { userId } = req.query;
  const result = { success: null, data: null };

  User.findAll({
    where: { id: userId },
    include: [
      {
        model: Room,
        as: "rooms",
        through: {
          required: true
        }
      }
    ]
  }).then(data => {
    result.success = true;
    result.data = data[0].rooms;
    res.status(200);
    res.send(result);
  });
};
