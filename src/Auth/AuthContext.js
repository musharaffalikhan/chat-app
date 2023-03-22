import { createContext, useState } from "react";

const AuthContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile] = useState(false); 
  return (
    <AuthContext.Provider value={profile}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
