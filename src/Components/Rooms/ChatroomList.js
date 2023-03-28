import React, { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader, Nav } from "rsuite";
import { useRooms } from "../../Auth/RoomContext";
import RoomItem from "./RoomItem";

const ChatroomList = ({ aboveElHeight }) => {
  const location = useLocation();
  const rooms = useRooms();
  const NavLink = forwardRef((props, ref) => {
    const { to, as, ...rest } = props;
    return <Link to={to} as={as} ref={ref} {...rest} />;
  });
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{ height: `calc(100% - ${aboveElHeight}px)` }}
      activeKey={location.pathname}
    >
      {!rooms && (
        <Loader center vertical content="Loading" speed="slow" size="md" />
      )}
      {rooms &&
        rooms.length > 0 &&
        rooms.map((room) => (
          <Nav.Item
            as={NavLink}
            to={`/chat/${room.id}`}
            key={room.id}
            eventKey={`/chat/${room.id}`}
          >
            <RoomItem room={room} />
          </Nav.Item>
        ))}
    </Nav>
  );
};

export default ChatroomList;
