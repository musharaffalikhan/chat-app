import React from "react";
import { Button, Modal } from "rsuite";
import { UseModalState } from "../../../Hooks/UseModalState";
import ProfileAvatar from "../../Dashboard/ProfileAvatar";

const ProfileInfoModal = ({ profile,children, ...btnProps }) => {
  const { name, avatar, createdAt } = profile;
  const { isOpen, open, close } = UseModalState();
  const shortName = profile.name.split(" ")[0];
  const memberSince = new Date(createdAt).toLocaleDateString();
  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>{shortName} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />
          <h4 className="mt-2">{name}</h4>
          <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoModal;
