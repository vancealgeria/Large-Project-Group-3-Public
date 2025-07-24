import { Navigate, Outlet, useLocation } from "react-router-dom";

const RecoveryMiddleRoutes = () => {
  const location = useLocation();
  const email = localStorage.getItem("email");
  const code = localStorage.getItem("code");

  const allowAccess = email && !code;

  return allowAccess
    ? <Outlet />
    : <Navigate to={location.state?.from || "/"} replace />;
};

export default RecoveryMiddleRoutes;
