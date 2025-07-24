import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";
import { deletePost, getUserPosts } from "../../controllers/activitiesController";
import Post from "../../Components/Post";
import Alert from "../../Components/Alert";
import Success from "../../Components/Success";

export default function Sleep() {
  const namex = localStorage.getItem("UserID");
  const [timer, setTimer] = useState(0);
  const [timeInterval, setTimeInterval] = useState(null);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Start the timer
  const startTimer = () => {
    setTimeInterval(setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000));
  };

  // Pause the timer
  const pauseTimer = () => {
    clearInterval(timeInterval);
  };

  // Reset the timer
  const resetTimer = () => {
    setTimer(0);
    clearInterval(timeInterval);
  };

  // Submit timer to API
  const endTimer = async (userID, timerTime, timerType) => {
    try {
      const res = await fetch("https://cop4331group3.xyz/api/activities/timerupdateforday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userID,
          timerTime: timerTime,
          timerType: timerType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unknown error occurred");
      }

      setSuccess("Time submitted!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
        <p style={{ fontSize: '50px' }}><b>SLEEP</b></p>

        <h3>Timer: {timer}</h3>

        <div className="flex flex-wrap gap-4 mt-4">
          <button onClick={startTimer} className="btn w-[100px]">Start</button>
          <button onClick={pauseTimer} className="btn w-[100px]">Pause</button>
          <button onClick={resetTimer} className="btn w-[100px]">Reset</button>
          <button
            onClick={() => endTimer(namex, timer / 60, "Sleep")}
            className="btn w-[100px]"
          >
            Submit
          </button>
        </div>

        {success && (
          <div className="mt-4 text-green-600 font-semibold">
             {success}
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 font-semibold">
             {error}
          </div>
        )}
      </div>
    </section>
  );
}
