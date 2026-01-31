import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { api } from '../services/api';

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await api.getBatches();
      setBatches(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading batches...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="batch-list">
      <div className="header">
        <h1>Batches</h1>
        <div className="header-actions">
          <Link to="/compare" className="btn btn-secondary">
            Compare Batches
          </Link>
          <Link to="/batches/new" className="btn btn-primary">
            New Batch
          </Link>
        </div>
      </div>

      {batches.length === 0 ? (
        <div className="empty-state">
          <p>No batches yet. Create your first batch to get started.</p>
        </div>
      ) : (
        <div className="batch-grid">
          {batches.map((batch) => (
            <Link
              key={batch.batch_id}
              to={`/batches/${batch.batch_id}`}
              className="batch-card"
            >
              <div className="batch-card-header">
                <h3>
                  {batch.username ? `${batch.username} - Batch #${batch.batch_id}` : `Batch #${batch.batch_id}`}
                </h3>
                <span className="batch-status">Active</span>
              </div>
              <div className="batch-card-body">
                {batch.username && (
                  <div className="batch-info">
                    <span className="label">User:</span>
                    <span className="value">{batch.username}</span>
                  </div>
                )}
                <div className="batch-info">
                  <span className="label">Substrate:</span>
                  <span className="value">{batch.substrate_type}</span>
                </div>
                <div className="batch-info">
                  <span className="label">Started:</span>
                  <span className="value">
                    {format(new Date(batch.start_date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="batch-info">
                  <span className="label">Moisture:</span>
                  <span className="value">{batch.substrate_moisture_percent}%</span>
                </div>
                <div className="batch-info">
                  <span className="label">Spawn Rate:</span>
                  <span className="value">{batch.spawn_rate_percent}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

