import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "../userAuth/axiosInstance";

// Icons and Styles
import "./List.css";
import Logo from "../../assets/Logo.png";
import search from "../../assets/search.svg";
import bell from "../../assets/bell 1.svg";
import edit from "../../assets/edit.svg";
import trash from "../../assets/trash.svg";
import send from "../../assets/send.svg";

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

  const [fetching, setFetching] = useState(true); // To handle fetching state
  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
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

    if (!token) {
      console.error("No access token found.");
      setFetching(false);
      return;
    } else {
      const decodedToken = jwtDecode(token);
      setUserProfile(decodedToken);
    }

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
      alert("List deleted successfully!");
    } else {
      alert("Error deleting list.");
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
            onClick={() => handleCategoryClick("to-do")}
            style={{ cursor: "pointer" }}
          >
            To-Do
          </p>
          <p
            onClick={() => handleCategoryClick("task")}
            style={{ cursor: "pointer" }}
          >
            Task
          </p>
          <p
            onClick={() => handleCategoryClick("shop")}
            style={{ cursor: "pointer" }}
          >
            Shop
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
              <img src={edit} alt="edit icon" className="edit-icon" />
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
              <input
                className="category-input"
                placeholder="Category"
                value={listEditing.category || ""}
                onChange={(e) =>
                  setListEditing({ ...listEditing, category: e.target.value })
                }
              />
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
              <img src={send} alt="send icon" className="send-icon" />
            </div>
          </div>
          {/* List Mapping */}
          <div className={`list-map ${editing ? "editing" : ""}`}>
            {lists.length > 0 ? (
              lists.map((list) => (
                <div key={list.list_id} className="list-wrapper">
                  <div className="list-header">
                    {list.pined ? (
                      // <img src={pin} alt="pin icon" className="pin-icon" />
                      <p>pin icon</p>
                    ) : null}
                    <p style={{ color: "#e95a44" }}>{list.category}</p>
                    <p style={{ fontSize: "15px" }}>
                      {list.created_at.replace(/-/g, ".").slice(0, 10)}
                    </p>
                    <img
                      src={edit}
                      alt="edit icon"
                      className="edit-icon"
                      title="Edit List"
                      style={
                        list.pined
                          ? {
                              marginLeft: "40%",
                              color: "#e95a44",
                              fontSize: "25px",
                              cursor: "pointer",
                            }
                          : {
                              marginLeft: "60%",
                              color: "#e95a44",
                              fontSize: "25px",
                              cursor: "pointer",
                            }
                      }
                      onClick={() => handleEditClick(list)}
                    />
                    {/* <p>Private: {list.private ? "yes" : "no"}</p> */}
                    {/* <p>Reminder: {list.reminder || "no"}</p> */}
                  </div>
                  <div className="list-body">
                    <p style={{ borderBottom: "1px white solid" }}>
                      {list.title}
                    </p>
                    <p>
                      {list.private
                        ? null
                        : `${list.text.substring(0, 270)}${
                            list.text.length > 270 ? "..." : ""
                          }`}
                    </p>
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
                  margin: "0 80%",
                  color: "#172a39",
                }}
              >
                No lists to show.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
