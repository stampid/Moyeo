// import { messages } from "../../models/index";

function pad2(n) {
  return n < 10 ? "0" + n : n;
}

const socketController = socket => {
  console.log("클라이언트 접속");

  socket.join(1);
  //   console.log(socket.adapter.rooms);
  //   socket.emit("start");

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

  //   socket.on("disconnect", function() {
  //     console.log("클라이언트 접속 종료");
  //   });
};

export default socketController;
