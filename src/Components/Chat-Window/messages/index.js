import { equalTo, off, onValue, orderByChild, query, ref } from "firebase/database";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { dataBase } from "../../../Firebase/Firebase";
import { transfromToArrWithId } from "../../../Helper/Helpers";
import MessageItem from "./MessageItem";

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = ref(dataBase, "/messages");
    const msg = query(messagesRef, orderByChild("roomId"), equalTo(chatId));
    onValue(msg, (snap) => {
      const data = transfromToArrWithId(snap.val());
      setMessages(data);
    });
    return () => {
      off(messagesRef);
    };
  }, [chatId]);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map((msg) => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default Messages;
