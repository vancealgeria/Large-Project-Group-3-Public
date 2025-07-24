import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Components/Alert";

const EditHistoricalRecord = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [workMinutes, setWorkMinutes] = useState("");
  const [leisureMinutes, setLeisureMinutes] = useState("");
  const [sleepMinutes, setSleepMinutes] = useState("");

  const [activityID, setActivityID] = useState(null);

  useEffect(() => {
    const storedID = localStorage.getItem("ActivityID");

    if (!storedID) {
      setError("No activity selected for editing.");
      return;
    }

    setActivityID(storedID);

    const fetchHistoricalData = async () => {
      try {
        const res = await fetch("https://cop4331group3.xyz/api/activities/retrievetoedithistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ActivityID: storedID }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        setWorkMinutes(data.recordedDailyWorkMinutes?.toString() ?? "");
        setLeisureMinutes(data.recordedDailyLeisureMinutes?.toString() ?? "");
        setSleepMinutes(data.recordedDailySleepMinutes?.toString() ?? "");
      } catch (err) {
        console.error("Failed to load activity data:", err);
        setError("Failed to load activity data.");
      }
    };

    fetchHistoricalData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://cop4331group3.xyz/api/activities/edithistoricalcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ActivityID: activityID,
          updatedWorkMinutes: workMinutes,
          updatedLeisureMinutes: leisureMinutes,
          updatedSleepMinutes: sleepMinutes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess("Successfully updated historical record!");
      localStorage.removeItem("ActivityID");
      setTimeout(() => navigate("/history"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
        <p style={{ fontSize: "40px" }}>
          <b>Edit Historical Record</b>
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-4 flex flex-col items-center">
          <div className="mb-2">Work Minutes</div>
          <input
            type="number"
            value={workMinutes}
            onChange={(e) => setWorkMinutes(e.target.value)}
            className="input text-center"
          />

          <div className="mb-2 mt-4">Leisure Minutes</div>
          <input
            type="number"
            value={leisureMinutes}
            onChange={(e) => setLeisureMinutes(e.target.value)}
            className="input text-center"
          />

          <div className="mb-2 mt-4">Sleep Minutes</div>
          <input
            type="number"
            value={sleepMinutes}
            onChange={(e) => setSleepMinutes(e.target.value)}
            className="input text-center"
          />

          <br />
          <button className="btn mt-4 self-center">Submit</button>
        </form>

        {error && <Alert msg={error} />}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </section>
  );
};

export default EditHistoricalRecord;
