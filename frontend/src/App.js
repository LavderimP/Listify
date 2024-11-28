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
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import Create from "./components/List/Create";
import ProfileDetail from "./components/Profile/ProfileDetail";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [listData, setListData] = useState([]);

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

  // Callback function to set the token when login is successful
  const handleLogin = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  // Function to clear the tokens (for logout)
  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const { accessToken } = getTokensFromStorage();
    setAccessToken(accessToken);
  }, []);

  // Function to update the list data after successful update
  const handleListUpdate = (updatedList) => {
    setListData((prevData) =>
      prevData.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  return (
    <div>
      <Router>
        {!accessToken ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <NavBar onLogout={handleLogout} accessToken={accessToken} />
            <Routes>
              <Route
                path="profile/"
                element={
                  <ProfileDetail
                    csrftoken={csrftoken}
                    accessToken={accessToken}
                  />
                }
              />
              <Route
                path="/"
                element={<List accessToken={accessToken} listData={listData} />}
              />
              <Route
                path="add/"
                element={
                  <Create csrftoken={csrftoken} accessToken={accessToken} />
                }
              />
              <Route
                path="list/:id/"
                element={
                  <Detail
                    csrftoken={csrftoken}
                    accessToken={accessToken}
                    onUpdate={handleListUpdate} // Pass the update handler
                  />
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
