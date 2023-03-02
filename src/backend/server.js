const express = require("express");
const app = express();
const socketIo = require("socket.io");
const PORT = process.env.PORT || 5000;

const server = require("http")
  .Server(app)
  .listen(PORT, () => {
    console.log("Server running on Port ", PORT);
  });

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true, //delete
  },
}); //in case server and client run on different urls

io.on("connection", (socket) => {
  socket.emit("receiveMsg", `Web Terminal Is Connected :] \r\n`);
  socket.on("joinRoom", (message) => {
    socket.emit("receiveMsg", `${socket.id} IS JOIN ROOM :) \r\n`);
  });

  socket.on("sendMsg", (message) => {
    let msg = /(?:msg":")(.*)(?=")/.exec(message);

    console.log("msg", msg);
    console.log(msg[1], typeof msg[1]);
    // if (msg[1] === "ls") {
    //   console.log("ls");
    //   return socket.emit("receiveMsg", `Music \r\n`);

    // return socket.emit(
    //   "receiveMsg",
    //   `Desktop Documents Downloads\nMovies Music \r\n`
    // );
    // }

    // if (msg[1] === "pwd") {
    //   return socket.emit("receiveMsg", `/Users/Joyce \r\n`);
    // }

    socket.emit("receiveMsg", `${message} \r\n`);
  });
});
