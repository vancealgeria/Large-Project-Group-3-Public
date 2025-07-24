import { useEffect, useState } from "react";
import { displayLeaderboard } from "../../controllers/activitiesController";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await displayLeaderboard();
        setUsers(response.users || []);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
        <p style={{ fontSize: "50px" }}>
          <b>LEADERBOARD</b>
        </p>

        <table className="table-auto border border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Weekly Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border px-4 py-2">{user.firstName}</td>
                <td className="border px-4 py-2">{user.lastName}</td>
                <td className="border px-4 py-2">{user.weeklyPts.toFixed(2)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  No leaderboard data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Leaderboard;
