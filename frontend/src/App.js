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

function App() {
  const [accessToken, setAccessToken] = useState(null);
  // const [refreshToken, setRefreshToken] = useState(null);

  // Function to get tokens from localStorage
  const getTokensFromStorage = () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    // const storedRefreshToken = localStorage.getItem("refreshToken");

    return {
      accessToken: storedAccessToken,
      // refreshToken: storedRefreshToken,
    };
  };

  // Callback function to set the token when login is successful
  const handleLogin = (token, refresh) => {
    setAccessToken(token);
    // setRefreshToken(refresh);
    // Store tokens in localStorage
    localStorage.setItem("accessToken", token);
    // localStorage.setItem("refreshToken", refresh);
  };

  // Function to clear the tokens (for logout)
  const handleLogout = () => {
    setAccessToken(null);
    // setRefreshToken(null);
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    // Retrieve tokens from localStorage on page load
    const { accessToken } = getTokensFromStorage(); //refreshToken
    setAccessToken(accessToken);
    // setRefreshToken(refreshToken);
  }, []); // Empty dependency array to run only on initial load

  return (
    <div>
      <Router>
        {/* Conditionally render Login or NavBar based on accessToken */}
        {!accessToken ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <NavBar onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<List accessToken={accessToken} />} />
              <Route path="/add/" element={<Create />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
