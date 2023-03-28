import { ArrowLeftLine } from "@rsuite/icons";
import React, { memo } from "react";
import { useHistory } from "react-router-dom";
import { Button, ButtonToolbar } from "rsuite";
import { useCurrentRoom } from "../../../Auth/Current-room-context";
import { useMediaQuery } from "../../../Hooks/usemediaquery";
import RoomInfo from "./RoomInfo";

const Top = () => {
  const history = useHistory();
  const name = useCurrentRoom((state) => state.name);
  const isMobile = useMediaQuery("(max-width:992px)");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>
          <ArrowLeftLine
            onClick={() => {
              history.push("/");
            }}
            style={{ fontSize: "2em" }}
            className={
              isMobile
                ? "d-inline-block p-0 mr-2 text-blue link-unstyled"
                : "d-none"
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>
        {/* <ButtonToolbar className="ws-nowrap">todo</ButtonToolbar> */}
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfo/>
      </div>
    </div>
  );
};

export default memo(Top);
