import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar({ onLogout }) {
  const navigate = useNavigate();

  const handleFilterClick = (category) => {
    navigate(`/?categories=${category}`);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div>
      <ul className="nav nav-tabs justify-content-between w-100">
        <li className="nav-item">
          <a className="nav-link" href="/">
            Profile
          </a>
        </li>
        <div className="d-flex align-items-center">
          <li className="nav-item">
            <button className="nav-link" onClick={() => navigate("/")}>
              <b>Lists</b>
            </button>
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
                <button
                  className="dropdown-item"
                  onClick={() => handleFilterClick("to-do")}
                >
                  To-Do
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleFilterClick("task")}
                >
                  Task
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleFilterClick("shop")}
                >
                  Shop
                </button>
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
