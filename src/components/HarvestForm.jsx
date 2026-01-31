import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function HarvestForm({ batchId, onSuccess }) {
  const [formData, setFormData] = useState({
    flush_number: 1,
    flush_yield_kg: '',
    total_batch_yield_kg: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [harvests, setHarvests] = useState([]);

  useEffect(() => {
    loadHarvests();
  }, [batchId]);

  const loadHarvests = async () => {
    try {
      const data = await api.getHarvests(batchId);
      setHarvests(data);
      if (data.length > 0) {
        const nextFlush = Math.max(...data.map(h => h.flush_number)) + 1;
        setFormData(prev => ({ ...prev, flush_number: nextFlush }));
      }
    } catch (err) {
      console.error('Failed to load harvests:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'flush_number' 
        ? parseInt(value) || 1
        : (value === '' ? '' : parseFloat(value) || ''),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createHarvest(batchId, formData);
      setFormData(prev => ({
        ...prev,
        flush_yield_kg: '',
        total_batch_yield_kg: '',
      }));
      await loadHarvests();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="harvest-form-container">
      <h3>Record Harvest</h3>
      
      {harvests.length > 0 && (
        <div className="harvest-history">
          <h4>Previous Harvests</h4>
          <ul>
            {harvests.map((h) => (
              <li key={h.flush_number}>
                Flush #{h.flush_number}: {h.flush_yield_kg} kg
                {h.total_batch_yield_kg && ` (Total: ${h.total_batch_yield_kg} kg)`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="flush_number">Flush Number</label>
          <input
            type="number"
            id="flush_number"
            name="flush_number"
            value={formData.flush_number}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="flush_yield_kg">Flush Yield (kg)</label>
          <input
            type="number"
            id="flush_yield_kg"
            name="flush_yield_kg"
            value={formData.flush_yield_kg}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="e.g., 2.5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="total_batch_yield_kg">Total Batch Yield (kg)</label>
          <input
            type="number"
            id="total_batch_yield_kg"
            name="total_batch_yield_kg"
            value={formData.total_batch_yield_kg}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="e.g., 5.2"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Record Harvest'}
        </button>
      </form>
    </div>
  );
}

