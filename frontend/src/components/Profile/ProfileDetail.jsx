import React, { useEffect, useState } from "react";

function ProfileDetail({ csrftoken, accessToken }) {
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

  useEffect(() => {
    const url = "http://127.0.0.1:8000/profiles/";

    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Prepend the base URL to the profile picture if it's a relative path
        const updatedData = {
          ...data,
          profile_picture: data.profile_picture.startsWith("/media/")
            ? `http://127.0.0.1:8000${data.profile_picture}`
            : data.profile_picture,
        };
        setProfileData(updatedData);
      })
      .catch((error) => console.error("Error fetching profile data:", error));
  }, [csrftoken, accessToken]);

  return (
    <div>
      <form>
        <h2>Profile Details</h2>
        <div className="form-div">
          <label>Picture:</label>
          <img
            src={profileData.profile_picture || ""}
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          {/* // ! To add change button */}
        </div>
        <div className="form-div">
          <label>User:</label>
          <input
            type="text"
            placeholder="User"
            value={profileData.user.name || ""}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                user: { ...profileData.user, name: e.target.value },
              })
            }
          />
        </div>
        <div className="form-div">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={profileData.user.username || ""}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                user: { ...profileData.user, username: e.target.value },
              })
            }
          />
        </div>
        <div className="form-div">
          <label>Bio:</label>
          <input
            type="text"
            placeholder="Bio"
            value={profileData.bio || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, bio: e.target.value })
            }
          />
        </div>
        <div className="form-div">
          <label>Link:</label>
          <input
            type="text"
            placeholder="Link"
            value={profileData.link || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, link: e.target.value })
            }
          />
        </div>
        <div className="form-btn">
          <button className="btn btn-primary pt-2 pb-2 mb-2">Save</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileDetail;
