import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Hooks for navigation and URL management
import Delete from "./Delete";
import Logo from "../../assets/Logo.png";
import "./List.css";
import { jwtDecode } from "jwt-decode";
import { VscEdit, VscPinned, VscPin, VscBell, VscTrash } from "react-icons/vsc";

function List({ csrftoken, accessToken }) {
  const [lists, setLists] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation(); // To get current URL and query parameters

  // Function to fetch lists from the API, filtered by category if applicable
  const fetchLists = useCallback(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUserProfile(decoded); // Set the decoded profile info
      } catch (error) {
        return <div>"Invalid token", {error}</div>;
      }
    }

    const queryParams = new URLSearchParams(location.search); // Parse query parameters
    const category = queryParams.get("categories"); // Get 'categories' parameter
    const url = category
      ? `http://127.0.0.1:8000/list/?categories=${category}`
      : "http://127.0.0.1:8000/list/"; // Decide URL based on category presence

    const headers = {
      "Content-Type": "application/json", // API expects JSON
      "X-CSRFToken": csrftoken, // Include CSRF token
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`; // Include access token for auth
    }

    fetch(url, { method: "GET", headers })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data.");
        return response.json(); // Parse response as JSON
      })
      .then((data) => {
        setLists(data); // Update state with fetched lists
        setFetching(false); // Stop fetching
      })
      .catch((error) => {
        console.error("Error fetching lists:", error); // Log any errors
      });
  }, [accessToken, location.search, csrftoken]); // Dependencies: re-run when these change

  const handlePinClick = (list_id) => {
    const url = `http://127.0.0.1:8000/list/pin/${list_id}/`;

    const headers = {
      "Content-Type": "application/json", // API expects JSON
      "X-CSRFToken": csrftoken, // Include CSRF token
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`; // Include access token for auth
    }

    fetch(url, {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data.");
        return response.json(); // Parse response as JSON
      })
      .then(() => {
        setFetching(true); // Update the fetching state to trigger a re-render
      })
      .catch((error) => {
        console.error("Error updating pin status:", error);
      });
  };

  const handleImageClick = (e) => {
    navigate("profile/");
  };

  const handleListClick = (listId) => {
    navigate(`list/${listId}/`);
  };

  // useEffect to trigger fetchLists when 'fetching' changes
  useEffect(() => {
    if (fetching) {
      fetchLists(); // Fetch lists when the component mounts or fetching is true
    }
  }, [fetching, fetchLists]);

  return (
    <div className="list-container">
      {/* Logo */}
      <div className="header-container">
        <img
          id="logo-icon"
          src={Logo}
          alt="Logo"
          onClick={() => navigate("/")}
        />
        <input
          type="text"
          placeholder="Search..."
          // onChange={handleSearch}
        />
        <img
          id="pfp-icon"
          src={
            userProfile?.picture
              ? `http://127.0.0.1:8000${userProfile.picture}`
              : "/default-profile.png"
          }
          alt="Profile"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={handleImageClick}
        />
      </div>
      <div className="body-container">
        <div
          className="content-text"
          style={{
            display: "flex",
            color: "red",
          }}
        >
          <h1>My Lists</h1>
          <p>Test</p>
        </div>
        <div className="content-container">
          <div className="side-bar">
            <p
              title="Add New List"
              onClick={() => navigate("add/")}
              style={{
                cursor: "pointer",
              }}
            >
              <VscEdit className="icon" />
              Add List
            </p>
            <p>
              <VscBell className="icon" />
              Reminders
            </p>
            <p>
              <VscTrash className="icon" />
              Trash
            </p>
          </div>
          {/* List Mapping */}
          <div className="list-map">
            {lists.length > 0 ? (
              lists.map((list) => (
                <div
                  key={list.list_id}
                  className="list-wrapper"
                  style={{
                    cursor: "pointer",
                  }}
                  title="Edit List"
                >
                  <div className="list-header">
                    <p>
                      {list.pined ? (
                        <VscPinned
                          title="Unpin"
                          className="pin-icon"
                          style={{
                            transform: "rotate(65deg)",
                          }}
                          onClick={() => handlePinClick(list.list_id)}
                        />
                      ) : (
                        <VscPin
                          title="Pin"
                          className="pin-icon"
                          onClick={() => handlePinClick(list.list_id)}
                        />
                      )}
                      <span>
                        <span
                          style={{
                            color: "#e95a44",
                          }}
                        >
                          {list.category}
                        </span>{" "}
                        <span
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          {list.created_at.replace(/-/g, ".").slice(0, 10)}
                        </span>
                      </span>
                    </p>
                    <p>Private: {list.private ? "yes" : "no"}</p>
                    <p>Reminder: {list.reminder ? list.reminder : "no"} </p>
                  </div>
                  <div
                    className="list-body"
                    onClick={() => handleListClick(list.list_id)}
                  >
                    <p>ID: {list.list_id}</p>
                    <p>Title: {list.title}</p>
                    <p>{list.private ? null : ` Text: ${list.text}`}</p>
                    <p>
                      {list.pictures > 0 ? (
                        <img
                          src={`http://127.0.0.1:8000${list.pictures}`}
                          alt="list picture"
                        />
                      ) : null}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No lists found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
