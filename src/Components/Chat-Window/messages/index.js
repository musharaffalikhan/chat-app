import {
  equalTo,
  off,
  onValue,
  orderByChild,
  query,
  ref,
  runTransaction,
} from "firebase/database";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Message, toaster } from "rsuite";
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
  const handleAdmin = useCallback(
    async (uid) => {
      let alertMsg;
      const adminsRef = ref(dataBase, `/rooms/${chatId}/admins`);
      await runTransaction(adminsRef, (admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = "Admin permission removed";
          } else {
            admins[uid] = true;
            alertMsg = "Admin permission granted";
          }
        }
        return admins;
      });
      toaster.push(
        <Message type="info" closable>
          {alertMsg}
        </Message>
      );
    },
    [chatId]
  );

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdminPass={handleAdmin}
          />
        ))}
    </ul>
  );
};

export default Messages;
