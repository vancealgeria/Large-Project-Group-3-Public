import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { UserContext } from "../../contexts/UserContext";
import { deletePost, getUserPosts } from "../../controllers/activitiesController";
import Post from "../../Components/Post";
import Alert from "../../Components/Alert";
import Success from "../../Components/Success";

const History = () => {
  const [workMinutes, setWorkMinutes] = useState([]);
  const [leisureMinutes, setLeisureMinutes] = useState([]);
  const [sleepMinutes, setSleepMinutes] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);
  const [activities, setActivities] = useState([]);

  const userID = localStorage.getItem("UserID");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userID) return;

    const retrieveHistory = async (userID) => {
      try {
        const response = await fetch("https://cop4331group3.xyz/api/activities/retrievehistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserID: userID }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const activitiesData = data.activities || [];

        setActivities(activitiesData);
        setWorkMinutes(activitiesData.map(activity => activity.recordedDailyWorkMinutes));
        setLeisureMinutes(activitiesData.map(activity => activity.recordedDailyLeisureMinutes));
        setSleepMinutes(activitiesData.map(activity => activity.recordedDailySleepMinutes));
        setTimestamps(activitiesData.map(activity => activity.recordTimestamp));
        setTotalPoints(activitiesData.map(activity => activity.totalDailyPts));
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    retrieveHistory(userID);
  }, [userID]);

  const chartData = activities.map((activity, index) => ({
    day: `Day ${index + 1}`,
    date: new Date(activity.recordTimestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    work: activity.recordedDailyWorkMinutes.toFixed(2) || 0,
    leisure: activity.recordedDailyLeisureMinutes.toFixed(2) || 0,
    sleep: activity.recordedDailySleepMinutes.toFixed(2) || 0,
    points: activity.totalDailyPts.toFixed(2) || 0
  }));

  const handleEdit = (activityId) => {
    localStorage.setItem("ActivityID", activityId);
    navigate("/edithistoricalrecord");
  };

  // 🌟 Custom legend with correct order & centered
  const renderCustomLegend = () => {
    return (
      <ul
        style={{
          display: 'flex',
          justifyContent: 'center',
          listStyle: 'none',
          padding: 0,
          margin: '10px 0',
        }}
      >
        {[
          { value: 'Work Minutes', color: '#3b82f6', dataKey: 'work' },
          { value: 'Leisure Minutes', color: '#8b5cf6', dataKey: 'leisure' },
          { value: 'Sleep Minutes', color: '#10b981', dataKey: 'sleep' },
          { value: 'Total Points', color: '#f59e0b', dataKey: 'points' },
        ].map((entry) => (
          <li
            key={entry.dataKey}
            style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                marginRight: 8,
                borderRadius: 2,
              }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div style={{ width: '100%', height: '400px' }}>
        <div className="flex flex-col items-center justify-center">
        <p style={{ fontSize: '50px' }}><b>ACTIVITY HISTORY</b></p>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={[...chartData].reverse()}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'work' || name === 'leisure' || name === 'sleep') {
                  return [`${value} minutes`, name.charAt(0).toUpperCase() + name.slice(1)];
                }
                return [value, name.charAt(0).toUpperCase() + name.slice(1)];
              }}
              itemSorter={(item) => {
                const order = { work: 1, leisure: 2, sleep: 3, points: 4 };
                return order[item.dataKey] || 0;
              }}
            />
            <Legend content={renderCustomLegend} />
            <Line type="monotone" dataKey="work" stroke="#3b82f6" name="Work Minutes" strokeWidth={2} />
            <Line type="monotone" dataKey="leisure" stroke="#8b5cf6" name="Leisure Minutes" strokeWidth={2} />
            <Line type="monotone" dataKey="sleep" stroke="#10b981" name="Sleep Minutes" strokeWidth={2} />
            <Line type="monotone" dataKey="points" stroke="#f59e0b" name="Total Points" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <br/>
      <br/>

      <div className="flex flex-col items-center justify-center mt-10">
        <p style={{ fontSize: '30px' }}><b>WEEK ACTIVITY LOG</b></p>
        <table className="table-auto border border-collapse w-full max-w-5xl">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Work Minutes</th>
              <th className="border px-4 py-2">Leisure Minutes</th>
              <th className="border px-4 py-2">Sleep Minutes</th>
              <th className="border px-4 py-2">Total Points</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity._id} className="text-center">
                  <td className="border px-4 py-2">{activity.recordTimestamp}</td>
                  <td className="border px-4 py-2">{activity.recordedDailyWorkMinutes.toFixed(2)}</td>
                  <td className="border px-4 py-2">{activity.recordedDailyLeisureMinutes.toFixed(2)}</td>
                  <td className="border px-4 py-2">{activity.recordedDailySleepMinutes.toFixed(2)}</td>
                  <td className="border px-4 py-2">{activity.totalDailyPts.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleEdit(activity._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border px-4 py-2 text-center">
                  No history data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default History;
