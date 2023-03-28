import React from "react";
import { Button, Modal } from "rsuite";
import { useCurrentRoom } from "../../../Auth/Current-room-context";
import { UseModalState } from "../../../Hooks/UseModalState";

const RoomInfo = () => {
  const { isOpen, open, close } = UseModalState();
  const description = useCurrentRoom((state) => state.description);
  const name = useCurrentRoom((state) => state.name);
  return (
    <div>
      <Button appearance="link" className="px-0" onClick={open}>
        Room Info
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomInfo;
