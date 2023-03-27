import React, { useRef, useState } from "react";
import { Button, Message, Modal, toaster } from "rsuite";
import { UseModalState } from "../../Hooks/UseModalState";
import AvatarEditor from "react-avatar-editor";
import { ref as dataBaseRef, set } from "firebase/database";
import { dataBase, storage } from "../../Firebase/Firebase";
import { useProfile } from "../../Auth/AuthContext";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const getBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("File process error"));
      }
    });
  });
};
const AvatarUploadBtn = () => {
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarEditorRef = useRef();
  const { isOpen, open, close } = UseModalState();
  const { profile } = useProfile();

  //   functions
  const onFileInputChange = (e) => {
    const currFiles = e.target.files;
    if (currFiles.length === 1) {
      const file = currFiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        toaster.push(
          <Message type="warning" closable>
            {`Wrong file type ${file.type}`}
          </Message>
        );
      }
    }
  };
  const uploadAvatar = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storageRef(
        storage,
        `/profile/${profile.uid}/avatar`
      );
      const metadata = {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      };
      const uploadAvatarResult = await uploadBytes(
        avatarFileRef,
        blob,
        metadata
      );
      console.log("uploadedfile", uploadAvatarResult);
      const url = await getDownloadURL(avatarFileRef);
      set(dataBaseRef(dataBase, `/profiles/${profile.uid}/avatar`), {
        avatar: url,
      });

      setIsLoading(false);
      toaster.push(
        <Message type="info" closable>
          Avatar has been uploaded
        </Message>
      );
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
      toaster.push(
        <Message type="error" closable>
          {error.message}
        </Message>
      );
    }
  };
  return (
    <div className="mt-3 text-center">
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded "
        >
          Select new avatar
          <input
            type="file"
            id="avatar-upload"
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>
        <Modal open={isOpen} onClose={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={uploadAvatar}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
