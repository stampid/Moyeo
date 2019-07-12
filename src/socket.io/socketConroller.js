import { messages } from "../../models/index";

const socketController = socket => {
  console.log("클라이언트 접속");
  let storage = {};

  socket.on("messageFclient", ({ message }) => {
    // client 로 부터 message 수신
    console.log("----->> ", message);
    socket.emit("messageTclient", { messages: "돌아옴!" });
  });
  // socket.emit("messageTdb", "메세지");      // client 로 부터 수신한 message db로 송신
  socket.emit("messageTclient", { messages }); // db로 응답 받은 data를 client로 송신

  socket.on("disconnect", function() {
    console.log("클라이언트 접속 종료");
  });

  //   setInterval(function() {
  //     socket.emit("message", "메세지");
  //   });
};

export default socketController;
