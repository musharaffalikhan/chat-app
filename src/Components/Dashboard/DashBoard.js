import { ref, set } from "firebase/database";
import React from "react";
import { Button, Divider, Drawer, Message, toaster } from "rsuite";
import { useProfile } from "../../Auth/AuthContext";
import { dataBase } from "../../Firebase/Firebase";
import EditableInput from "../EditableInput";

const DashBoard = ({ onSignout }) => {
  const { profile } = useProfile();
  const onSave = async (newData) => {
    const userNicknameRef = ref(dataBase, `/profiles/${profile.uid}/name`);
    try {
      await set(userNicknameRef, newData);
      toaster.push(
        <Message type="success" closable>
          Nickname has been updated
        </Message>
      );
    } catch (error) {
      toaster.push(
        <Message type="error" closable>
          {error.message}
        </Message>
      );
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>DashBoard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h4>Hey, {profile.name}</h4>
        <Divider />
        <EditableInput
          name="nickname"
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />

        {/* <Button block color="red" appearance="primary" onClick={onSignout} size="sm">
          Sign out
        </Button> */}
      </Drawer.Body>
    </>
  );
};

export default DashBoard;
