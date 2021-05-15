import React, { useState } from 'react';
import axios from 'axios';

export default function JoinBlock({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  const onJoin = async () => {
    if (!userName.trim() || !roomId.trim()) {
      return alert('Enter your name and RoomId');
    }

    const obj = {
      roomId,
      userName,
    };
    
    //отправляем POST запрос для отображения имени пользователя в его окне
    await axios.post('/rooms', obj);
    //авторизация пользователя в комнате и получение её данных 
    onLogin(obj);
  }

  return (
    <div className="join-block">
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={userName} 
        onChange={(e) => setUserName(e.target.value)}  
      />
      <input 
        type="text" 
        placeholder="Enter RoomId" 
        value={roomId} 
        onChange={(e) => setRoomId(e.target.value)}  
      />
      <button className="btn btn-success" onClick={onJoin}>JOIN CHAT ROOM</button>
    </div>
  );
};