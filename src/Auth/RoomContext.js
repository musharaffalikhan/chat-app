import { off, onValue, ref } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { dataBase } from "../Firebase/Firebase";
import { transfromToArrWithId } from "../Helper/Helpers";

const RoomContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const roomListRef = ref(dataBase, "rooms");
    onValue(roomListRef, (snap) => {
      const data = transfromToArrWithId(snap.val());
      setRooms(data);
    });
    return () => {
      off(roomListRef);
    };
  }, []);

  return <RoomContext.Provider value={rooms}>{children}</RoomContext.Provider>;
};

export const useRooms = () => useContext(RoomContext);
