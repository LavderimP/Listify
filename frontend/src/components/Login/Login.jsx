import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [activeItem, setActiveItem] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActiveItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

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

  const loginApiCall = () => {
    const url = "http://127.0.0.1:8000/login/";
    const csrftoken = getCookie("csrftoken");

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(activeItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setActiveItem({
          username: "",
          password: "",
        });

        // If the login is successful, pass the token back to the parent
        if (data.access) {
          onLogin(data.access, data.refresh); // Pass access token to parent component
        }
      })
      .catch((error) => {
        setError("Login failed. Please try again.");
        console.error("Error:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginApiCall();
  };

  return (
    <div className="container">
      <div className="task-container">
        <form id="form" onSubmit={handleSubmit}>
          <div className="task-container">
            <div className="user-container">
              <span>Username: </span>
              <input
                className="user-input"
                id="username-input"
                name="username"
                type="text"
                placeholder="username here"
                onChange={handleChange}
                value={activeItem.username}
              />
            </div>
            <div className="pass-input">
              <span>Password: </span>
              <input
                id="pass-input"
                name="password"
                type="password" // Changed to password
                placeholder="password here"
                onChange={handleChange}
                value={activeItem.password}
              />
            </div>
          </div>
          {error && (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          )}
          <div className="task-wrapper">
            <button className="login-button" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
