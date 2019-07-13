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
    // 투표 생성을 누르면 투표에 관한 정보가 넘어오고
    // pole 테이블에 데이터를 만들어주고 - 완료
    // room 테이블에 pole id를 넣어준다. - 완료
    // userRoom 테이블에서 roomId를 이용해서 userId들을 가져와서 - 완료
    // pole_users 테이블에 poleId, userId를 저장 해준다. - 완료
    // 마지막으로 방안에 유저들에게 투표가 생성되었다는 이벤트를 쏴준다. -완료
    // poleTitle, roomId, poleContent, expireTime, promiseTime, locationx, locationy, poleComplete
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
};

export default socketController;
