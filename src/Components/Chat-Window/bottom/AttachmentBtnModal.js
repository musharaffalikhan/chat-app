import { Attachment } from "@rsuite/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, InputGroup, Message, Modal, toaster, Uploader } from "rsuite";
import { storage } from "../../../Firebase/Firebase";
import { UseModalState } from "../../../Hooks/UseModalState";

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModal = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = UseModalState();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (fileArr) => {
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setFileList(filtered);
  };
  const onUpload = async () => {
    setIsLoading(true);
    try {
      const uploadPromises = fileList.map((f) => {
        const storageRef = ref(storage, `/chat/${chatId}`);
        const fileRef = ref(storageRef, `${Date.now()}${f.name}`);
        const metadata = {
          cacheControl: `public, max-age=${3600 * 24 * 3}`,
        };
        return uploadBytesResumable(fileRef, f.blobFile, metadata);
      });
      const uploadSnap = await Promise.all(uploadPromises);
      const shapePromises = uploadSnap.map(async (snap) => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await getDownloadURL(snap.ref),
        };
      });
      const files = await Promise.all(shapePromises);
      await afterUpload(files);
      setIsLoading(false);
      close();
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
    <>
      <InputGroup.Button onClick={open}>
        <Attachment />
      </InputGroup.Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            fileList={fileList}
            autoUpload={false}
            action=""
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to chat
          </Button>
          <small className="text-right mt-2">
            * Only files less than 5mb are allowed
          </small>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
