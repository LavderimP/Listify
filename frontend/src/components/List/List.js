import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Delete from "./Delete";
import "./List.css";
import {
  BsFillUnlockFill,
  BsLockFill,
  BsFillPencilFill,
  BsFillTrash3Fill,
} from "react-icons/bs";

function List({ accessToken }) {
  const [lists, setLists] = useState([]);
  const [fetching, setFetching] = useState(true); // State to manage fetching
  const navigate = useNavigate();

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

  const handleEditClick = (listId) => {
    navigate(`/detail/${listId}`);
  };

  const handleDeleteClick = (listId) => {
    const csrftoken = getCookie("csrftoken");
    Delete(listId, csrftoken, accessToken); // Pass accessToken to Delete function
    setFetching(true); // Set fetching to true after delete
  };

  const fetchLists = useCallback(() => {
    const url = "http://127.0.0.1:8000/list/";
    const csrftoken = getCookie("csrftoken");

    // Only send the Authorization header if accessToken is available
    const headers = {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`; // Add Bearer token to headers
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
  }, [accessToken]); // Add accessToken as a dependency

  useEffect(() => {
    if (fetching) {
      fetchLists();
    }
  }, [fetching, fetchLists]); // Add fetchLists to dependencies

  return (
    <div className="container">
      <h1>Lists</h1>
      <button
        className="btn btn-primary "
        style={{
          border: "red solid",
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
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
