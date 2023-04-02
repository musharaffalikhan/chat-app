import { ref, update } from "firebase/database";
import React from "react";
import { Button, Divider, Drawer, Message, toaster } from "rsuite";
import { useProfile } from "../../Auth/AuthContext";
import { dataBase } from "../../Firebase/Firebase";
import { getUserUpdates } from "../../Helper/Helpers";
import EditableInput from "../EditableInput";
import AvatarUploadBtn from "./AvatarUploadBtn";
import ProviderBlock from "./ProviderBlock";

const DashBoard = ({ onSignout }) => {
  const { profile } = useProfile();

  const onSave = async (newData) => {
    try {
      const updates = await getUserUpdates(
        profile.uid,
        "name",
        newData,
        dataBase
      );
      const dbRef = ref(dataBase);
      await update(dbRef, updates);

      toaster.push(
        <Message type="success" closable>
          Updated successfully
        </Message>
      );
    } catch (error) {
      console.log(error.message);
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
        <ProviderBlock />
        <Divider />
        <EditableInput
          name="nickname"
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn />
        <Button
          block
          color="red"
          appearance="primary"
          onClick={onSignout}
          size="sm"
        >
          Sign out
        </Button>
      </Drawer.Body>
    </>
  );
};

export default DashBoard;
