import {
  equalTo,
  limitToLast,
  off,
  onValue,
  orderByChild,
  query,
  ref,
  refFromURL,
  runTransaction,
  update,
} from "firebase/database";
import { deleteObject } from "firebase/storage";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Message, toaster } from "rsuite";
import { auth, dataBase, storage } from "../../../Firebase/Firebase";
import { groupBy, transfromToArrWithId } from "../../../Helper/Helpers";
import MessageItem from "./MessageItem";

const PAGE_SIZE = 15;
const messagesRef = ref(dataBase, "/messages");

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    (limittoLast) => {
      const node = selfRef.current;
      off(messagesRef);
      const msg = query(
        messagesRef,
        orderByChild("roomId"),
        equalTo(chatId),
        limitToLast(limittoLast || PAGE_SIZE)
      );
      onValue(msg, (snap) => {
        const data = transfromToArrWithId(snap.val());
        setMessages(data);
        if (shouldScrollToBottom(node)) {
          node.scrollTop = node.scrollHeight;
        }
      });
      setLimit((prev) => prev + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;
    loadMessages(limit);
    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;
    loadMessages();
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);
    return () => {
      off(messagesRef);
    };
  }, [loadMessages]);
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
  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm("Delete this message?")) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;
      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        const dbRef = ref(dataBase);
        await update(dbRef, updates);
        toaster.push(
          <Message type="info" closable>
            Message has been deleted!
          </Message>
        );
      } catch (error) {
        return toaster.push(
          <Message type="error" closable>
            {error.message}
          </Message>
        );
      }
      // if (file) {
      //   try {
      //     const fileRef = refFromURL(storage, file.url);
      //     await deleteObject(fileRef);
      //   } catch (error) {
      //     console.log(error.message)
      //     toaster.push(
      //       <Message type="error" closable>
      //         {error.message}
      //       </Message>
      //     );
      //   }
      // }
    },
    [chatId, messages]
  );
  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );
      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdminPass={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green" appearance="primary">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
