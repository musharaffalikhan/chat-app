import { Send } from "@rsuite/icons";
import { push, ref, serverTimestamp, update } from "firebase/database";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, InputGroup, Message, toaster } from "rsuite";
import { useProfile } from "../../../Auth/AuthContext";
import { dataBase } from "../../../Firebase/Firebase";
import AttachmentBtnModal from "./AttachmentBtnModal";

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: serverTimestamp(),
    likeCount:0,
  };
}

const Bottom = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();
  const { profile } = useProfile();

  // functions
  const inputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const onSendClick = async () => {
    if (input.trim() === "") {
      return;
    }
    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;
    const updates = {};
    const messageRef = ref(dataBase, "messages");
    const messageId = push(messageRef).key;
    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };
    setIsLoading(true);
    try {
      const dbRef = ref(dataBase);
      await update(dbRef, updates);
      setInput("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable>
          {error.message}
        </Message>
      );
    }
  };

  return (
    <div>
      <InputGroup>
      <AttachmentBtnModal/>
        <Input
          placeholder="Write a new message here..."
          value={input}
          onChange={inputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Send />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
