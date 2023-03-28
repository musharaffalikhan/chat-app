import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ProfileProvider } from "./Auth/AuthContext";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import PublicRoute from "./Components/Routes/PublicRoute";

//Pages
import Home from "./Pages/Home/Home";
import Signin from "./Pages/Signin";

const Router = () => {
  return (
    <>
      <ProfileProvider>
        <BrowserRouter>
          <Switch>
            <PublicRoute path="/signin">
              <Signin />
            </PublicRoute>
            <PrivateRoute path="/">
              <Home />
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </ProfileProvider>
    </>
  );
};

export default Router;
