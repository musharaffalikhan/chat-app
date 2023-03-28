import { Creative } from "@rsuite/icons";
import { push, ref, serverTimestamp } from "firebase/database";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { Button, Form, Input, Message, Modal, Schema, toaster } from "rsuite";
import { dataBase } from "../../Firebase/Firebase";
import { UseModalState } from "../../Hooks/UseModalState";

const INITIAL_FORM = {
  name: "",
  description: "",
};
const model = Schema.Model({
  name: Schema.Types.StringType().isRequired("Chat name is required"),
  description: Schema.Types.StringType().isRequired("Description is required"),
});
const Textarea = forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
const CreateRoomBtn = () => {
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const { isOpen, open, close } = UseModalState();

  //   functions
  const onFormChange = useCallback((value) => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const newRoomData = {
      ...formValue,
      createdAt: serverTimestamp(),
    };
    try {
      const roomsRef = ref(dataBase, "rooms");
      await push(roomsRef, newRoomData);
      toaster.push(
        <Message
          type="info"
          closable
        >{`${formValue.name} has been created`}</Message>
      );
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
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
    <div className="mt-1">
      <Button block color="green" appearance="primary" onClick={open}>
        <Creative /> Create new chat room
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>New chat room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <Form.Group>
              <Form.ControlLabel>Room name</Form.ControlLabel>
              <Form.Control
                name="name"
                placeholder="Enter chat room name ..."
              />
            </Form.Group>
            <Form.Group controlId="textarea">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control
                rows={5}
                name="description"
                placeholder="Enter room description ..."
                accepter={Textarea}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtn;
