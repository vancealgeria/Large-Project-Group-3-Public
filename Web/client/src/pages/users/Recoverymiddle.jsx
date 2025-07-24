import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { sendRecoveryEmail, checkRecoveryCode } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";

const Recoverymiddle = () => {
  // Use user context
  const { user, setUser } = useContext(UserContext)

  // Use navigate hook
  const navigate = useNavigate()

  // Error state
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    code: "",
  });

  // Handle check code
  const handleCheckRecoveryCode = async (e) => {
    e.preventDefault();

    try {

      const email = localStorage.getItem("email");

      await checkRecoveryCode(email, formData.code);

      navigate('/recoveryend')
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle code resend
  const handleRecoveryCodeResend = async (e) => {
    e.preventDefault();

    try {

      const email = localStorage.getItem("email");
      // Resend verification code
      await sendRecoveryEmail(email);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
      <p style={{ fontSize: '50px' }}><b>CHECK EMAIL AND ENTER CODE BELOW</b></p>
      <br/>
      <form onSubmit={handleCheckRecoveryCode}>
        <div>6-Digit Code</div>
        <input
          type="number"
          placeholder="6-Digit Code"
          className="input"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          autoFocus
        />
        <br/>
        <button className="btn">Check code</button>
      </form>
        <br/>
      <button className="btn" onClick={handleRecoveryCodeResend}>Resend Email</button>

      {error && <Alert msg={error} />}
      </div>
    </section>
  );
};

export default Recoverymiddle;
