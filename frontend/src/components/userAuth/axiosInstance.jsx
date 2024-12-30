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

const axiosInstance = axios.create({
  baseURL: baseURL, // Set the base URL for the API
  headers: {
    "Content-Type": "application/json", // Specify that the API expects JSON
  },
});

// Interceptor to add Authorization and X-CSRFToken dynamically before each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Dynamically add the Authorization and CSRF token
    const accessToken = localStorage.getItem("accessToken"); // Or get it from your app state/context
    const csrftoken = localStorage.getItem("csrftoken"); // Similarly, get the CSRF token dynamically

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
