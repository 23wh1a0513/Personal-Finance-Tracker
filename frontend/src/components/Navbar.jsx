import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const brand = (
    <Link to="/" className="brand">
      Personal Finance Tracker
    </Link>
  );

  if (!user) {
    return (
      <nav className="navbar">
        {brand}
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      {brand}
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budgets">Budgets</Link>
        <Link to="/reports">Reports</Link>
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Hi, {user.name}</span>
        <button className="navbar-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;