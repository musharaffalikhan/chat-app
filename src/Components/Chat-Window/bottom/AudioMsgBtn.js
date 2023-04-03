import React, { useCallback, useState } from "react";
import { InputGroup, Message, toaster } from "rsuite";
import { ReactMic } from "react-mic";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../Firebase/Firebase";
import { RiMicFill } from "react-icons/ri";

const AudioMsgBtn = ({ afterUpload }) => {
  const { chatId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onClick = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);
  const onUpload = useCallback(
    async (data) => {
      setIsUploading(true);
      try {
        // const storageRef = ref(storage, `/chat/${chatId}`);
        // const fileRef = ref(storageRef, `audio_${Date.now()}.mp3`);
        // const metadata = {
        //   cacheControl: `public, max-age=${3600 * 24 * 3}`,
        // };
        // const snap = await uploadBytes(fileRef, data.blob, metadata);
        const snap = await uploadBytes(
          ref(storage, `/chat/${chatId}/audio_${Date.now()}.mp3`),
          data.blob,
          {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          }
        );
        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await getDownloadURL(snap.ref),
        };
        setIsUploading(false);
        afterUpload([file]);
      } catch (error) {
        setIsUploading(false);
        toaster.push(<Message>{error.message}</Message>);
      }
    },
    [afterUpload, chatId]
  );
  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={isUploading}
      className={isRecording ? "animate-blink" : ""}
    >
      <RiMicFill />
      <ReactMic
        record={isRecording}
        className="d-none"
        onStop={onUpload}
        mimeType="audio/webm"
      />
    </InputGroup.Button>
  );
};

export default AudioMsgBtn;
