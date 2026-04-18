import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="dashboard-box">
        <h2>User Dashboard</h2>
        <p>Welcome, {username}</p>
        <p>Role: {role}</p>

        <div className="menu-box">
          <p>User Profile</p>
          <p>View Tasks</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default UserDashboard;