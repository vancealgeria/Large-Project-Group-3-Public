import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

const Layout = () => {
  // Use navigate hook
  const navigate = useNavigate();

  // Grab the User global state
  const { user, setUser } = useContext(UserContext);

  // Handle logout
  const handleLogout = () => {
      // Reset the User state
      setUser({ UserID: null, firstName: null, lastName: null, valid: null, posts: [] });
      // Remove the items from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("UserID");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("valid");
      localStorage.removeItem("email");
      localStorage.removeItem("code");
      // Navigate to Home page
      navigate("/");
  };

  return (
    <>
      <header className="bg-[#0b0e2a] text-white">
        <nav className="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
          <Link
            title="Home"
            to="/"
            className="nav-link"
          >HOME</Link>

          {user.firstName ? (
            <div className="flex items-center gap-4">
              <Link
                title="Leaderboard"
                to="/leaderboard"
                className="nav-link px-100 py-1"
              >LEADERBOARD</Link>

              <Link
                title="Record"
                to="/record"
                className="nav-link px-100 py-1"
              >RECORD</Link>
              <Link
                title="View History"
                to="/history"
                className="nav-link px-1 py-1"
                
              >HISTORY</Link>
              
              <button
                title="Logout"
                onClick={handleLogout}
                className=" nav-link px-100 py-1"
              >LOGOUT</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                title="Login"
                to="/login"
                className="fa-solid fa-right-to-bracket nav-link"
              ></Link>
              <Link
                title="Register"
                to="/register"
                className="fa-solid fa-user-plus nav-link"
              ></Link>
            </div>
          )}
        </nav>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
