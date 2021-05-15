import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';

export default function Chat({ users, messages, userName, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = useState('');
  const messagesRef = useRef(null)

  const onSendMessage = () => {
    //отправка сообщения всем пользователям комнаты 
    socket.emit('ROOM/SET_MESSAGE', {
      userName,
      roomId,
      text: messageValue,
    })
    //добавление сообщения в окне пользователя, отправляющего это сообщение
    onAddMessage({
      userName,
      text: messageValue,
    })
    //очистка окна ввода после отправки сообщения
    setMessageValue('');
  }

  //смещение в конец окна чата
  useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        <b>Room: {roomId}</b>
        <br />
        <b>Online Users ({users.length}):</b>
        <ul>
          {/*Отображение online-пользователей комнаты*/}
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {/*Отображение всех сообщений из массива в чате комнаты*/}
          {messages.map((message, index) => (
            <div key={message + index} className="message">
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea 
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form"
            rows="3"
          />
          <button className="btn btn-primary" type="button" onClick={onSendMessage}>SEND</button>
        </form>
      </div>
    </div>
  );
}
