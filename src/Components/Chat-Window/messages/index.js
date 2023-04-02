import {
  equalTo,
  off,
  onValue,
  orderByChild,
  query,
  ref,
  runTransaction,
  update,
} from "firebase/database";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Message, toaster } from "rsuite";
import { auth, dataBase } from "../../../Firebase/Firebase";
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
  const handleLike = useCallback(async (msgId) => {
    let alertMsg;
    const { uid } = auth.currentUser;
    const messageRef = ref(dataBase, `/messages/${msgId}`);
    await runTransaction(messageRef, (msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = "Like removed";
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = "Like added";
        }
      }
      return msg;
    });
    toaster.push(
      <Message type="info" closable>
        {alertMsg}
      </Message>
    );
  }, []);
  const handleDelete= useCallback(async(msgId)=>{
    if(!window.confirm('Delete this message?')){
      return;
    }
    const isLast = messages[messages.length-1].id === msgId;
    const updates = {};
    updates[`/messages/${msgId}`]=null;
    if(isLast && messages.length>1){
      updates[`/rooms/${chatId}/lastMessage`]={
        ...messages[messages.length-2],
        msgId:messages[messages.length-2].id,
      }
    }
    if(isLast && messages.length === 1){
      updates[`/rooms/${chatId}/lastMessage`]=null;
    }
    try {
      const dbRef = ref(dataBase);
      await update(dbRef, updates)
      toaster.push(
        <Message type="info" closable>
          Message has been deleted!
        </Message>
      )
    } catch (error) {
      toaster.push(
        <Message type="error" closable>
          {error.message}
        </Message>
      )
    }
  },[chatId,messages])

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdminPass={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
