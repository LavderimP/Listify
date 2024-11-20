import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Hooks for navigation and URL management
import Delete from "./Delete";
import "./List.css";
import {
  BsFillUnlockFill,
  BsLockFill,
  BsFillPencilFill,
  BsFillTrash3Fill,
} from "react-icons/bs"; // Importing icons for UI

function List({ accessToken }) {
  console.log("List component rendered");

  // State to hold fetched lists and loading state
  const [lists, setLists] = useState([]);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation(); // To get current URL and query parameters

  // Function to get CSRF token from cookies (for secure requests)
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

  const csrftoken = getCookie("csrftoken");

  // Handlers for navigation and actions
  const handleAddClick = () => {
    navigate("/add/"); // Navigate to the add page
  };

  const handleEditClick = (listId) => {
    navigate(`/list/${listId}`); // Navigate to the detail page for editing
  };

  const handleDeleteClick = (listId) => {
    Delete(listId, csrftoken, accessToken); // Call delete function
    setFetching(true); // Trigger a re-fetch after deletion
  };

  // Function to fetch lists from the API, filtered by category if applicable
  const fetchLists = useCallback(() => {
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

  // useEffect to trigger fetchLists when 'fetching' changes
  useEffect(() => {
    if (fetching) {
      fetchLists(); // Fetch lists when the component mounts or fetching is true
    }
  }, [fetching, fetchLists]);

  return (
    <div className="container">
      <h1>Lists</h1>
      {/* Add button */}
      <button
        className="btn btn-primary pt-2 pb-2 mb-2"
        onClick={handleAddClick}
      >
        Add
      </button>

      {/* Display list items */}
      <div className="list-wrapper">
        {lists.map((list) => (
          <div key={list.list_id} className="task-wrapper">
            <p>Title: {list.title}</p>
            <p>ID: {list.list_id}</p>
            <p>Category: {list.categories}</p>
            <p className="private-status">
              Private:{" "}
              {list.private ? (
                <BsLockFill
                  className="lock-icon"
                  style={{
                    fontSize: "20px",
                    marginLeft: "5px",
                  }}
                />
              ) : (
                <BsFillUnlockFill
                  className="unlock-icon"
                  style={{ fontSize: "20px", marginLeft: "5px" }}
                />
              )}
            </p>
            {/* Display text if the item is not private */}
            {!list.private && <p>Text: {list.text}</p>}

            {/* Buttons for editing and deleting */}
            <div className="button-container">
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => handleEditClick(list.list_id)}
              >
                <BsFillPencilFill />
              </button>
              <button
                className="btn btn-sm btn-outline-dark delete"
                onClick={() => handleDeleteClick(list.list_id)}
              >
                <BsFillTrash3Fill />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
