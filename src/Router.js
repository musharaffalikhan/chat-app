import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProfileProvider } from "./Auth/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
//Pages
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";

const Router = () => {
  return (
    <>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </>
  );
};

export default Router;
