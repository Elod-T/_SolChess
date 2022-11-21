require("dotenv").config();
const io = require("socket.io")(3001, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("update", (gameId) => {
    console.log("update", gameId);
    socket.to(gameId).emit("update");
  });

  socket.on("join", (gameId) => {
    socket.join(gameId);
    console.log(socket.id, " joined ", gameId);
  });

  socket.on("leave", (gameId) => {
    socket.leave(gameId);
    console.log(socket.id, " left ", gameId);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});
