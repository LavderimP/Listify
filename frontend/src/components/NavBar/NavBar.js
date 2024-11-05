import React from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom"; // Use useNavigate

function NavBar() {
  const navigate = useNavigate();

  const handleListClick = () => {
    navigate(`/`);
  };

  return (
    <div>
      <ul className="nav nav-tabs justify-content-between w-100">
        {/* Profile */}
        <li className="nav-item">
          <a className="nav-link" href="/">
            Profile
          </a>
        </li>

        {/* Right-aligned items */}
        <div className="d-flex align-items-center">
          <li className="nav-item">
            <button className="nav-link" onClick={handleListClick}>
              <b>Lists</b>
            </button>
          </li>
          {/* DropDown */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
              href="/"
            >
              Filter
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="/">
                  To-Do
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  Task
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  Shop
                </a>
              </li>
            </ul>
          </li>
          {/* LogOut */}
          <li className="nav-button">
            <button type="button" className="btn btn-light">
              LogOut
            </button>
          </li>
        </div>
      </ul>
    </div>
  );
}

export default NavBar;
