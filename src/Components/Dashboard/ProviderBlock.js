import Google from "@rsuite/icons/legacy/Google";
import Facebook from "@rsuite/icons/legacy/Facebook";
import React, { useState } from "react";
import { Button, Message, Tag, toaster } from "rsuite";
import { auth } from "../../Firebase/Firebase";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
} from "firebase/auth";

const ProviderBlock = () => {
  const currentUser = auth.currentUser;
  const [isConnected, setIsConnected] = useState({
    "google.com": currentUser.providerData.some(
      (data) => data.providerId === "google.com"
    ),
    "facebook.com": currentUser.providerData.some(
      (data) => data.providerId === "facebook.com"
    ),
  });

  //   functions
  const updateIsConnected = (providerID, value) => {
    setIsConnected((prev) => {
      return {
        ...prev,
        [providerID]: value,
      };
    });
  };

  const unlink = async (providerID) => {
    try {
      if (currentUser.providerData.length === 1) {
        throw new Error(`You cannot disconnect from ${providerID}`);
      }
      await unlink(currentUser, providerID);
      updateIsConnected(providerID, false);
      toaster.push(
        <Message type="info" closable>
          {`Disconnected from ${providerID}`}
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

  const link = async (provider) => {
    try {
      await linkWithPopup(currentUser, provider);
      toaster.push(
        <Message type="info" closable>
          {`Linked to ${provider.providerId}`}
        </Message>
      );
      updateIsConnected(provider.providerID, true);
    } catch (error) {
      toaster.push(
        <Message type="error" closable>
          {error.message}
        </Message>
      );
    }
  };

  //  unlink
  const unLinkGoogle = () => {
    unlink("google.com");
  };
  const unLinkFacebook = () => {
    unlink("facebook.com");
  };

  //   link
  const linkGoogle = () => {
    link(new GoogleAuthProvider());
  };
  const linkFacebook = () => {
    link(new FacebookAuthProvider());
  };

  return (
    <div>
      {isConnected["google.com"] && (
        <Tag color="green" closable onClose={unLinkGoogle}>
          <Google /> Connected
        </Tag>
      )}
      {isConnected["facebook.com"] && (
        <Tag color="blue" closable onClose={unLinkFacebook}>
          <Facebook /> Connected
        </Tag>
      )}
      <div className="mt-2">
        {!isConnected["google.com"] && (
          <Button block color="green" appearance="primary" onClick={linkGoogle}>
            <Google /> Link to Google
          </Button>
        )}
        {!isConnected["facebook.com"] && (
          <Button
            block
            color="blue"
            appearance="primary"
            onClick={linkFacebook}
          >
            <Facebook /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
