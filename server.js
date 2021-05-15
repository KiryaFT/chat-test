const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

//создание коллекции Map для хранения комнат, их пользователей и их сообщений
const rooms = new Map();

app.use(express.json());

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  //при входе в чат новый пользователь видит все сообщения
  const data = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()],
      }
    : {
        users: [],
        messages: [],
      };

  res.json(data);
});

app.post("/rooms", (req, res) => {
  const { roomId } = req.body;
  //если новая комната, то она добавляется в коллекцию rooms
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

io.on("connection", (socket) => {
  //при подключении пользователя к комнате его имя добавляется в коллекцию и передается через сокеты всем пользователям комнаты
  socket.on("ROOM/JOIN", ({ roomId, userName, text }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.broadcast.to(roomId).emit("ROOM/SET_USERS", users);
  });

  //при отправке сообщения оно добавляется в коллекцию и отправляется всем пользователям комнаты
  socket.on("ROOM/SET_MESSAGE", ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get("messages").push(obj);
    socket.broadcast.to(roomId).emit("ROOM/SET_MESSAGE", obj);
  });

  //при отключении пользователя всем пользователям приходит обновленный список пользователей комнаты
  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.broadcast.to(roomId).emit("ROOM/SET_USERS", users);
      }
    });
  });
});

//подключение сервера к порту 8080
server.listen(8080, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Server started");
});
