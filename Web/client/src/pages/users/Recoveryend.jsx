import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { recoveryPasswordUpdate } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";

const Recoveryend = () => {
  // Use user context
  const { user, setUser } = useContext(UserContext)

  // Use navigate hook
  const navigate = useNavigate()

  // Error state
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  let data = null;

  // Handle check code
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Password complexity regex:
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{}[\]|\\;:'",.<>\/?])[A-Za-z\d@$!%*?&#^()\-_=+{}[\]|\\;:'",.<>\/?]{8,}$/;
  
    if (!passwordRegex.test(formData.newPassword)) {
      setError("Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }

    try {
      // Check code for the user

      const code = localStorage.getItem("code");
      const email = localStorage.getItem("email");

      data = await recoveryPasswordUpdate(email, formData.newPassword, formData.confirmNewPassword, code);

      const { UserID, firstName, lastName, valid } = data;
      // Update the user state
      setUser({UserID, firstName, lastName, valid, posts: []})

      localStorage.removeItem("code");
      localStorage.removeItem("email");

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
      <p style={{ fontSize: '50px' }}><b>ENTER NEW PASSWORD</b></p>
      <br/>
      <form onSubmit={handlePasswordUpdate}>
        <div>New Password</div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          className="input"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          autoFocus
        />
        <div>Confirm New Password</div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          className="input"
          value={formData.confirmNewPassword}
          onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
        />
        <br/>
        <button
          type="button"
          className="btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Passwords" : "Show Passwords"}
        </button>
        <br/>

        <button className="btn">Change Password</button>
      </form>

      {error && <Alert msg={error} />}
      </div>
    </section>
  );
};

export default Recoveryend;
