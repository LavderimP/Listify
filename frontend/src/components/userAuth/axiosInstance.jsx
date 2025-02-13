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

// Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          console.log("Access token refreshed", newAccessToken);

          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Refresh token expired or invalid", err);
          // Handle token refresh failure (e.g., redirect to login)
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
