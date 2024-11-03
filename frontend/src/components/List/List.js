import React, { useEffect, useState } from "react";
import "./List.css";
import { BsFileLock2Fill } from "react-icons/bs";
import { BsFileLockFill } from "react-icons/bs";
// import Detail from "../Detail/Detail";

const List = () => {
  // * Initializing state
  const [lists, setLists] = useState([]);

  // *  Our CsrfToken
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleEditClick = (list) => {
    console.log("Edit button clicked for index:", list.categories);
    // Additional logic for editing can go here
  };

  const handleDeleteClick = (index) => {
    console.log("Delete button clicked for index:", index);
    // Additional logic for deleting can go here
  };

  useEffect(() => {
    console.log("Its mounting");
    const url = "http://127.0.0.1:8000/list/";
    const csrftoken = getCookie("csrftoken");

    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => response.json())
      .then((data) => setLists(data))
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []); // Empty dependency array to run only once on mount

  // * Render method
  return (
    <div className="container">
      <h1>Lists</h1>
      <div className="list-wrapper">
        {lists.map((list, index) => (
          <div key={index} className="task-wrapper">
            <div style={{ flex: 7 }}>
              <span>
                <p>Title: {list.title}</p>
                <p>ID: {list.list_id}</p>
                <p>Category: {list.categories}</p>
                <p>
                  Private:{" "}
                  {list.private ? <BsFileLock2Fill /> : <BsFileLockFill />}
                </p>
                {!list.private && <p>Text: {list.text}</p>}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => handleEditClick(list)}
              >
                Edit
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <button
                className="btn btn-sm btn-outline-dark delete"
                onClick={() => handleDeleteClick(index)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
