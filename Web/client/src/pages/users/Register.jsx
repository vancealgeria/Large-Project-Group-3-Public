import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser, sendEmail } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";


const Register = () => {
  // Use user context
  const { user, setUser } = useContext(UserContext)

  // Use navigate hook
  const navigate = useNavigate()

  // Error state
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  localStorage.removeItem("code");
  localStorage.removeItem("email");

  let data = null;

  // Handle login
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password complexity regex:
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{}[\]|\\;:'",.<>\/?])[A-Za-z\d@$!%*?&#^()\-_=+{}[\]|\\;:'",.<>\/?]{8,}$/;
  
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }

    try {
      // Register the user
      data = await registerUser(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.passwordConfirm
      );

      const { UserID, firstName, lastName, valid } = data;
      // Update the user state
      setUser({UserID, firstName, lastName, valid, posts: []})
      // Navigate to dashboard
      handleVerify(UserID, valid)
    } catch (error) {
      setError(error.message);
    }
  };



  // Check validity
  const handleVerify = async (UserID, valid) => {
    
    

    if(valid === 1){
      try {
        // Login the user
        await sendEmail(UserID);
        // Navigate to dashboard
        navigate('/verify')
      } catch (error) {
        setError(error.message);
      }
    }else{
      navigate('/dashboard')
    }
  };


  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
      <p style={{ fontSize: '50px' }}><b>CREATE A NEW ACCOUNT</b></p>
      <br/>
      <form onSubmit={handleRegister}>
        <div> First Name </div>
        <input
          type="text"
          placeholder="First Name"
          className="input"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          autoFocus
        />
        <div> Last Name </div>
        <input
          type="text"
          placeholder="Last Name"
          className="input"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <div> Email Address </div>
        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div> Password </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="input"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        
        <div> Confirm Password</div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="input"
          value={formData.passwordConfirm}
          onChange={(e) =>
            setFormData({ ...formData, passwordConfirm: e.target.value })
          }
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
        <button className="btn">Register</button>
      </form>

      {error && <Alert msg={error} />}
      </div>
    </section>
  );
};

export default Register;
