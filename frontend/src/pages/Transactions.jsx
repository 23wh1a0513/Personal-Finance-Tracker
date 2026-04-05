import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Transactions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const categories = {
    income: ['salary', 'business', 'others'],
    expense: ['food', 'transport', 'shopping', 'rent', 'bills', 'entertainment', 'health', 'education', 'others']
  };

  const [formData, setFormData] = useState({
    description: '',
    type: 'expense',
    category: categories.expense[0],
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    recurring: false,
    recurrenceEndDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchTransactions();
    }
  }, [user, loading, navigate]);

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

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value,
        category: categories[value] ? categories[value][0] : prev.category
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.type || !formData.category || !formData.amount || !formData.transactionDate) {
      setError('Please fill in all required fields');
      return;
    }

    // If 'Others' category is selected, require a description to explain the expense
    if (formData.category === 'others' && !formData.description.trim()) {
      setError('Please enter a description for the "Others" category');
      return;
    }

    // Validate amount
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      // Ensure date is in YYYY-MM-DD string format
      const ensureDateFormat = (dateStr) => {
        if (!dateStr) return null;
        // If it's YYYY-MM-DD, return as-is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
        // If it's DD-MM-YYYY, convert to YYYY-MM-DD
        if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        }
        // Try to parse as date and format
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split('T')[0];
        }
        return dateStr;
      };

      const payload = {
        description: formData.description || '',
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        transactionDate: ensureDateFormat(formData.transactionDate),
        recurring: formData.recurring,
        recurrenceEndDate: (formData.recurring && formData.recurrenceEndDate) ? ensureDateFormat(formData.recurrenceEndDate) : null
      };

      console.log('Sending payload:', payload);

      if (editingTransaction) {
        await axios.put(`/api/finances/${editingTransaction._id}`, payload);
        setSuccess('Transaction updated successfully');
      } else {
        await axios.post('/api/finances', payload);
        setSuccess('Transaction added successfully');
      }

      fetchTransactions();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description || '',
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      transactionDate: new Date(transaction.transactionDate).toISOString().split('T')[0],
      recurring: transaction.recurring || false,
      recurrenceEndDate: transaction.recurrenceEndDate ? new Date(transaction.recurrenceEndDate).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await axios.delete(`/api/finances/${id}`);
      setSuccess('Transaction deleted successfully');
      fetchTransactions();
    } catch (error) {
      setError('Failed to delete transaction');
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      type: 'expense',
      category: categories.expense[0],
      amount: '',
      transactionDate: new Date().toISOString().split('T')[0],
      recurring: false,
      recurrenceEndDate: ''
    });
    setEditingTransaction(null);
    setShowForm(false);
    setError('');
  };

  if (loading || loadingData) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '1rem', border: '1px solid green', borderRadius: '4px' }}>{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f9ff' }}>
          <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', backgroundColor: '#fff', border: '1px solid #bbb', borderRadius: '4px' }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', backgroundColor: '#fff', border: '1px solid #bbb', borderRadius: '4px' }}
              >
                {categories[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', backgroundColor: '#fff', border: '1px solid #bbb', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Date:</label>
              <input
                type="date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', backgroundColor: '#fff', border: '1px solid #bbb', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                name="recurring"
                checked={formData.recurring}
                onChange={handleInputChange}
                id="recurring-checkbox"
              />
              <label htmlFor="recurring-checkbox" style={{ margin: 0 }}>
                Recurring monthly
              </label>
            </div>
            {formData.recurring && (
              <div>
                <label>Until (optional):</label>
                <input
                  type="date"
                  name="recurrenceEndDate"
                  value={formData.recurrenceEndDate}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', backgroundColor: '#fff', border: '1px solid #bbb', borderRadius: '4px' }}
                />
              </div>
            )}
            <div style={{ gridColumn: '1 / -1' }}>
              <label>
                Notes/Description:
                {formData.category === 'others' ? (
                  <span style={{ fontSize: '0.85rem', color: '#555', marginLeft: '0.5rem' }}>(required for Others)</span>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#555', marginLeft: '0.5rem' }}>(optional)</span>
                )}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', backgroundColor: '#fff', border: '1px solid #bbb', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem', fontSize: '1rem' }}
            >
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h2>All Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions found. Add your first transaction above.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Recurring</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
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
                  <td style={{ padding: '0.5rem' }}>
                    {transaction.recurring ? 'Yes' : 'No'}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(transaction)}
                      style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;