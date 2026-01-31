import React, { useState } from 'react';
import { format } from 'date-fns';
import { api } from '../services/api';

export default function DailyObservationForm({ batchId, onSuccess }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ambient_temperature_celsius: '',
    relative_humidity_percent: '',
    CO2_level: 'medium',
    light_hours_per_day: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('temperature') || name.includes('humidity') || name.includes('light')
        ? (value === '' ? '' : parseFloat(value) || '')
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createObservation(batchId, formData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        ambient_temperature_celsius: '',
        relative_humidity_percent: '',
        CO2_level: 'medium',
        light_hours_per_day: '',
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="observation-form">
      {error && <div className="error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ambient_temperature_celsius">Temperature (°C)</label>
          <input
            type="number"
            id="ambient_temperature_celsius"
            name="ambient_temperature_celsius"
            value={formData.ambient_temperature_celsius}
            onChange={handleChange}
            step="0.1"
            placeholder="e.g., 22.5"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="relative_humidity_percent">Humidity (%)</label>
          <input
            type="number"
            id="relative_humidity_percent"
            name="relative_humidity_percent"
            value={formData.relative_humidity_percent}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.1"
            placeholder="e.g., 85"
          />
        </div>

        <div className="form-group">
          <label htmlFor="CO2_level">CO2 Level</label>
          <select
            id="CO2_level"
            name="CO2_level"
            value={formData.CO2_level}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="light_hours_per_day">Light Hours/Day</label>
          <input
            type="number"
            id="light_hours_per_day"
            name="light_hours_per_day"
            value={formData.light_hours_per_day}
            onChange={handleChange}
            min="0"
            max="24"
            step="0.5"
            placeholder="e.g., 12"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Log Observation'}
      </button>
    </form>
  );
}

