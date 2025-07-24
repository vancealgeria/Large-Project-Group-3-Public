import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

const ValidRoutes = () => {
  const { user } = useContext(UserContext);

  // Only allow access if user.valid === 2
  return user.valid === 2 ? <Outlet /> : <Navigate to="/verify" />;
};

export default ValidRoutes;
