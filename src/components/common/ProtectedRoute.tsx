import { Navigate, Outlet } from "react-router-dom";

// Protected route component.
// Checks whether the user has an authentication token before allowing access.
const ProtectedRoute = () => {
  // Retrieves the authentication token stored after successful OTP verification.
  const token = localStorage.getItem("token");

  // If a token exists, render the requested nested route using Outlet.
  // Otherwise, redirect the user to the login page.
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
