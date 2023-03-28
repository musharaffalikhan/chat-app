import React, { memo } from "react";
import { useCurrentRoom } from "../../../Auth/Current-room-context";

const Top = () => {
  const name = useCurrentRoom((state) => state.name);
  return <div>{name}</div>;
};

export default memo(Top);
