import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import Image1 from "../../assets/Image1.png";
import "./Auth.css";
import axiosInstance from "./axiosInstance";

function Signin({ onLogin }) {
  const [activeItem, setActiveItem] = useState({
    username: "",
    fullname: "",
    password: "",
    password_confirm: "",
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

  const signinApiCall = async () => {
    try {
      const response = await axiosInstance.post("login/", {
        username: activeItem.username,
        password: activeItem.password,
      });

      // Reset the form fields after successful login
      setActiveItem({
        username: "",
        password: "",
      });

      // If the login is successful, pass the access and refresh tokens back to the parent component
      if (response.data.access) {
        onLogin(response.data.access, response.data.refresh); // Pass tokens to parent component
      }
    } catch (error) {
      // If there's an error, set the error state
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const signupApiCall = async () => {
    try {
      const response = await axiosInstance.post("register/", activeItem);

      if (response.status === 201) {
        // Wait for signinApiCall to complete before proceeding
        await signinApiCall();

        // Reset the form fields after successful login
        setActiveItem({
          username: "",
          fullname: "",
          password: "",
          password_confirm: "",
        });
      }
    } catch (error) {
      // If there's an error, set the error state
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const buttonClass = e.target.className;

    if (buttonClass.includes("signin-button")) {
      signinApiCall();
    } else if (buttonClass.includes("signup-button")) {
      signupApiCall();
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    setSide(!side);
  };

  return (
    <div className="auth-container">
      <div className="auth-images-container">
        <div className="logo-container">
          <img id="logo-img" src={Logo} alt="Logo here" />
        </div>
        <div className="photo-container">
          <img id="photo-img" src={Image1} alt="Photo here" />
        </div>
      </div>
      <div className="auth-form-container">
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
              className="signin-button"
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
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={activeItem.password}
            />
            <input
              className="password-input"
              name="password_confirm"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={activeItem.password_confirm}
            />
            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <button
              className="signup-button"
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
