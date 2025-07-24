/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

// Create the user context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    UserID: localStorage.getItem("UserID"), // e.g., "664f8e428b1f5b1b4d3b6c12"
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
    valid: Number(localStorage.getItem("valid")), // 0 or 1 from MongoDB
    posts: [],
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
