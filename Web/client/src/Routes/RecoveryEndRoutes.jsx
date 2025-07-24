import { Navigate, Outlet, useLocation } from "react-router-dom";

const RecoveryEndRoutes = () => {
  const location = useLocation();
  const code = localStorage.getItem("code");

  return code
    ? <Outlet />
    : <Navigate to={location.state?.from || "/"} replace />;
};

export default RecoveryEndRoutes;
