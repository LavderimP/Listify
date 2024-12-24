import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "http://127.0.0.1:8000/";

// Function to get CSRF token from cookies
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const csrftoken = getCookie("csrftoken");

// Function to get both tokens from localStorage
const getTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return { accessToken, refreshToken };
};

// Use the function to get tokens
const { accessToken, refreshToken } = getTokens();

// if (authTokens) {
// Decode and check if the token has expired
// const decodedToken = jwt_decode(authTokens);
// const isExpired = dayjs.unix(decodedToken.exp).isBefore(dayjs());

// if (isExpired) {
//   // Token is expired, remove it from localStorage
//   authTokens = null;
//   localStorage.removeItem("accessToken");
// }
// }

const axiosInstance = axios.create({
  baseURL: baseURL, // Set the base URL for the API
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : "", // Use the token directly
    "Content-Type": "application/json", // Specify that the API expects JSON
    "X-CSRFToken": csrftoken, // Include CSRF token for security
  },
});

export default axiosInstance;
