import { Dashboard } from "@rsuite/icons";
import { signOut } from "firebase/auth";
import React, { useCallback } from "react";
import { Button, Drawer, Message, toaster } from "rsuite";
import { auth } from "../../Firebase/Firebase";
import { useMediaQuery } from "../../Hooks/usemediaquery";
import { UseModalState } from "../../Hooks/UseModalState";
import DashBoard from "./DashBoard";

const DashboardToggle = () => {
  const { isOpen, open, close } = UseModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const full = isMobile;

  const onSignOut = useCallback(() => {
    signOut(auth);
    toaster.push(
      <Message type="info" closable>
        Signed out
      </Message>,
      { placement: "topCenter" }
    );
  }, []);
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
      <Drawer full={full} placement="left" onClose={close} open={isOpen}>
        <DashBoard onSignout={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
