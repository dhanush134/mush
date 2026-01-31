import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AIInsights({ batchId, batch, observations, harvests }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (batchId && (observations.length > 0 || harvests.length > 0)) {
      loadInsights();
    }
  }, [batchId, observations.length, harvests.length]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getInsights(batchId);
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (observations.length === 0 && harvests.length === 0) {
    return (
      <div className="insights-empty">
        <p>Start logging observations and harvests to generate AI insights.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Analyzing data and generating insights...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Failed to load insights: {error}</p>
        <button onClick={loadInsights} className="btn btn-secondary">
          Retry
        </button>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <h2>AI Insights</h2>
        <button onClick={loadInsights} className="btn btn-secondary btn-sm">
          Refresh
        </button>
      </div>

      {insights.warnings && insights.warnings.length > 0 && (
        <div className="insight-section insight-warnings">
          <h3>⚠️ Warnings</h3>
          <ul>
            {insights.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.anomalies && insights.anomalies.length > 0 && (
        <div className="insight-section insight-anomalies">
          <h3>🔍 Anomalies Detected</h3>
          <ul>
            {insights.anomalies.map((anomaly, idx) => (
              <li key={idx}>{anomaly}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.suggestions && insights.suggestions.length > 0 && (
        <div className="insight-section insight-suggestions">
          <h3>💡 Optimization Suggestions</h3>
          <ul>
            {insights.suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.trends && insights.trends.length > 0 && (
        <div className="insight-section insight-trends">
          <h3>📈 Trends</h3>
          <ul>
            {insights.trends.map((trend, idx) => (
              <li key={idx}>{trend}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.summary && (
        <div className="insight-section insight-summary">
          <h3>Summary</h3>
          <p>{insights.summary}</p>
        </div>
      )}

      {(!insights.warnings || insights.warnings.length === 0) &&
        (!insights.anomalies || insights.anomalies.length === 0) &&
        (!insights.suggestions || insights.suggestions.length === 0) &&
        (!insights.trends || insights.trends.length === 0) &&
        !insights.summary && (
          <div className="insights-empty">
            <p>No insights available yet. Continue logging data to generate insights.</p>
          </div>
        )}
    </div>
  );
}

