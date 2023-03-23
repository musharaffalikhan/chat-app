import { off, onValue, ref } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, dataBase } from "../Firebase/Firebase";

const AuthContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    const authUnsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        userRef = ref(dataBase, `/profiles/${authObj.uid}`);
        onValue(userRef, (snap) => {
          const { name, createdAt } = snap.val();
          const data = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
      } else {
        if (userRef) {
          off(userRef);
        }
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsub();
      if (userRef) {
        off(userRef);
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
