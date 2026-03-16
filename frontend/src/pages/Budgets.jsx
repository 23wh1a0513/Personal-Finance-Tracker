import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Budgets = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudget: '',
    categories: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchBudgets();
    }
  }, [user, loading, navigate]);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setFormData({
      ...formData,
      categories: updatedCategories
    });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { category: 'food', amount: '' }]
    });
  };

  const removeCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      categories: updatedCategories
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingBudget) {
        await axios.put(`/api/budgets/${editingBudget._id}`, formData);
        setSuccess('Budget updated successfully');
      } else {
        await axios.post('/api/budgets', formData);
        setSuccess('Budget created successfully');
      }

      fetchBudgets();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      month: budget.month,
      year: budget.year,
      totalBudget: budget.totalBudget,
      categories: budget.categories || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await axios.delete(`/api/budgets/${id}`);
      setSuccess('Budget deleted successfully');
      fetchBudgets();
    } catch (error) {
      setError('Failed to delete budget');
    }
  };

  const resetForm = () => {
    setFormData({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalBudget: '',
      categories: []
    });
    setEditingBudget(null);
    setShowForm(false);
    setError('');
  };

  const categories = ['food', 'transport', 'shopping', 'rent', 'bills', 'entertainment', 'health', 'education', 'others'];

  if (loading || loadingData) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Create Budget'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '1rem', border: '1px solid green', borderRadius: '4px' }}>{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Month:</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Year:</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="2020"
                max="2030"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
            <div>
              <label>Total Budget:</label>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3>Category Budgets</h3>
            {formData.categories.map((cat, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <select
                  value={cat.category}
                  onChange={(e) => handleCategoryChange(index, 'category', e.target.value)}
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  {categories.map(catOption => (
                    <option key={catOption} value={catOption}>
                      {catOption.charAt(0).toUpperCase() + catOption.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={cat.amount}
                  onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                  min="0"
                  step="0.01"
                  style={{ flex: 1, padding: '0.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  style={{ padding: '0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCategory}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add Category
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' }}
            >
              {editingBudget ? 'Update' : 'Create'} Budget
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h2>Your Budgets</h2>
        {budgets.length === 0 ? (
          <p>No budgets found. Create your first budget above.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {budgets.map((budget) => (
              <div key={budget._id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>{new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <p><strong>Total Budget:</strong> ₹{budget.totalBudget}</p>
                {budget.categories && budget.categories.length > 0 && (
                  <div>
                    <h4>Category Breakdown:</h4>
                    <ul>
                      {budget.categories.map((cat, index) => (
                        <li key={index}>
                          {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}: ₹{cat.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => handleEdit(budget)}
                    style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;