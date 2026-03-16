import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
            Personal Finance Tracker
          </Link>
          <div>
            <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>Login</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          Personal Finance Tracker
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
          <Link to="/transactions" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>Transactions</Link>
          <Link to="/budgets" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>Budgets</Link>
          <Link to="/reports" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>Reports</Link>
          <span style={{ marginRight: '1rem' }}>Welcome, {user.name}</span>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;