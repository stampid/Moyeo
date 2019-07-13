import { UserRoom } from "../../models/index";

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
  socket.on("createPole", () => {});
};

export default socketController;
