import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import Image1 from "../../assets/Image1.png";
import "./Signin.css";

function Signin({ csrftoken, onLogin }) {
  const [activeItem, setActiveItem] = useState({
    username: "",
    fullname: "",
    password1: "",
    password2: "",
  });
  const [side, setSide] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActiveItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const loginApiCall = () => {
    const url = "http://127.0.0.1:8000/login/";

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

  const handleButtonClick = (e) => {
    e.preventDefault();
    setSide(!side);
  };

  return (
    <div className="login-container">
      <div className="login-images-container">
        <div className="logo-container">
          <img id="logo-img" src={Logo} alt="Logo here" />
        </div>
        <div className="photo-container">
          <img id="photo-img" src={Image1} alt="Photo here" />
        </div>
      </div>
      <div className="login-form-container">
        {!side ? (
          <>
            <h1>Sign In</h1>
            <input
              className="username-input"
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              value={activeItem.username}
            />
            <input
              className="password-input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={activeItem.password}
            />
            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <button
              className="sign-button"
              type="submit"
              onClick={handleSubmit}
            >
              Sign in
            </button>
            <p>
              Don't have an account ? <a onClick={handleButtonClick}>Sign Up</a>
            </p>
          </>
        ) : (
          <>
            <h1>Sign Up</h1>
            <input
              className="username-input"
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              value={activeItem.username}
            />
            <input
              className="fullname-input"
              name="fullname"
              type="text"
              placeholder="Fullname"
              onChange={handleChange}
              value={activeItem.fullname}
            />
            <input
              className="password-input"
              name="password1"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={activeItem.password1}
            />
            <input
              className="password-input"
              name="password2"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={activeItem.password2}
            />
            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <button
              className="sign-button"
              type="submit"
              onClick={handleSubmit}
            >
              Sign up
            </button>
            <p>
              Already have an account ?{" "}
              <a onClick={handleButtonClick}>Sign In</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Signin;
