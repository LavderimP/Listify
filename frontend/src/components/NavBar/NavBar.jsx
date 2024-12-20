import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import "./NavBar.css";

function NavBar({ onLogout, accessToken }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  // Decode the JWT token to get the user info
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken); // Corrected usage
        setUserProfile(decoded); // Set the decoded profile info
        console.log(decoded); // Log the decoded token to check the profile information
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [accessToken]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  const handleImageClick = (e) => {
    navigate("profile/");
  };

  return (
    <div className="navbar bg-dark">
      <ul className="nav nav-tabs justify-content-between w-100">
        <li className="nav-item">
          {userProfile && userProfile.picture ? (
            <img
              src={`http://127.0.0.1:8000${userProfile.picture}`} // Prepend full URL
              alt="Profile"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              onClick={handleImageClick}
            />
          ) : (
            <img
              src="path_to_default_image.jpg" // Use your default image path
              alt="Default Profile"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              onClick={handleImageClick}
            />
          )}
        </li>
        <div className="d-flex align-items-center">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Lists
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
            >
              Filter
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="nav-link text-secondary" href="/?category=to-do">
                  To-Do
                </a>
              </li>
              <li>
                <a className="nav-link text-secondary" href="/?category=task">
                  Task
                </a>
              </li>
              <li>
                <a className="nav-link text-secondary" href="/?category=shop">
                  Shop
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-button">
            <button
              type="button"
              className="btn btn-light"
              onClick={handleLogoutClick}
            >
              LogOut
            </button>
          </li>
        </div>
      </ul>
    </div>
  );
}

export default NavBar;
