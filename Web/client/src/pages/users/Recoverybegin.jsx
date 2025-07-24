import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { sendRecoveryEmail } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";

const Recoverybegin = () => {
  // Use user context
  const { user, setUser } = useContext(UserContext)

  // Use navigate hook
  const navigate = useNavigate()

  // Error state
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
  });

  localStorage.removeItem("code");
  localStorage.removeItem("email");

  // Handle check code
  const handleRecoveryEmail = async (e) => {
    e.preventDefault();

    try {
      
      await sendRecoveryEmail(formData.email);

      navigate('/recoverymiddle')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
       <p style={{ fontSize: '50px' }}><b>ENTER THE ACCOUNT EMAIL</b></p>
      <br/>
      <form onSubmit={handleRecoveryEmail}>
        <div>Email</div>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          autoFocus
        />
        <br/>
        <button className="btn">Send verification code</button>
      </form>

      {error && <Alert msg={error} />}
      </div>
    </section>
  );
};

export default Recoverybegin;
