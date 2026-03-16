import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  const fetchDashboardData = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const [summaryResponse, transactionsResponse] = await Promise.all([
        axios.get(`/api/finances/summary/monthly?month=${month}&year=${year}`),
        axios.get('/api/finances')
      ]);

      setSummary(summaryResponse.data);
      setRecentTransactions(transactionsResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Income</h3>
          <p style={{ fontSize: '2rem', color: 'green' }}>₹{summary?.totalIncome || 0}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Expenses</h3>
          <p style={{ fontSize: '2rem', color: 'red' }}>₹{summary?.totalExpense || 0}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Net Savings</h3>
          <p style={{ fontSize: '2rem', color: summary?.netSavings >= 0 ? 'green' : 'red' }}>
            ₹{summary?.netSavings || 0}
          </p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Transactions</h3>
          <p style={{ fontSize: '2rem' }}>{summary?.transactions || 0}</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <p>No transactions yet. <a href="/transactions">Add your first transaction</a></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{transaction.title}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{transaction.type}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{transaction.category}</td>
                  <td style={{ padding: '0.5rem', color: transaction.type === 'income' ? 'green' : 'red' }}>
                    ₹{transaction.amount}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/transactions')}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          View All Transactions
        </button>
        <button
          onClick={() => navigate('/budgets')}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Manage Budgets
        </button>
      </div>
    </div>
  );
};

export default Dashboard;