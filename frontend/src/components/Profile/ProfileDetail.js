import React, { useEffect, useState } from "react";

function ProfileDetail({ accessToken }) {
  const [profileData, setProfileData] = useState({
    user: {
      id: "",
      name: "",
      username: "",
    },
    profile_id: "",
    profile_picture: "",
    bio: "",
    link: "",
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
    const fetchProfileDetail = async () => {
      const url = "http://127.0.0.1:8000/profile/";
      const csrftoken = getCookie("csrftoken");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        console.log("Data: ", data); // Log the data to ensure it's correct
        setProfileData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfileDetail();
  }, [accessToken]);

  return (
    <div>
      <h2>Profile Details</h2>
      <form>
        <div className="form-div">
          Picture:
          <input
            type="text"
            placeholder="Picture"
            value={profileData.profile_picture || ""} // Handle null or empty string for profile_picture
            onChange={(e) =>
              setProfileData({
                ...profileData,
                profile_picture: e.target.value,
              })
            }
          />
        </div>
        <div className="form-div">
          User:
          <input
            type="text"
            placeholder="User"
            value={profileData.user.name || ""} // Handle empty name
            onChange={(e) =>
              setProfileData({
                ...profileData,
                user: { ...profileData.user, name: e.target.value },
              })
            }
          />
        </div>
        <div className="form-div">
          Username:
          <input
            type="text"
            placeholder="Username"
            value={profileData.user.username || ""} // Handle empty username
            onChange={(e) =>
              setProfileData({
                ...profileData,
                user: { ...profileData.user, username: e.target.value },
              })
            }
          />
        </div>
        <div className="form-div">
          Bio:
          <input
            type="text"
            placeholder="Bio"
            value={profileData.bio || ""} // Handle empty bio
            onChange={(e) =>
              setProfileData({ ...profileData, bio: e.target.value })
            }
          />
        </div>
        <div className="form-div">
          Link:
          <input
            type="text"
            placeholder="Link"
            value={profileData.link || ""} // Handle null link gracefully
            onChange={(e) =>
              setProfileData({ ...profileData, link: e.target.value })
            }
          />
        </div>
      </form>
    </div>
  );
}

export default ProfileDetail;
