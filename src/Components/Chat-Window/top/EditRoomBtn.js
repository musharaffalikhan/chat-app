import { child, ref, set } from "firebase/database";
import React, { forwardRef, memo } from "react";
import { useParams } from "react-router-dom";
import { Button, Drawer, Input, Message, toaster } from "rsuite";
import { useCurrentRoom } from "../../../Auth/Current-room-context";
import { dataBase } from "../../../Firebase/Firebase";
import { useMediaQuery } from "../../../Hooks/usemediaquery";
import { UseModalState } from "../../../Hooks/UseModalState";
import EditableInput from "../../EditableInput";

const EditRoomBtn = () => {
  const { chatId } = useParams();
  const { isOpen, open, close } = UseModalState();
  const name = useCurrentRoom((state) => state.name);
  const description = useCurrentRoom((state) => state.description);
  const isMobile = useMediaQuery("(max-width:992px)");
  const Textarea = forwardRef((props, ref) => (
    <Input {...props} as="textarea" ref={ref} />
  ));

  const updateData = (key, value) => {
    const roomRef = ref(dataBase, `rooms/${chatId}`);
    const keyRef = child(roomRef, key);

    set(keyRef, value)
      .then(() => {
        toaster.push(
          <Message type="success" closable>
            Successfully updated
          </Message>
        );
      })
      .catch((err) => {
        toaster.push(
          <Message type="error" closable>
            {err.message}
          </Message>
        );
      });
  };

  const onNameSave = (newName) => {
    updateData("name", newName);
  };
  const onDesSave = (newDes) => {
    updateData("description", newDes);
  };

  return (
    <div>
      <Button
        className="br-circle"
        size="sm"
        color="red"
        appearance="primary"
        onClick={open}
      >
        A
      </Button>
      <Drawer full={isMobile} open={isOpen} onClose={close} placement="right">
        <Drawer.Header>
          <Drawer.Title>Edit room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name cannot be empty"
          />
          <EditableInput
            as={Textarea}
            rows={5}
            initialValue={description}
            onSave={onDesSave}
            emptyMsg="Description cannot be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export default memo(EditRoomBtn);
