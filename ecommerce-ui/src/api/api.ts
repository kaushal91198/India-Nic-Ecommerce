import axios from "axios";

// Create an Axios instance with custom settings
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
});
import { toast } from "react-toastify";

// Helper function to show error notifications.
// Replace alert() with your preferred notification method or library (e.g., toast notifications).
const notifyError = (status: number, message: string) => {
  toast.error(`${status} - ${message} `, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};



// Request interceptor to modify or log requests before they are sent
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log("Intercepted request:", config);
    // Example: Add an Authorization header if token exists
    const token = localStorage.getItem("token"); // or any token retrieval mechanism
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to process or log responses and handle errors with notifications
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.toast) {
      toast.success(response.data.message)
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      switch (status) {
        case 400:
          notifyError(
            status,
            "Bad Request: The server could not understand the request."
          );
          break;
        case 401:
          notifyError(status, "Unauthorized: Please log in.");
          break;
        case 403:
          notifyError(
            status,
            "Forbidden: You do not have permission to access this resource."
          );
          break;
        case 404:
          notifyError(
            status,
            "Not Found: The requested resource could not be found."
          );
          break;
        case 500:
          notifyError(
            status,
            "Internal Server Error: Something went wrong on the server."
          );
          break;
        default:
          notifyError(status, `An error occurred. Status code: ${status}`);
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      notifyError(500, "No response received from the server.");
    } else {
      // Something happened in setting up the request
      notifyError(500, error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
