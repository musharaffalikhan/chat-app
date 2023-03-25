import React, { useState } from "react";
import { Button, Message, Modal, toaster } from "rsuite";
import { UseModalState } from "../../Hooks/UseModalState";
import AvatarEditor from "react-avatar-editor";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const AvatarUploadBtn = () => {
  const [img, setImg] = useState(null);
  const { isOpen, open, close } = UseModalState();

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
            <Button block appearance="ghost">
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
