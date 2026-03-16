import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reports = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    transactionCount: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchTransactions();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/finances');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.transactionDate) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.transactionDate) <= new Date(filters.endDate));
    }

    setFilteredTransactions(filtered);

    // Calculate summary
    const summary = filtered.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
        acc.transactionCount += 1;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, netSavings: 0, transactionCount: 0 }
    );
    summary.netSavings = summary.totalIncome - summary.totalExpense;
    setSummary(summary);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const categories = ['food', 'transport', 'shopping', 'rent', 'bills', 'entertainment', 'health', 'education', 'salary', 'business', 'others'];

  if (loading || loadingData) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Financial Reports</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
            <h3>Total Income</h3>
            <p style={{ fontSize: '1.5rem', color: 'green' }}>₹{summary.totalIncome}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#ffe8e8', borderRadius: '4px' }}>
            <h3>Total Expenses</h3>
            <p style={{ fontSize: '1.5rem', color: 'red' }}>₹{summary.totalExpense}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: summary.netSavings >= 0 ? '#e8f5e8' : '#ffe8e8', borderRadius: '4px' }}>
            <h3>Net Savings</h3>
            <p style={{ fontSize: '1.5rem', color: summary.netSavings >= 0 ? 'green' : 'red' }}>
              ₹{summary.netSavings}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
            <h3>Transactions</h3>
            <p style={{ fontSize: '1.5rem' }}>{summary.transactionCount}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Filters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label>Type:</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label>Category:</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
          <div>
            <button
              onClick={resetFilters}
              style={{ width: '100%', padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2>Transaction Details ({filteredTransactions.length} transactions)</h2>
        {filteredTransactions.length === 0 ? (
          <p>No transactions match the current filters.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.5rem' }}>{transaction.title}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{transaction.type}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{transaction.category}</td>
                  <td style={{ padding: '0.5rem', color: transaction.type === 'income' ? 'green' : 'red' }}>
                    ₹{transaction.amount}
                  </td>
                  <td style={{ padding: '0.5rem' }}>{transaction.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;