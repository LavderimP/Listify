import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Hooks for navigation and URL management
import Delete from "./Delete";
import Logo from "../../assets/Logo.png";
import searchLogo from "../../assets/search.svg";
import "./List.css";
import { jwtDecode } from "jwt-decode";
import {
  VscEdit,
  VscPinned,
  VscPin,
  VscGoToEditingSession,
  VscBell,
  VscTrash,
  VscSend,
  VscMic,
  VscFileMedia,
} from "react-icons/vsc";

function List({ csrftoken, accessToken }) {
  const [lists, setLists] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState([]);
  const [editing, setEditing] = useState(false);
  const [selectMode, setSelectMode] = useState(false); // Toggle for selection mode
  const [selectedLists, setSelectedLists] = useState([]); // Track selected lists
  const [searchBar, setSearchBar] = useState("");

  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation(); // To get current URL and query parameters

  // Function to fetch lists from the API, filtered by category or title if applicable
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

    const categoryParam = queryParams.get("category"); // Get 'category' parameter
    const titleParam = queryParams.get("title");

    // Decide the URL based on the presence of category and title parameters
    const url = categoryParam
      ? titleParam
        ? `http://127.0.0.1:8000/list/?category=${categoryParam}&title=${titleParam}`
        : `http://127.0.0.1:8000/list/?category=${categoryParam}`
      : titleParam
      ? `http://127.0.0.1:8000/list/?title=${titleParam}`
      : "http://127.0.0.1:8000/list/";

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

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // Navigate to the URL with the search term
      navigate(`/?title=${encodeURIComponent(searchBar)}`);
      setFetching(true);
    }
  };

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

  const handleListClick = (listId) => {
    setEditing((prevEditing) => !prevEditing);
  };

  const handleTrashClick = () => {
    if (!selectMode) {
      setSelectMode(true); // Enable selection mode
      setSelectedLists([]); // Reset selected lists
    } else {
      // Call API to delete selected lists
      const deletePromises = selectedLists.map((listId) => {
        const url = `http://127.0.0.1:8000/list/${listId}`;
        const headers = {
          "Content-Type": "application/json", // API expects JSON
          "X-CSRFToken": csrftoken, // Include CSRF token
        };

        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`; // Include access token for auth
        }

        return fetch(url, { method: "DELETE", headers }).then((response) => {
          if (!response.ok) {
            console.error(`Failed to delete list with id ${listId}`);
          } else {
            console.log(`Successfully deleted list with id ${listId}`);
          }
        });
      });

      Promise.all(deletePromises)
        .then(() => {
          setFetching(true); // Trigger re-fetch after deletion
          setSelectMode(false); // Exit selection mode
        })
        .catch((error) => console.error("Error deleting lists:", error));
    }
  };

  const handleListSelect = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter((id) => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
    }
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
          title="Home"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setFetching(true);
            navigate("/"); // Navigate after setting fetching to true
            setSearchBar(""); // Clear Search bar
          }}
        />
        <div className="search-container">
          <img src={searchLogo} alt="Search icon" className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)} // Update search state
            onKeyDown={handleSearch} // Handle key down event
          />
        </div>
        <img
          id="pfp-icon"
          src={
            userProfile?.picture
              ? `http://127.0.0.1:8000${userProfile.picture}`
              : "/default-profile.png"
          }
          alt="Profile"
          title="Profile Settings"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => navigate("profile/")} // Correctly call the function here
        />
      </div>
      <div className="body-container">
        <div className="content-text">
          <h1>My Lists</h1>
          <a href="/?category=to-do">To-Do</a>
          <a href="/?category=task">Task</a>
          <a href="/?category=shop">Shop</a>
        </div>
        <div className="content-container">
          <div className="side-bar">
            <p
              title="Add New List"
              onClick={() => navigate("add/")}
              style={{ cursor: "pointer" }}
            >
              <VscEdit className="icon" />
              Add List
            </p>
            <p>
              <VscBell className="icon" />
              Reminders
            </p>
            <p onClick={handleTrashClick} style={{ cursor: "pointer" }}>
              <VscTrash className="icon" />
              {selectMode ? "Delete" : "Trash"}
            </p>
          </div>

          {/* List Mapping */}
          <div className={`list-action ${editing ? "is-editing" : ""}`}>
            <div className="list-action-header">
              <p>Category:</p>
              <input id="title-input" type="text" placeholder="Title" />
              <button>Save</button>
            </div>
            <div className="list-action-body">
              <input id="text-input" type="text" placeholder="Text here ..." />
            </div>
            <div className="list-action-icons">
              <VscMic className="icon" title="Voice-To-Text" />
              <VscFileMedia className="icon" title="Add Media" />
              <VscBell className="icon" title="Add Reminder" />
              <VscSend className="icon" title="Share" />
            </div>
          </div>
          <div className={`list-map  ${editing ? "is-editing" : ""}`}>
            {lists.length > 0 ? (
              lists.map((list) => (
                <div
                  key={list.list_id}
                  className={`list-wrapper ${
                    selectMode && selectedLists.includes(list.list_id)
                      ? "selected"
                      : ""
                  }`}
                >
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedLists.includes(list.list_id)}
                      onChange={() => handleListSelect(list.list_id)}
                    />
                  )}
                  <div className="list-header">
                    <p>
                      {list.pined ? (
                        <VscPinned
                          title="Pinned"
                          className="pin-icon"
                          onClick={() => handlePinClick(list.list_id)}
                        />
                      ) : null}
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
                      <VscGoToEditingSession
                        style={{
                          marginLeft: "50%",
                          color: "#e95a44",
                          fontSize: "25px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleListClick(list.list_id)}
                        title="Edit List"
                      />
                    </p>
                    <p>Private: {list.private ? "yes" : "no"}</p>
                    <p>Reminder: {list.reminder || "no"} </p>
                  </div>
                  <div className="list-body">
                    <p
                      style={{
                        borderBottom: "1px white solid",
                      }}
                    >
                      Title: {list.title}
                    </p>
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
              <p
                style={{
                  textAlign: "center",
                  width: "50%",
                  margin: "0 auto",
                  color: "#172a39",
                }}
              >
                No lists to show. Why not add one now! :D
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
