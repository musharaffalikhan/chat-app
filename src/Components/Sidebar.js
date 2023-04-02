import React, { useEffect, useRef, useState } from "react";
import { Button, Divider } from "rsuite";
import CreateRoomBtn from "./Dashboard/CreateRoomBtn";
import DashboardToggle from "./Dashboard/DashboardToggle";
import ChatroomList from "./Rooms/ChatroomList";

const Sidebar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (topSidebarRef.current) {
      setHeight(topSidebarRef.current.scrollHeight);
    }
  }, [topSidebarRef]);
  return (
    <>
      <div className="h-100 pt-2">
        <div ref={topSidebarRef}>
          <DashboardToggle />
          <CreateRoomBtn />
          <Divider>Join conversation</Divider>
        </div>
        <ChatroomList aboveElHeight={height} />
      </div>
    </>
  );
};

export default Sidebar;
