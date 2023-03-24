import { Dashboard } from "@rsuite/icons";
import React from "react";
import { Button, Drawer } from "rsuite";
import { UseModalState } from "../../Hooks/UseModalState";
import DashBoard from "./DashBoard";

const DashboardToggle = () => {
  const { isOpen, open, close } = UseModalState();
  return (
    <>
      <Button
        block
        color="blue"
        startIcon={<Dashboard />}
        appearance="primary"
        onClick={open}
      >
        Dashboard
      </Button>
      <Drawer placement="left" onClose={close} open={isOpen}>
        <DashBoard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
