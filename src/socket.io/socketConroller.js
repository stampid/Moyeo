import { UserRoom } from "../../models/index";

function pad2(n) {
  return n < 10 ? "0" + n : n;
}

const socketController = socket => {
  console.log("hi");

  // 방 입장
  socket.on("ServerEntryRoom", ({ data }) => {
    const { roomId, userId, nickname } = data;

    socket.join(data.roomId);
    socket.in(data.roomId).emit("ClientEntryRoom", { data: nickname });

    UserRoom.create({
      roomId,
      userId
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
};

export default socketController;
