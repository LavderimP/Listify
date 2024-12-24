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

  // Function to get CSRF token from cookies (for secure requests)
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const csrftoken = getCookie("csrftoken");

  // Callback function to set the token when sign in  is successful
  const handleSignin = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
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
          <Auth onLogin={handleSignin} accessToken={accessToken} />
        ) : (
          <>
            <Routes>
              <Route
                path="profile/"
                element={
                  <ProfileDetail
                    csrftoken={csrftoken}
                    onLogout={handleSignout}
                    accessToken={accessToken}
                  />
                }
              />
              <Route path="/" element={<List />} />
              <Route
                path="add/"
                element={
                  <Create csrftoken={csrftoken} accessToken={accessToken} />
                }
              />
              <Route
                path="list/:id/"
                element={
                  <Detail csrftoken={csrftoken} accessToken={accessToken} />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
