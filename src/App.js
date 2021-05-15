import React, { useReducer, useEffect } from "react";
import axios from "axios";
import socket from "./socket";
import { reducer } from "./reducer";
import JoinBlock from "./components/JoinBlock";
import Chat from "./components/Chat";

function App() {
  //добавление обработчика состояния приложения
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    //добавляем подключенного пользователя в хранилище
    dispatch({
      type: "JOIN",
      payload: obj,
    });
    //подключаем пользователя к сокету
    socket.emit("ROOM/JOIN", obj);
    //получаем данные из комнаты
    const { data } = await axios.get(`rooms/${obj.roomId}`);
    //добавляем данные в хранилище
    dispatch({
      type: "SET_DATA",
      payload: data,
    });
  };

  //добавляем всех online-пользователей в хранилище
  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  //добавление нового сообщения в хранилище
  const addMessage = (message) => {
    dispatch({
      type: "SET_MESSAGE",
      payload: message,
    });
  };

  //прослушивание событий после рендера страницы
  useEffect(() => {
    socket.on("ROOM/SET_USERS", setUsers);
    socket.on("ROOM/SET_MESSAGE", addMessage);
  }, []);

  return (
    <div className="wrapper">
      {/*При подключении к комнате рендерится компонент комнаты, иначе компонент входа в комнату*/}
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
