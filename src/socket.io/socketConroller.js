import jwt from "jsonwebtoken";
import sequelize from "sequelize";
import dotenv from "dotenv";
import {
  UserRoom,
  Pole,
  Room,
  User,
  PoleUser,
  Schedule,
  UserSchedule
} from "../../models/index";

dotenv.config();

function pad2(n) {
  return n < 10 ? "0" + n : n;
}

const socketController = socket => {
  console.log("hi");

  // 토큰 검증
  // socket.use((_, next) => {
  //   const token =
  //     socket.handshake.query.Token === undefined
  //       ? "something"
  //       : socket.handshake.query.Token;
  //   const { JWTSECRET } = process.env;

  //   jwt.verify(token, JWTSECRET, (err, _) => {
  //     if (err) {
  //       socket.emit("tokenExpire", { isLogin: false });
  //     } else {
  //       next();
  //     }
  //   });
  // });

  // 방 입장
  socket.on("ServerEntryRoom", ({ data }) => {
    const { roomId, userId, nickname } = data;

    UserRoom.findOrCreate({
      where: { [sequelize.Op.and]: { roomId, userId } },
      defaults: {
        roomId,
        userId
      }
    })
      .spread((_, created) => {
        console.log(created);
        if (created) {
          console.log("hello");
          socket.join(roomId);
          socket.broadcast.to(roomId).emit("ClientEntryRoom", { nickname });
        }
      })
      .catch(err => {
        socket.emit("ClientEntryRoom", { err });
      });
  });

  socket.on("ServerCreateRoom", ({ data }) => {
    const { roomId, userId, nickname } = data;

    socket.join(roomId);
    socket.broadcast.to(roomId).emit("ClientEntryRoom", { nickname });
  });

  // 메시지 보내기
  socket.on("messageFclient", ({ chat }) => {
    console.log("메시지 이벤트");
    console.log(chat);

    let date = new Date();
    date =
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds());
    chat.createdAt = date;

    socket.broadcast.to(chat.roomId).emit("messageTclient", { chat });
    socket.emit("messageTclient", { chat });
  });

  // 투표 생성
  socket.on("createPole", async ({ pole }) => {
    let sendPole = null;
    const {
      poleTitle,
      roomId,
      poleContent,
      expireTime,
      promiseTime,
      locationX,
      locationY
    } = pole;

    Pole.create({
      poleTitle,
      roomId,
      poleContent,
      expireTime,
      promiseTime,
      locationX,
      locationY,
      poleComplete: -1
    })
      .then(poleData => {
        sendPole = poleData;
        return Room.update(
          {
            poleId: poleData.id
          },
          {
            where: { id: roomId }
          }
        );
      })
      .then(_ => {
        return Room.findAll({
          where: { id: roomId },
          include: [
            {
              model: User,
              as: "users",
              through: {
                required: true
              }
            }
          ]
        });
      })
      .then(data => {
        const { users } = data[0];
        const poleUserRows = [];

        for (let i = 0; i < users.length; i += 1) {
          poleUserRows.push({
            poleId: sendPole.id,
            userId: users[i].id,
            attendence: -1
          });
        }

        return PoleUser.bulkCreate(poleUserRows);
      })
      .then(_ => {
        socket.broadcast.to(roomId).emit("successPole", { sendPole });
        socket.emit("successPole", { sendPole });
      })
      .cath(err => {
        socket.emit("successPole", { err });
      });
  });

  // 투표 찬성 반대 기능
  socket.on("attendencePole", ({ attendence }) => {
    const { att, roomId, userId, poleId } = attendence;
    const choice = att === true ? 1 : 0;
    const result = {
      agree: null,
      disagree: null
    };
    PoleUser.update(
      {
        attendence: choice
      },
      {
        where: { [sequelize.Op.and]: { poleId, userId } }
      }
    )
      .then(_ => {
        return PoleUser.findAndCountAll({
          where: { [sequelize.Op.and]: { poleId, attendence: 1 } }
        });
      })
      .then(agreeCount => {
        result.agree = agreeCount;
        return PoleUser.findAndCountAll({
          where: { [sequelize.Op.and]: { poleId, attendence: 0 } }
        });
      })
      .then(disagreeCount => {
        result.disagree = disagreeCount;
        socket.broadcast.to(roomId).emit("returnAttendence", { result });
        socket.emit("returnAttendence", { result });
      })
      .catch(err => {
        socket.emit("returnAttendence", { err });
      });
  });

  // 투표 종료 기능
  socket.on("expirePole", ({ expire }) => {
    const { poleId, roomId } = expire;
    const result = {
      agree: null,
      disagree: null,
      userCount: 0
    };

    PoleUser.findAndCountAll({ where: { poleId } })
      .then(userCount => {
        result.userCount = userCount.count;
        return PoleUser.findAndCountAll({
          where: { [sequelize.Op.and]: { poleId, attendence: 1 } }
        });
      })
      .then(agreeCount => {
        result.agree = agreeCount;
        return PoleUser.findAndCountAll({
          where: { [sequelize.Op.and]: { poleId, attendence: 0 } }
        });
      })
      .then(disagreeCount => {
        result.disagree = disagreeCount;
        if (result.agree.count > Math.floor(result.userCount / 2)) {
          return Pole.findOne({
            where: {
              id: poleId
            }
          });
        }
        throw new Error();
      })
      .then(poleData => {
        const { poleTitle, promiseTime, locationX, locationY } = poleData;
        return Schedule.create({
          schdduleTitle: poleTitle,
          promiseTime,
          locationX,
          locationY
        });
      })
      .then(scheduleData => {
        const {
          agree: { rows }
        } = result;
        const userScheduleRows = [];
        const { id } = scheduleData;

        for (let i = 0; i < rows.length; i += 1) {
          userScheduleRows.push({
            userId: rows[i].userId,
            scheduleId: id
          });
        }
        return UserSchedule.bulkCreate(userScheduleRows);
      })
      .then(_ => {
        socket.broadcast.to(roomId).emit("resultPole", { result: true });
        socket.emit("resultPole", { result: true });
      })
      .catch(_ => {
        socket.broadcast.to(roomId).emit("resultPole", { result: false });
        socket.emit("resultPole", { result: false });
      });
  });

  // socket.connection 끝
};

export default socketController;
