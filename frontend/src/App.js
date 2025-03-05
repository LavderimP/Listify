import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import List from "./components/List/List";
import Auth from "./components/userAuth/Auth";
import Profile from "./components/Profile/Profile";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  // Function to get tokens from localStorage
  const getTokensFromStorage = () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    return { accessToken: storedAccessToken, refreshToken: storedRefreshToken };
  };

  // Callback function to set the tokens when sign-in is successful
  const handleSignin = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
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
                path="user/"
                element={<Profile onLogout={handleSignout} />}
              />
              <Route path="/" element={<List />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
