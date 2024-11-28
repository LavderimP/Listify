import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { BsFillUnlockFill, BsLockFill } from "react-icons/bs"; // Import icons
import "./Detail.css";

function Detail({ onUpdate, csrftoken, accessToken }) {
  const { id } = useParams(); // Get the ID from the URL
  const [listData, setListData] = useState({
    title: "",
    categories: "",
    text: "",
    private: false,
  });
  const [gotUpdated, setGotUpdated] = useState(false);

  // Fetch the list details when the component is mounted or when `id` or `accessToken` changes
  useEffect(() => {
    const fetchListDetails = async () => {
      const url = `http://127.0.0.1:8000/list/${id}/`;

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
  }, [id, accessToken, csrftoken]); // Add accessToken and csrftoken to dependencies to refetch data if they change

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setListData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission for updating the list
  const handleSubmit = (e) => {
    e.preventDefault();

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
        onUpdate(data); // Call onUpdate to notify the parent component
        setGotUpdated(true); // Show the "List Updated" message
        setTimeout(() => setGotUpdated(false), 3000); // Hide the "List Updated" message after 3 seconds
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit List</h2>
      {gotUpdated && <p>List Updated</p>}{" "}
      {/* Conditionally render the "List Updated" message */}
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
