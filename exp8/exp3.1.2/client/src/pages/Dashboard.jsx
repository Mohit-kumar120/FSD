import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:3001/api/protected", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(res.data.message);
      } catch (err) {
        setError(err.response?.data?.error || "Access denied");
      }
    };

    fetchProtectedData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="dashboard-box">
        <h2>Dashboard</h2>
        {data && <p className="success">{data}</p>}
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;