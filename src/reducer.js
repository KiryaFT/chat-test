export const reducer = (state, action) => {
  switch (action.type) {
    //подключение нового пользователя
    case "JOIN":
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
      };

    //добавление данных комнаты
    case "SET_DATA":
      return {
        ...state,
        users: action.payload.users,
        messages: action.payload.messages,
      };

    //добавление или удаление пользователей комнаты
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    //добавление сообщения
    case "SET_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      return state;
  }
};
