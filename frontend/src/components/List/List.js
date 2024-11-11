import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import Create from "./Create";
import Delete from "./Delete";
import "./List.css";
import {
  BsFillUnlockFill,
  BsLockFill,
  BsFillPencilFill,
  BsFillTrash3Fill,
} from "react-icons/bs";

function List({ accessToken }) {
  console.log("List called");
  const [lists, setLists] = useState([]);
  const [fetching, setFetching] = useState(true); // State to manage fetching
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

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

  const handleAddClick = () => {
    navigate("/add/");
  };

  const handleEditClick = (listId) => {
    navigate(`/detail/${listId}`);
  };

  const handleDeleteClick = (listId) => {
    Delete(listId, csrftoken, accessToken);
    setFetching(true);
  };

  const fetchLists = useCallback(() => {
    const queryParams = new URLSearchParams(location.search); // Parse query parameters
    const category = queryParams.get("categories"); // Get 'categories' from URL
    const url = category
      ? `http://127.0.0.1:8000/list/?categories=${category}`
      : "http://127.0.0.1:8000/list/";

    const headers = {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setLists(data);
        setFetching(false); // Stop fetching when data is retrieved
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, [accessToken, location.search, csrftoken]); // Add dependencies

  useEffect(() => {
    if (fetching) {
      fetchLists();
    }
  }, [fetching, fetchLists]); // Add fetchLists to dependencies

  return (
    <div className="container">
      <h1>Lists</h1>
      <button
        className="btn btn-primary"
        style={{
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
        onClick={handleAddClick}
      >
        Add
      </button>
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
            {!list.private && <p>Text: {list.text}</p>}
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
