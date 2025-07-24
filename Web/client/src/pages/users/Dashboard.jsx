import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";
import { deletePost, getUserPosts } from "../../controllers/activitiesController";
import Post from "../../Components/Post";
import Alert from "../../Components/Alert";
import Success from "../../Components/Success";

const Dashboard = () => {
  const [fields, setFields] = useState(null);
  
  // Use user context
  const { user, setUser } = useContext(UserContext);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState(null);

  // Success state
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setTimeout(async () => {
      try {
        // Grab user's posts
        const { userPosts, email } = await getUserPosts();
        // Update user state
        // setUser({ email, posts: userPosts }); // Uncomment when working on dashboard as this isn't correct.
        // Remove the loading
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        
        setLoading(false);
      }
    }, 500);
  }, []);

  // Handle delete post
  
  const namef = localStorage.getItem("firstName");
  const namex = localStorage.getItem("UserID");

  useEffect(() => {
    // Only proceed if we have a userID
    if (!namex) {
      console.warn("No UserID found in localStorage");
      return;
    }

    const retrieveTodayEditFields = (userID) => {
      return fetch("https://cop4331group3.xyz/api/activities/retrievehomepagedata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userID }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .catch((err) => {
          console.error("Error fetching today edit fields:", err);
          throw err;
        });
    };

    retrieveTodayEditFields(namex)
      .then((data) => setFields(data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load today's fields");
      });
  }, [namex]); // Include namex as dependency

  // Show loading state
  if (loading) {
    return (
      <section className="card">
        <div className="flex flex-col items-center justify-center">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <p>{user?.email}</p>
      <div className="flex flex-col items-center justify-center">
        <p style={{ fontSize: "50px" }}>
          <b>HOME</b>
        </p>

        <br />
        <p style={{ fontSize: "24px" }}>Welcome, {namef}</p>

        <p style={{ fontSize: "24px" }}>
          You have {fields?.recordedDailyWorkMinutes.toFixed(2) || 0} minutes in work today
        </p>

        <p style={{ fontSize: "24px" }}>
          You have {fields?.recordedDailyLeisureMinutes.toFixed(2) || 0} minutes in leisure today
        </p>

        <p style={{ fontSize: "24px" }}>
          You have {fields?.recordedDailySleepMinutes.toFixed(2) || 0} minutes in sleep today
        </p>

        <p style={{ fontSize: "24px" }}>
          You have {fields?.totalDailyPts.toFixed(2) || 0} total points today so far
        </p>

        {success && <Success msg={success} />}
        {error && <Alert msg={error} />}

        <Link to="/edittodaysstuff">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4">
            Edit Today's Stuff
          </button>
        </Link>

        {/* Render posts only if user and posts exist */}
        
      </div>
    </section>
  );
};

export default Dashboard;
