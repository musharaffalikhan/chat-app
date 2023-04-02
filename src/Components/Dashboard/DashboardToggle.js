import { Dashboard } from "@rsuite/icons";
import { signOut } from "firebase/auth";
import { ref, set } from "firebase/database";
import React, { useCallback } from "react";
import { Button, Drawer, Message, toaster } from "rsuite";
import { isOfflineForDatabase } from "../../Auth/AuthContext";
import { auth, dataBase } from "../../Firebase/Firebase";
import { useMediaQuery } from "../../Hooks/usemediaquery";
import { UseModalState } from "../../Hooks/UseModalState";
import DashBoard from "./DashBoard";

const DashboardToggle = () => {
  const { isOpen, open, close } = UseModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const full = isMobile;

  const onSignOut = useCallback(() => {
    const dbRef = ref(dataBase, `/status/${auth.currentUser.uid}`);
    set(dbRef, isOfflineForDatabase)
      .then(() => {
        signOut(auth)
          .then(() => {
            toaster.push(
              <Message type="info" closable>
                Signed out
              </Message>,
              { placement: "topCenter" }
            );
            close();
          })
          .catch((err) => {
            toaster.push(
              <Message type="error" closable>
                {err.message}
              </Message>
            );
          });
      })
      .catch((err) => {
        toaster.push(
          <Message type="error" closable>
            {err.message}
          </Message>
        );
      });
  }, [auth, close]);

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
