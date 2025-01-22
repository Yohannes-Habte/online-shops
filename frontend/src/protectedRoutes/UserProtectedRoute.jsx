
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * A higher-order component that protects routes by ensuring the user is authenticated.
 * Redirects unauthenticated users to the login page.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The components to render if the user is authenticated.
 * @returns {React.ReactNode} - The protected component or a redirect.
 */
const UserProtectedRoute = ({ children }) => {
  const { currentUser, error } = useSelector((state) => state.user);

  // Redirect to login if there is an error or no authenticated user
  if (error) {
    console.error("Error fetching user:", error);
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    console.warn("Unauthorized access attempt detected. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if the user is authenticated
  return children;
};

export default UserProtectedRoute;
