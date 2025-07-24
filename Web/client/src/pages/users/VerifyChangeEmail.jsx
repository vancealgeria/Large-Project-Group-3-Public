import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { verifyGetEmail, verifyUpdateEmail, sendEmail } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import Alert from "../../Components/Alert";

const VerifyChangeEmail = () => {
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

  const { UserID } = user;

  let data = null;

  useEffect(() => {
    // Define async function inside useEffect
    const fetchData = async () => {
      try {
        data = await verifyGetEmail(UserID);
        
        setFormData({ email: data.email });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData(); // Call the async function
  }, []);

  

  // Handle check code
  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    try {
      
      await verifyUpdateEmail(UserID, formData.email);

      await sendEmail(UserID);
      
      navigate('/verify')
    } catch (error) {
      setError(error.message);
    }
  };



  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
        <p style={{ fontSize: '50px' }}><b>UPDATE EMAIL BELOW</b></p>
        <br/>
        <form onSubmit={handleUpdateEmail}>
          <div>Email</div>
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            autoFocus
          />
          <br />
          <button className="btn">Update Email</button>
        </form>
  
        {error && <Alert msg={error} />}
      </div>
    </section>
  );

};

export default VerifyChangeEmail;
