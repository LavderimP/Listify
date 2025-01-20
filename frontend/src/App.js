import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import List from "./components/List/List";
import Detail from "./components/List/Detail";
import Auth from "./components/userAuth/Auth";
import Create from "./components/List/Create";
import ProfileDetail from "./components/Profile/ProfileDetail";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  // Function to get tokens from localStorage
  const getTokensFromStorage = () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    return { accessToken: storedAccessToken };
  };

  // Callback function to set the token when sign in  is successful
  const handleSignin = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", token);
  };

  // Function to clear the tokens (for sign out)
  const handleSignout = () => {
    setAccessToken(null);
    localStorage.clear();
  };

  useEffect(() => {
    const { accessToken } = getTokensFromStorage();
    setAccessToken(accessToken);
  }, []);

  return (
    <div>
      <Router>
        {!accessToken ? (
          <Auth onLogin={handleSignin} />
        ) : (
          <>
            <Routes>
              <Route
                path="profile/"
                element={<ProfileDetail onLogout={handleSignout} />}
              />
              <Route path="/" element={<List />} />
              <Route path="add/" element={<Create />} />
              <Route path="list/:id/" element={<Detail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;