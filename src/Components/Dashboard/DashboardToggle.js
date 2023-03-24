import { Dashboard } from "@rsuite/icons";
import React from "react";
import { Button, Drawer } from "rsuite";
import { useMediaQuery } from "../../Hooks/usemediaquery";
import { UseModalState } from "../../Hooks/UseModalState";
import DashBoard from "./DashBoard";

const DashboardToggle = () => {
  const { isOpen, open, close } = UseModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");
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
      <Drawer full={isMobile} placement="left" onClose={close} open={isOpen}>
        <DashBoard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
