import React from "react";
import { Badge, Tooltip, Whisper } from "rsuite";
import { UsePresence } from "../Hooks/UsePresence";

const getColor = (presence) => {
  if (!presence) {
    return "gray";
  }
  switch (presence.state) {
    case "online":
      return "green";
    case "offline":
      return "red";
    default:
      return "gray";
  }
};
const getText = (presence) => {
  if (!presence) {
    return "Unknown state";
  }
  return presence.state === "online"
    ? "Online"
    : `Last online ${new Date(presence.last_changed).toLocaleDateString()}`;
};

const PresenceDot = ({ uid }) => {
  const presence = UsePresence(uid);
  return (
    <Whisper
      placement="top"
      controlId="control-id-hover"
      trigger="hover"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(presence) }}
      />
    </Whisper>
  );
};

export default PresenceDot;
