import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function BatchForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    substrate_type: '',
    substrate_moisture_percent: 60,
    spawn_rate_percent: 5,
    start_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('percent') ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createBatch(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Create New Batch</h1>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="e.g., john_doe, farmer_alice"
          />
        </div>

        <div className="form-group">
          <label htmlFor="substrate_type">Substrate Type</label>
          <input
            type="text"
            id="substrate_type"
            name="substrate_type"
            value={formData.substrate_type}
            onChange={handleChange}
            required
            placeholder="e.g., Straw, Sawdust, Compost"
          />
        </div>

        <div className="form-group">
          <label htmlFor="substrate_moisture_percent">
            Substrate Moisture (%)
          </label>
          <input
            type="number"
            id="substrate_moisture_percent"
            name="substrate_moisture_percent"
            value={formData.substrate_moisture_percent}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="spawn_rate_percent">Spawn Rate (%)</label>
          <input
            type="number"
            id="spawn_rate_percent"
            name="spawn_rate_percent"
            value={formData.spawn_rate_percent}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </div>
      </form>
    </div>
  );
}

