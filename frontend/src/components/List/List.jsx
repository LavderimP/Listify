import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import searchLogo from "../../assets/search.svg";
import "./List.css";
import axiosInstance from "../userAuth/axiosInstance";
import { jwtDecode } from "jwt-decode";
import {
  VscEdit,
  VscBell,
  VscTrash,
  VscGoToEditingSession,
  VscPinned,
  VscMic,
  VscFileMedia,
  VscSend,
} from "react-icons/vsc";

function List() {
  const [lists, setLists] = useState([]);
  const [editing, setEditing] = useState(false);
  const [addList, setAddList] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [searchBar, setSearchBar] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // For category filter
  const [reminderFilter, setReminderFilter] = useState(false);

  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

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

  const handleEditClick = () => {
    setEditing(!editing);
  };

  return (
    <div className="list-container">
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
            userProfile?.pfp
              ? `http://127.0.0.1:8000${userProfile.pfp}`
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
          onClick={() => navigate("profile/")}
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
          <a
            href="javascript:void(0);"
            onClick={() => handleCategoryClick("to-do")}
            style={{ cursor: "pointer" }}
          >
            To-Do
          </a>
          <a
            href="javascript:void(0);"
            onClick={() => handleCategoryClick("task")}
            style={{ cursor: "pointer" }}
          >
            Task
          </a>
          <a
            href="javascript:void(0);"
            onClick={() => handleCategoryClick("shop")}
            style={{ cursor: "pointer" }}
          >
            Shop
          </a>
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
            <p onClick={handleReminderClick} style={{ cursor: "pointer" }}>
              <VscBell className="icon" />
              Reminders
            </p>
            <p style={{ cursor: "pointer" }}>
              <VscTrash className="icon" />
              Trash
            </p>
          </div>
          <div className={`list-selectable ${editing ? "editing" : ""}`}>
            <div className="list-selectable-header">
              <button className="cat-btn">Category</button>
              <h2>Title</h2>
              <button className="save-btn">Save</button>
            </div>
            <div className="list-selectable-body">
              <p>Text</p>
            </div>
            <div className="list-selectable-footer">
              <button>
                <VscMic title="Voice" />
              </button>
              <button>
                <VscFileMedia title="Media" />
              </button>
              <button>
                <VscSend title="Send" />
              </button>
            </div>
          </div>
          {/* List Mapping */}
          <div className={`list-map ${editing ? "editing" : ""}`}>
            {lists.length > 0 ? (
              lists.map((list) => (
                <div key={list.list_id} className="list-wrapper">
                  <div className="list-header">
                    <p>
                      {list.pined ? (
                        <VscPinned title="Pinned" className="pin-icon" />
                      ) : null}
                      <span>
                        <span style={{ color: "#e95a44" }}>
                          {list.category}
                        </span>{" "}
                        <span style={{ fontSize: "15px" }}>
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
                        title="Edit List"
                        onClick={() => handleEditClick()}
                      />
                    </p>
                    <p>Private: {list.private ? "yes" : "no"}</p>
                    <p>Reminder: {list.reminder || "no"}</p>
                  </div>
                  <div className="list-body">
                    <p style={{ borderBottom: "1px white solid" }}>
                      Title: {list.title}
                    </p>
                    <p>{list.private ? null : `Text: ${list.text}`}</p>
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
