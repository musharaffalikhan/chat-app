import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { dataBase } from "../Firebase/Firebase";

export const UsePresence = (uid) => {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    const userStatusRef = ref(dataBase, `/status/${uid}`);
    onValue(userStatusRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setPresence(data);
      }
    });
    return () => {
      off(userStatusRef);
    };
  }, [uid]);
  return presence;
};
