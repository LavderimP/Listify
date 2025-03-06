import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../userAuth/axiosInstance";
import "./Profile.css";
import { VscArrowLeft } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import settingsIcon from "../../assets/settings.svg";
import vector from "../../assets/vector.svg";
import listIcon from "../../assets/list.svg";
import logoutIcon from "../../assets/logout.svg";
import plusIcon from "../../assets/plusIcon.png";

function ProfileDetail({ onLogout }) {
  const [profileData, setProfileData] = useState({
    id: "",
    username: "",
    fullname: "",
    pfp: "",
    premium: "",
    premium_until: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  const [clicked, setClicked] = useState({
    profileClick: true,
    passwordClick: false,
    paymentsClick: false,
  });

  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Profile";
    if (fetching) {
      getProfile();
    }
  }, [fetching]);

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

  const updatePassword = async () => {
    try {
      let response = await axiosInstance.put("user/password/", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      });

      if (response.status === 200) {
        console.log("Password updated successfully.");
        toast.success("Password updated successfully.");
      } else if (response.status === 401) {
        toast.error("Unauthorized!");
        return "Unauthorized!";
      }
    } catch (error) {
      toast.error("Error updating password.");
      console.log("Error updating password: ", error);
    }
  };

  const getPayments = async () => {
    try {
      let response = await axiosInstance.get("payment/");
      if (response.status === 200) {
        setPaymentMethodsData(response.data);
        console.log("Payments data: ", response.data);
      } else if (response.status === 401) {
        return "Unauthorized!";
      }
    } catch (error) {
      console.log("Error fetching payments data: ", error);
    }

    try {
      let response = await axiosInstance.get("payment/payments/");
      if (response.status === 200) {
        setPaymentData(response.data);
        console.log("Payments data: ", response.data);
      } else if (response.status === 401) {
        return "Unauthorized!";
      }
    } catch (error) {
      console.log("Error fetching payments data: ", error);
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
        <img
          src={settingsIcon}
          alt="Settings"
          style={{
            position: "fixed",
            height: "30px",
            width: "50px",
            top: "13.3em",
            left: "6em",
          }}
        />
        <h2
          title="Edit Profile"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setClicked((prevState) => ({
              ...prevState,
              profileClick: true,
              passwordClick: false,
              paymentsClick: false,
            }))
          }
        >
          Profile Settings
        </h2>
        <img
          src={vector}
          alt="Vector"
          style={{
            position: "fixed",
            height: "30px",
            width: "50px",
            top: "17.8em",
            left: "6em",
          }}
        />
        <h2
          title="Password"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setClicked((prevState) => ({
              ...prevState,
              profileClick: false,
              passwordClick: true,
              paymentsClick: false,
            }))
          }
        >
          Password
        </h2>
        <img
          src={listIcon}
          alt="Vector"
          style={{
            position: "fixed",
            height: "30px",
            width: "50px",
            top: "22.6em",
            left: "6em",
          }}
        />
        <h2
          title="Payments"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setClicked(
              (prevState) => ({
                ...prevState,
                profileClick: false,
                passwordClick: false,
                paymentsClick: true,
              }),
              getPayments()
            )
          }
        >
          Payments
        </h2>
        <img
          src={logoutIcon}
          alt="Vector"
          style={{
            position: "fixed",
            height: "30px",
            width: "50px",
            bottom: "5.8em",
            left: "8.5em",
          }}
        />
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
        {clicked.profileClick ? (
          <>
            {" "}
            <img
              src={`http://127.0.0.1:8000${profileData.pfp}`}
              alt="Profile Picture"
            />
            <p style={{ color: "grey", textAlign: "center" }}>Edit Profile</p>
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
        ) : null}
        {clicked.passwordClick ? (
          <>
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.old_password}
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  old_password: e.target.value,
                });
              }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.new_password}
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value,
                });
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordData.confirm_password}
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                });
              }}
            />
            <button
              type="button"
              className="save-btn"
              title="Change Password"
              onClick={() => {
                updatePassword();
              }}
            >
              Change Password
            </button>
          </>
        ) : null}
        {clicked.paymentsClick ? (
          <>
            {paymentData.length > 0 ? (
              <div className="payments-methods-container">
                <h1>My Cards</h1>
                <br />
                {paymentMethodsData.map((payment) => (
                  <div key={payment.id} className="card-map">
                    <h2>{payment.card_brand}</h2>
                    <p>{payment.last4}</p>
                    <p>Card no. {payment.payment_method_id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No cards found.</p>
            )}
            <button className="AddCard-btn">
              {" "}
              <img
                src={plusIcon}
                alt="plusIcon"
                style={{
                  height: "50px",
                  width: "50px",
                  marginLeft: "5px",
                }}
              />
              <br />
              Add card
            </button>
            {paymentData.length > 0 ? (
              <div className="payments-container">
                <h1>Payments</h1>
                <br />
                {paymentData.map((payment) => (
                  <div key={payment.id} className="payment-map">
                    <p>Payment created date: {payment.created_at}</p>
                    <p>Payment updated date: {payment.updated_at}</p>
                    <p>Amount: {payment.amount}</p>
                    <p>Currency: {payment.currency}</p>
                    <p>Card: {payment.payment_method}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No payments found.</p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProfileDetail;
