import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { api } from '../services/api';
import DailyObservationForm from './DailyObservationForm';
import HarvestForm from './HarvestForm';
import BatchCharts from './BatchCharts';
import AIInsights from './AIInsights';

export default function BatchDetail() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [observations, setObservations] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBatchData();
  }, [batchId]);

  const loadBatchData = async () => {
    try {
      setLoading(true);
      const [batchData, obsData, harvestData] = await Promise.all([
        api.getBatch(batchId),
        api.getObservations(batchId),
        api.getHarvests(batchId),
      ]);
      setBatch(batchData);
      setObservations(obsData);
      setHarvests(harvestData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleObservationAdded = () => {
    loadBatchData();
  };

  const handleHarvestAdded = () => {
    loadBatchData();
  };

  if (loading) return <div className="loading">Loading batch...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!batch) return <div className="error">Batch not found</div>;

  return (
    <div className="batch-detail">
      <div className="batch-detail-header">
        <Link to="/" className="btn btn-secondary">
          ← Back to Batches
        </Link>
        <h1>
          {batch.username ? `${batch.username} - Batch #${batch.batch_id}` : `Batch #${batch.batch_id}`}
        </h1>
      </div>

      <div className="batch-info-card">
        <div className="info-grid">
          {batch.username && (
            <div>
              <span className="label">Username</span>
              <span className="value">{batch.username}</span>
            </div>
          )}
          <div>
            <span className="label">Substrate Type</span>
            <span className="value">{batch.substrate_type}</span>
          </div>
          <div>
            <span className="label">Start Date</span>
            <span className="value">
              {format(new Date(batch.start_date), 'MMM d, yyyy')}
            </span>
          </div>
          <div>
            <span className="label">Moisture</span>
            <span className="value">{batch.substrate_moisture_percent}%</span>
          </div>
          <div>
            <span className="label">Spawn Rate</span>
            <span className="value">{batch.spawn_rate_percent}%</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'log' ? 'active' : ''}
          onClick={() => setActiveTab('log')}
        >
          Log Data
        </button>
        <button
          className={activeTab === 'charts' ? 'active' : ''}
          onClick={() => setActiveTab('charts')}
        >
          Charts
        </button>
        <button
          className={activeTab === 'insights' ? 'active' : ''}
          onClick={() => setActiveTab('insights')}
        >
          AI Insights
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="section">
              <h2>All Observations</h2>
              {observations.length === 0 ? (
                <p className="empty">No observations yet. Log your first observation.</p>
              ) : (
                <div className="observations-list-scrollable">
                  {observations.slice().reverse().map((obs) => (
                    <div key={obs.observation_id} className="observation-item">
                      <div className="obs-date">
                        {format(new Date(obs.date), 'MMM d, yyyy')}
                      </div>
                      <div className="obs-data">
                        {obs.ambient_temperature_celsius && (
                          <span>Temp: {obs.ambient_temperature_celsius}°C</span>
                        )}
                        {obs.relative_humidity_percent && (
                          <span>Humidity: {obs.relative_humidity_percent}%</span>
                        )}
                        {obs.CO2_level && <span>CO2: {obs.CO2_level}</span>}
                        {obs.light_hours_per_day && (
                          <span>Light: {obs.light_hours_per_day}h</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="section">
              <h2>Harvests</h2>
              {harvests.length === 0 ? (
                <p className="empty">No harvests recorded yet.</p>
              ) : (
                <div className="harvests-list">
                  {harvests.map((h) => (
                    <div key={h.harvest_id} className="harvest-item">
                      <span className="flush-number">Flush #{h.flush_number}</span>
                      <span className="yield">{h.flush_yield_kg} kg</span>
                      {h.total_batch_yield_kg && (
                        <span className="total">Total: {h.total_batch_yield_kg} kg</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div className="log-tab">
            <div className="log-section">
              <h2>Daily Observation</h2>
              <DailyObservationForm
                batchId={batchId}
                onSuccess={handleObservationAdded}
              />
            </div>

            <div className="log-section">
              <HarvestForm batchId={batchId} onSuccess={handleHarvestAdded} />
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-tab">
            <BatchCharts observations={observations} harvests={harvests} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <AIInsights batchId={batchId} batch={batch} observations={observations} harvests={harvests} />
          </div>
        )}
      </div>
    </div>
  );
}

