import React, { useState } from "react";

function Create({ csrftoken, accessToken }) {
  const url = "http://127.0.0.1:8000/list/add/";
  const [listData, setListData] = useState({
    title: "",
    categories: "to-do", // Default value for dropdown
    private: false,
    text: "",
  });
  const listID = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setListData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setListData({
          title: "",
          categories: "to-do",
          private: false,
          text: "",
        }); // Reset form
      })
      // .then(data=> )
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1 class="pt-2 text-center">Creating a New List</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={listData.title}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Categories:
            <select
              name="categories"
              value={listData.categories}
              onChange={handleChange}
            >
              <option value="to-do">To-Do</option>
              <option value="task">Task</option>
              <option value="shop">Shop</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Private:
            <input
              type="checkbox"
              name="private"
              checked={listData.private}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Text:
            <textarea
              name="text"
              value={listData.text}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Create;
