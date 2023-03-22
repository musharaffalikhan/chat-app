import React from "react";

import {
  Button,
  Col,
  Container,
  Grid,
  Message,
  Panel,
  Row,
  toaster,
} from "rsuite";
import Google from "@rsuite/icons/legacy/Google";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, dataBase } from "../Firebase/Firebase";
import { ref, serverTimestamp, set } from "firebase/database";

const Signin = () => {
  // functions
  const signInWithProvider = async (provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await set(ref(dataBase, `/profiles/${user.uid}`), {
          name: user.displayName,
          createdAt: serverTimestamp(),
        });
      }
      toaster.push(
        <Message type="success" closable>
          Signed in
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
  const onGoogleSignIn = () => {
    signInWithProvider(new GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} lg={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to chat</h2>
                <p>Progressive chat platform</p>
              </div>
              <div className="mt-3">
                <Button
                  block
                  color="green"
                  appearance="primary"
                  startIcon={<Google />}
                  onClick={onGoogleSignIn}
                >
                  Continue with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default Signin;
