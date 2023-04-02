import {
  off,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, dataBase } from "../Firebase/Firebase";

export const isOfflineForDatabase = {
  state: "offline",
  last_changed: serverTimestamp(),
};

const isOnlineForDatabase = {
  state: "online",
  last_changed: serverTimestamp(),
};

const AuthContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;
    let dbref;
    const authUnsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        userStatusRef = ref(dataBase, `/status/${authObj.uid}`);
        userRef = ref(dataBase, `/profiles/${authObj.uid}`);
        onValue(userRef, (snap) => {
          const { name, createdAt, avatar } = snap.val();
          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
        dbref = ref(dataBase, ".info/connected");
        onValue(dbref, (snapshot) => {
          if (!!snapshot.val() === false) {
            return;
          }
          onDisconnect(userStatusRef)
            .set(isOfflineForDatabase)
            .then(() => {
              set(userStatusRef, isOnlineForDatabase);
            });
        });
      } else {
        if (userRef) {
          off(userRef);
        }
        if (userStatusRef) {
          off(userStatusRef);
        }
        off(dbref);
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsub();
      off(dbref);
      if (userRef) {
        off(userRef);
      }
      if (userStatusRef) {
        off(userStatusRef);
      }
    };
  }, []);
  return (
    <AuthContext.Provider value={{ profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useProfile = () => useContext(AuthContext);
