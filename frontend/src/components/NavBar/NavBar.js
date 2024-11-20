import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div>
      <ul className="nav nav-tabs justify-content-between w-100">
        <li className="nav-item">
          <a className="nav-link" href="profile/">
            Profile
          </a>
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
                <a
                  className="nav-link text-secondary"
                  href="/?categories=to-do"
                >
                  To-Do
                </a>
              </li>
              <li>
                <a className="nav-link text-secondary" href="/?categories=task">
                  Task
                </a>
              </li>
              <li>
                <a className="nav-link text-secondary" href="/?categories=shop">
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
