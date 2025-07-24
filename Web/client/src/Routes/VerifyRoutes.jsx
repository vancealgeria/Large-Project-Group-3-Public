import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

const VerifyRoutes = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return user.valid === 1
    ? <Outlet />
    : <Navigate to={location.state?.from || "/"} replace />;
    
};

export default VerifyRoutes;
