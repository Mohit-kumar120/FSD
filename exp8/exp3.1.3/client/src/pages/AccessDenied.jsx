import { Link } from "react-router-dom";

function AccessDenied() {
  return (
    <div className="container">
      <div className="dashboard-box">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
        <div className="menu-box">
          <Link to="/admin">Admin Dashboard</Link>
          <Link to="/user">User Profile</Link>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;