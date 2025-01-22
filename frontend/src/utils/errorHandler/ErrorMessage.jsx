// Generic Helper Function for Error Handling
export const handleError = (error) => {
  let userMessage = "An unexpected error occurred. Please try again later.";

  if (error.response) {
    // Error response from the server
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      // Token expired or unauthorized access
      userMessage = "Session expired. Please log in again.";
    } else if (status === 403) {
      // Forbidden access
      userMessage = "You do not have permission to perform this action.";
    } else if (status === 500) {
      // Server error
      userMessage = "Something went wrong. Please try again later.";
    } else {
      // Other HTTP errors
      userMessage = message || "An unexpected server error occurred.";
    }
  } else if (error.request) {
    // No response from server
    userMessage = "Network error. Please check your internet connection.";
  } else {
    // Something else went wrong
    userMessage = "An unexpected error occurred. Please try again.";
  }

  return { message: userMessage };
};




