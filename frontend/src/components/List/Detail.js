import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { BsFillUnlockFill, BsLockFill } from "react-icons/bs"; // Import icons
import "./Detail.css";

function Detail({ onUpdate, accessToken }) {
  const { id } = useParams(); // Get the ID from the URL
  const [listData, setListData] = useState({
    title: "",
    categories: "",
    text: "",
    private: false,
  });

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

  useEffect(() => {
    const fetchListDetails = async () => {
      const url = `http://127.0.0.1:8000/list/${id}/`;
      const csrftoken = getCookie("csrftoken");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken,
            Authorization: `Bearer ${accessToken}`, // Add the Authorization header
          },
        });
        const data = await response.json();
        setListData(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchListDetails();
  }, [id, accessToken]); // Add accessToken to the dependency array

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setListData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrftoken = getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/list/${id}/`, {
      method: "PUT", // Assuming your API supports PUT for updates
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
        Authorization: `Bearer ${accessToken}`, // Add the Authorization header
      },
      body: JSON.stringify(listData),
    })
      .then((response) => response.json())
      .then((data) => {
        onUpdate(data); // Call onUpdate to update parent component
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit List</h2>
      <div>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={listData.title}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Categories:
          <input
            type="text"
            name="categories"
            value={listData.categories}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Text:
          <textarea name="text" value={listData.text} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Private:
          <span
            onClick={() =>
              setListData((prevData) => ({
                ...prevData,
                private: !prevData.private,
              }))
            }
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {listData.private ? (
              <BsLockFill style={{ fontSize: "20px", marginLeft: "5px" }} />
            ) : (
              <BsFillUnlockFill
                style={{
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              />
            )}
          </span>
        </label>
      </div>
      <button type="submit">Update</button>
    </form>
  );
}

export default Detail;
