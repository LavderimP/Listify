import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "../userAuth/axiosInstance";

// Icons and Styles
import "./List.css";
import Logo from "../../assets/Logo.png";

import search from "../../assets/search.svg";
import file from "../../assets/file.svg"; // For Adding Lists
import pin from "../../assets/pin.svg"; // For Pinned Lists
import bell from "../../assets/bell.svg"; // For Reminder Filter
import edit from "../../assets/edit.svg"; // For Editing Lists
import trash from "../../assets/trash.svg"; // For Deleting Lists

import send from "../../assets/send.svg"; // For Sending Lists
import bellDark from "../../assets/bell-dark.svg"; // For Reminder Filter
import pinDark from "../../assets/pin-dark.svg"; // For Pinned Lists

// Notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function List() {
  const [lists, setLists] = useState([]); // To handle list data
  const [listEditing, setListEditing] = useState([]); // To handle list editing data
  const [editing, setEditing] = useState(false); // To handle editing state
  const [adding, setAdding] = useState(false); // To handle adding state

  const [userProfile, setUserProfile] = useState(null); // To handle user profile data

  const [searchBar, setSearchBar] = useState(""); // For search bar
  const [categoryFilter, setCategoryFilter] = useState(""); // For category filter
  const [reminderFilter, setReminderFilter] = useState(false); // For reminder filter
  const [showCalendar, setShowCalendar] = useState(false); // For calendar

  const [fetching, setFetching] = useState(true); // To handle fetching state
  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
    document.title = "Home"; // Set the title of the page
    if (fetching) {
      getLists();
    }
  }, [fetching, categoryFilter, searchBar, reminderFilter]);

  const getLists = async () => {
    const token = localStorage.getItem("accessToken");
    const params = {};

    if (searchBar) params.title = searchBar;
    if (categoryFilter) params.category = categoryFilter;
    if (reminderFilter === true) {
      params.reminder = true;
    }

    const decodedToken = jwtDecode(token);
    setUserProfile(decodedToken);

    try {
      let response = await axiosInstance.get("list/", { params });
      if (response.status === 200) {
        setLists(response.data);
      } else if (response.status === 401) {
        return "Unauthorized!";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // Update search parameters and trigger fetching
      navigate(`/?title=${encodeURIComponent(searchBar)}`);
      setFetching(true);
    }
  };

  const handleDateChange = (event) => {
    if (event.target.value) {
      setListEditing({ ...listEditing, reminder: event.target.value });
    } else {
      setListEditing({ ...listEditing, reminder: null });
    }
  };

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    navigate(`/?category=${category}`);
    setFetching(true);
  };

  const handleReminderClick = () => {
    setReminderFilter(!reminderFilter);
    navigate("/?reminder");
    setFetching(true);
  };

  const handleEditClick = (list) => {
    setEditing(!editing);
    if (!editing) {
      setListEditing(list);
    } else {
      setListEditing([]);
    }
  };

  const handleSaveClick = async () => {
    if (!adding) {
      try {
        let response = await axiosInstance.put(
          `list/${listEditing.list_id}/`,
          listEditing
        );
        if (response.status === 200) {
          setEditing(false);
          setListEditing([]);
          toast.success("List updated successfully!");
          setFetching(true);
        } else if (response.status === 400) {
          toast.error("Bad request");
          return "Bad request";
        } else if (response.status === 401) {
          toast.error("Unauthorized");
          return "Unauthorized";
        } else if (response.status === 404) {
          toast.error("Object not found");
          return "Object not found";
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      try {
        let response = await axiosInstance.post(`list/add/`, listEditing);
        if (response.status === 201) {
          setEditing(false);
          setAdding(false);
          setListEditing([]);
          toast.success("List added successfully!");
          setFetching(true);
        } else if (response.status === 401) {
          toast.error("Unauthorized");
          return "Unauthorized";
        } else if (response.status === 404) {
          toast.error("Object not found");
          return "Object not found";
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const handleDeleteClick = async () => {
    let response = await axiosInstance.delete(
      `list/${listEditing.list_id}/`,
      listEditing
    );
    if (response.status === 204) {
      setEditing(false);
      setListEditing([]);
      setFetching(true);
      toast.success("List deleted successfully!");
    } else {
      toast.error("Error deleting list");
      return response.data;
    }
  };

  return (
    <div className="list-container">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Logo */}
      <div className="header-container">
        <img
          id="logo-icon"
          src={Logo}
          alt="Logo"
          title="Home"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setFetching(true);
            navigate("/");
            setSearchBar("");
            setCategoryFilter(""); // Reset the category filter
          }}
        />
        <div className="search-container">
          <img src={search} alt="Search icon" className="search-icon" />
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
            userProfile?.pfp
              ? `http://127.0.0.1:8000${userProfile.pfp}`
              : "/default-profile.png"
          }
          alt="Profile"
          title="Profile"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => navigate("user/")}
        />
      </div>

      <div className="body-container">
        <div className="content-text">
          <h1
            onClick={() => {
              setFetching(true);
              navigate("/");
              setSearchBar("");
              setCategoryFilter(""); // Reset the category filter
            }}
            style={{ cursor: "pointer" }}
          >
            My Lists
          </h1>
          <p
            onClick={() => handleCategoryClick("personal")}
            style={{ cursor: "pointer" }}
          >
            Personal
          </p>
          <p
            onClick={() => handleCategoryClick("work")}
            style={{ cursor: "pointer" }}
          >
            Work
          </p>
          <p
            onClick={() => handleCategoryClick("home")}
            style={{ cursor: "pointer" }}
          >
            Home
          </p>
          <p
            onClick={() => handleCategoryClick("books")}
            style={{ cursor: "pointer" }}
          >
            Books
          </p>
          <p
            onClick={() => handleCategoryClick("article")}
            style={{ cursor: "pointer" }}
          >
            Article
          </p>
          <p
            onClick={() => handleCategoryClick("list")}
            style={{ cursor: "pointer" }}
          >
            List
          </p>
        </div>
        <div className="content-container">
          <div className="side-bar">
            <p
              title="Add New List"
              onClick={() => {
                setAdding(!adding);
                setEditing(!editing);
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={file} alt="file icon" className="file-icon" />
              Add List
            </p>
            <p
              title="Lists with Reminder"
              onClick={handleReminderClick}
              style={{ cursor: "pointer" }}
            >
              <img src={bell} alt="Reminder icon" className="reminder-icon" />
              Reminders
            </p>
            {editing ? (
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleDeleteClick();
                }}
              >
                <img src={trash} alt="trash icon" className="trash-icon" />
                Trash
              </p>
            ) : null}
          </div>
          <div className={`list-selectable ${editing ? "editing" : ""}`}>
            <div className="list-selectable-header">
              <select
                className="category-input"
                value={listEditing.category || ""}
                onChange={(e) =>
                  setListEditing({ ...listEditing, category: e.target.value })
                }
              >
                <option value="">Category</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="books">Books</option>
                <option value="article">Article</option>
                <option value="list">List</option>
              </select>
              <input
                className="title-input"
                placeholder="Title"
                value={listEditing.title || ""}
                onChange={(e) =>
                  setListEditing({ ...listEditing, title: e.target.value })
                }
              />
              <button
                className="save-btn"
                onClick={() => {
                  handleSaveClick();
                }}
              >
                Save
              </button>
            </div>
            <div className="list-selectable-body">
              <textarea
                className="text-input"
                placeholder="Text"
                value={listEditing.text || ""}
                onChange={(e) => {
                  const target = e.target;
                  setListEditing({ ...listEditing, text: target.value });
                }}
                ref={(textarea) => {
                  if (textarea) {
                    textarea.style.height = "auto"; // Reset height
                    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
                  }
                }}
              />
            </div>
            <div className="list-selectable-footer">
              {listEditing.reminder ? (
                <p style={{ color: "#e95a44" }}>
                  {listEditing.reminder
                    .replace(/-/g, ".")
                    .replace("T", " ")
                    .slice(0, 25)}
                </p>
              ) : null}
              {listEditing.pined ? (
                <img
                  src={pin}
                  alt="pin icon"
                  title="Unpin List"
                  className="pinDark-icon"
                  onClick={() =>
                    setListEditing({
                      ...listEditing,
                      pined: !listEditing.pined,
                    })
                  }
                  style={{ cursor: "pointer", height: "1.5em" }}
                />
              ) : (
                <img
                  src={pinDark}
                  alt="pinDark icon"
                  title="Pin List"
                  className="pinDark-icon"
                  onClick={() =>
                    setListEditing({
                      ...listEditing,
                      pined: !listEditing.pined,
                    })
                  }
                  style={{ cursor: "pointer", height: "1.5em" }}
                />
              )}
              {listEditing.reminder ? (
                <img
                  src={bell}
                  alt="bell icon"
                  title="Remove Reminder"
                  className="bell-icon"
                  onClick={() =>
                    setListEditing({
                      ...listEditing,
                      reminder: null,
                    })
                  }
                  style={{ cursor: "pointer", height: "1.5em" }}
                />
              ) : (
                <img
                  src={bellDark}
                  alt="bellDark icon"
                  title="Set Reminder"
                  className="bellDark-icon"
                  onClick={() => {
                    setShowCalendar((prev) => !prev);
                  }}
                  style={{ cursor: "pointer", height: "1.5em" }}
                />
              )}

              {showCalendar ? (
                <input
                  type="datetime-local"
                  value={listEditing.reminder || ""}
                  onChange={handleDateChange}
                />
              ) : null}
            </div>
          </div>
          {/* List Mapping */}
          <div className={`list-map ${editing ? "editing" : ""}`}>
            {lists.length > 0 ? (
              lists.map((list) => (
                <div
                  key={list.list_id}
                  className={` list-wrapper  ${editing ? "editing" : ""}`}
                >
                  <div className="list-header">
                    {list.pined ? (
                      <img
                        src={pin}
                        alt="pin icon"
                        className="pin-icon"
                        style={{ cursor: "default" }}
                      />
                    ) : null}
                    <p style={{ color: "#e95a44", cursor: "default" }}>
                      {list.category}
                    </p>
                    <p style={{ fontSize: "15px", cursor: "default" }}>
                      {list.created_at.replace(/-/g, ".").slice(0, 10)}
                    </p>
                    <p>
                      {list.reminder ? (
                        <img
                          src={bell}
                          alt="bell icon"
                          className="bell-icon"
                          style={{
                            height: "1.5em",
                            cursor: "default",
                          }}
                        />
                      ) : null}
                    </p>
                    <img
                      src={edit}
                      alt="edit icon"
                      className="edit-icon"
                      title="Edit List"
                      style={{
                        marginLeft: list.pined
                          ? list.reminder
                            ? "35%"
                            : "45%"
                          : "50%",
                        marginBottom: "10%",
                        color: "#e95a44",
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditClick(list)}
                    />
                  </div>
                  <div className="list-body">
                    <p style={{ borderBottom: "1px white solid" }}>
                      {list.title}
                    </p>
                    <p>
                      {list.text.substring(0, 270)}
                      {list.text.length > 270 ? "..." : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  textAlign: "center",
                  width: "50%",
                  color: "red",
                  marginLeft: "100%",
                  marginTop: "10%",
                }}
              >
                No lists found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
