import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, sendEmail } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";

const Login = () => {
  // Use user context
  const { user, setUser } = useContext(UserContext)

  // Use navigate hook
  const navigate = useNavigate()

  // Error state
  const [error, setError] = useState(null);

  // Form data state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  localStorage.removeItem("code");
  localStorage.removeItem("email");

  let data = null;

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login the user
      data = await loginUser(email, password);

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



  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      
      navigate('/recovery')
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <section className="card">

      <div className="flex flex-col items-center justify-center">
      <p style={{ fontSize: '50px' }}><b>LOGIN TO YOUR ACCOUNT</b></p>
      <br/>
      
       
      <form onSubmit={handleLogin}>
        <div>Email Address</div>
        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          
        />
        
       
        <div>Password</div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <button
          type="button"
          className="btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </button>

         <br/>
          
        <button className="btn">Login</button>
        <br/>
        <br/>
        <br/>
      </form>
      <button className="btn" onClick={handleForgotPassword}>Forgot Password</button>

      {error && <Alert msg={error} />}
       </div>
    </section>
    
  );
};

export default Login;
