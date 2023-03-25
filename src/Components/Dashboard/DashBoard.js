import React from "react";
import { Button, Divider, Drawer } from "rsuite";
import { useProfile } from "../../Auth/AuthContext";
import EditableInput from "../EditableInput";

const DashBoard = ({ onSignout }) => {
  const { profile } = useProfile();
  const onSave = async (newData) => {
    console.log(newData);
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
