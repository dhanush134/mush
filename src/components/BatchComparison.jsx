import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function BatchComparison() {
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const data = await api.getBatches();
      setBatches(data);
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const handleBatchToggle = (batchId) => {
    setSelectedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleCompare = async () => {
    if (selectedBatches.length < 2) {
      alert('Please select at least 2 batches to compare');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getBatchComparison(selectedBatches);
      setComparisonData(data);
    } catch (err) {
      console.error('Failed to compare batches:', err);
      alert('Failed to compare batches');
    } finally {
      setLoading(false);
    }
  };

  const yieldComparisonData = comparisonData?.yield_comparison || [];
  const avgConditionsData = comparisonData?.average_conditions || [];

  return (
    <div className="batch-comparison">
      <div className="header">
        <h1>Batch Comparison</h1>
        <Link to="/" className="btn btn-secondary">
          Back to Batches
        </Link>
      </div>

      <div className="comparison-setup">
        <h2>Select Batches to Compare</h2>
        <div className="batch-selection">
          {batches.map((batch) => (
            <label key={batch.batch_id} className="batch-checkbox">
              <input
                type="checkbox"
                checked={selectedBatches.includes(batch.batch_id)}
                onChange={() => handleBatchToggle(batch.batch_id)}
              />
              <span>
                {batch.username ? `${batch.username} - ` : ''}Batch #{batch.batch_id} - {batch.substrate_type}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={handleCompare}
          className="btn btn-primary"
          disabled={selectedBatches.length < 2 || loading}
        >
          {loading ? 'Comparing...' : 'Compare Batches'}
        </button>
      </div>

      {comparisonData && (
        <div className="comparison-results">
          {yieldComparisonData.length > 0 && (
            <div className="chart-section">
              <h3>Yield Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yieldComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch_id" />
                  <YAxis label={{ value: 'Total Yield (kg)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="total_yield" fill="#4a90e2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {avgConditionsData.length > 0 && (
            <div className="chart-section">
              <h3>Average Conditions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgConditionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg_temperature" fill="#ff7300" name="Avg Temp (°C)" />
                  <Bar dataKey="avg_humidity" fill="#8884d8" name="Avg Humidity (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {comparisonData.insights && comparisonData.insights.length > 0 && (
            <div className="comparison-insights">
              <h3>Comparison Insights</h3>
              <ul>
                {comparisonData.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

