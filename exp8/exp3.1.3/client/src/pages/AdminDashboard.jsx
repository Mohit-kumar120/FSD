import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [adminData, setAdminData] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:3001/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAdminData(res.data.message);
      } catch (err) {
        setError(err.response?.data?.error || "Access denied");
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="dashboard-box">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {username}</p>
        <p>Role: {role}</p>

        {adminData && <p className="success">{adminData}</p>}
        {error && <p className="error">{error}</p>}

        <div className="menu-box">
          <p>Manage Users</p>
          <p>View Reports</p>
          <p>System Settings</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default AdminDashboard;