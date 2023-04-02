import React from "react";
import { useParams } from "react-router-dom";
import { Loader } from "rsuite";
import { CurrentRoomProvider } from "../../Auth/Current-room-context";
import { useRooms } from "../../Auth/RoomContext";
import Bottom from "../../Components/Chat-Window/bottom";
import Messages from "../../Components/Chat-Window/messages";
import Top from "../../Components/Chat-Window/top";
import { auth } from "../../Firebase/Firebase";
import { transfromToArr } from "../../Helper/Helpers";

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();
  if (!rooms) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }
  const currRoom = rooms.find((room) => room.id === chatId);
  if (!currRoom) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }
  const { name, description } = currRoom;
  const admins = transfromToArr(currRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);
  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
  };
  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <Top />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <Bottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
