import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const ReDirect = () => {
  const { user } = useContext(UserContext);
  const { UserID, valid } = user;

  // Optional: Debug logs
  console.log("Redirecting based on:", { UserID, valid });

  // If no user logged in
  if (!UserID || valid === 0 || valid === null || valid === undefined) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but not verified
  if (valid === 1) {
    return <Navigate to="/verify" replace />;
  }

  // If user is verified
  if (valid === 2) {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback (shouldn't normally reach here)
  return <Navigate to="/login" replace />;
};

export default ReDirect;
