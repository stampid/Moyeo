import sequelize from "sequelize";
import { UserRoom, Pole, Room, User, PoleUser } from "../../models/index";

function pad2(n) {
  return n < 10 ? "0" + n : n;
}

const socketController = socket => {
  console.log("hi");

  // 방 입장
  socket.on("ServerEntryRoom", ({ data }) => {
    const { roomId, userId, nickname } = data;

    UserRoom.create({
      roomId,
      userId
    }).then(() => {
      socket.join(roomId);
      socket.in(roomId).emit("ClientEntryRoom", { nickname });
    });
  });

  // 메시지 보내기
  socket.on("messageFclient", ({ chat }) => {
    let date = new Date();
    date =
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds());
    chat.createdAt = date;

    socket.in(chat.roomId).emit("messageTclient", { chat });
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
        const rows = [];

        for (let i = 0; i < users.length; i += 1) {
          rows.push({
            poleId: sendPole.id,
            userId: users[i].id,
            attendence: -1
          });
        }

        return PoleUser.bulkCreate(rows);
      })
      .then(_ => {
        socket.in(roomId).emit("successPole", { sendPole });
        socket.emit("successPole", { sendPole });
      });
  });

  // 투표 찬성 반대 기능(테스트 확인 완료 월요일 출근 후에 다시 확인)
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
        socket.in(roomId).emit("returnAttendence", { result });
        socket.emit("returnAttendence", { result });
      });
  });

  // socket.connection 끝
};

export default socketController;
