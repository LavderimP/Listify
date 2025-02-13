import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../userAuth/axiosInstance";
import "./Profile.css";
import { VscArrowLeft, VscEdit } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileDetail({ onLogout }) {
  const [profileData, setProfileData] = useState({
    id: "",
    username: "",
    fullname: "",
    pfp: "",
    premium: "",
    premium_until: "",
  });
  const [paymentData, setPaymentData] = useState([]);

  const [clicked, setClicked] = useState(true);

  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (fetching) {
      getProfile();
    }
  }, [fetching]);

  if (!token) {
    console.error("No access token found.");
    setFetching(false);
    onLogout();
    navigate("/");
    return;
  }

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  const getProfile = async () => {
    try {
      let response = await axiosInstance.get("user/");
      if (response.status === 200) {
        setProfileData(response.data);
      } else if (response.status === 401) {
        return "Unauthorized!";
      }
    } catch (error) {
      console.log("Error fetching profile data: ", error);
    } finally {
      setFetching(false);
    }

    if (clicked) {
      getPayments();
    }
  };

  const getPayments = async () => {
    try {
      let response = await axiosInstance.get("payments/");
      if (response.status === 200) {
        setPaymentData(response.data);
      } else if (response.status === 401) {
        return "Unauthorized!";
      }
    } catch (error) {
      console.log("Error fetching payment data: ", error);
    }
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profileData.username);
      formData.append("fullname", profileData.fullname);

      if (profileData.pfp instanceof File) {
        formData.append("pfp", profileData.pfp);
      }

      let response = await axiosInstance.put("user/", formData);

      if (response.status === 200) {
        console.log("Profile updated successfully.");
        toast.success("Profile updated successfully.");
        setFetching(true);
      } else if (response.status === 401) {
        toast.error("Unauthorized!");
        return "Unauthorized!";
      }
    } catch (error) {
      toast.error("Error updating profile data.");
      console.log("Error updating profile data: ", error);
    }
  };

  const deleteProfile = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );

    const password = window.prompt(
      "Enter your password to confirm profile deletion:"
    );

    if (confirmDelete) {
      if (!password) {
        toast.error("Password is required to delete profile.");
        return;
      }
      try {
        // Append password to the request body
        let response = await axiosInstance.delete("user/", {
          data: { password: password },
        });
        if (response.status === 204) {
          toast.success("Profile deleted successfully.");
          console.log("Profile deleted successfully.");
          handleLogoutClick();
        } else if (response.status === 401) {
          toast.error("Unauthorized!");
          return "Unauthorized!";
        }
      } catch (error) {
        toast.error("Error deleting profile.");
        console.log("Error deleting profile: ", error.data);
      }
    } else {
      toast.info("Profile deletion cancelled.");
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="profile-sidebar">
        <VscArrowLeft
          className="back-btn"
          onClick={() => {
            navigate("/");
          }}
          title="Back to Home"
        />
        <h2
          title="Edit Profile"
          style={{ cursor: "pointer" }}
          onClick={() => setClicked(true)}
        >
          Profile Settings
        </h2>
        <h2
          title="Payments"
          style={{ cursor: "pointer" }}
          onClick={() => setClicked(false)}
        >
          Payments
        </h2>
        <button
          className="logout-btn"
          type="button"
          title="Log Out"
          onClick={handleLogoutClick}
        >
          Log Out
        </button>
      </div>
      <div className="profile-content">
        {clicked ? (
          <>
            {" "}
            <img
              src={`http://127.0.0.1:8000${profileData.pfp}`}
              alt="Profile Picture"
            />
            <p style={{ color: "grey" }}>Edit Profile</p>
            <input
              type="text"
              placeholder="Username"
              value={profileData.username}
              onChange={(e) => {
                setProfileData({ ...profileData, username: e.target.value });
              }}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={profileData.fullname}
              onChange={(e) => {
                setProfileData({ ...profileData, fullname: e.target.value });
              }}
            />
            {profileData.premium ? (
              <p>Premium: Paid</p>
            ) : (
              <p>Premium: Unpaid</p>
            )}
            {profileData.premium ? (
              <p>Premium Until: {profileData.premium_until}</p>
            ) : null}
            <button
              type="button"
              className="save-btn"
              title="Save Changes"
              onClick={() => {
                updateProfile();
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="delete-btn"
              title="Delete Profile"
              onClick={() => {
                deleteProfile();
              }}
            >
              Delete Profile
            </button>
          </>
        ) : (
          <>
            <h3>Payments</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileDetail;
