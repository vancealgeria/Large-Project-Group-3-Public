import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { sendEmail, checkCode } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";

const Verify = () => {
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

  let data = null;

  // Handle check code
  const handleCheckCode = async (e) => {
    e.preventDefault();

    try {
      const { UserID } = user;
      // Check code for the user
      data = await checkCode(UserID, formData.code);

      
      // Update context — preserve all previous fields
      setUser(prev => ({ ...prev, valid: data.valid }));


      localStorage.setItem("valid", data.valid);


      navigate('/dashboard')

    } catch (error) {
      setError(error.message);
    }
  };


  
  // Handle code resend
  const handleCodeResend = async (e) => {
    e.preventDefault();

    const { UserID } = user;

    try {
      // Resend verification code
      await sendEmail(UserID);
    } catch (error) {
      setError(error.message);
    }
  };


  
  const handleEmailChangeRedirect = async (e) => {
    e.preventDefault();

    try {
      
      navigate('/verifychangeemail')
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <section className="card">
      
    <div className="flex flex-col items-center justify-center">
      <p style={{ fontSize: '50px' }}><b>CHECK EMAIL AND ENTER CODE BELOW</b></p>
      <br/>
      <form onSubmit={handleCheckCode}>
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
        <button className="btn">Verify Account</button>
        <br/>
      </form>
      <button className="btn" onClick={handleCodeResend}>Resend Email</button>
      <br/>
      <button className="btn" onClick={handleEmailChangeRedirect}>Change Email</button>

      {error && <Alert msg={error} />}
      </div>
    </section>
  );
};

export default Verify;
