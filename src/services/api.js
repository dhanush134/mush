const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  // Batch endpoints
  async getBatches() {
    const res = await fetch(`${API_BASE_URL}/batches`);
    if (!res.ok) throw new Error('Failed to fetch batches');
    return res.json();
  },

  async getBatch(batchId) {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}`);
    if (!res.ok) throw new Error('Failed to fetch batch');
    return res.json();
  },

  async createBatch(batchData) {
    const res = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchData),
    });
    if (!res.ok) throw new Error('Failed to create batch');
    return res.json();
  },

  // Daily Observation endpoints
  async getObservations(batchId) {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}/observations`);
    if (!res.ok) throw new Error('Failed to fetch observations');
    return res.json();
  },

  async createObservation(batchId, observationData) {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}/observations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(observationData),
    });
    if (!res.ok) throw new Error('Failed to create observation');
    return res.json();
  },

  // Harvest endpoints
  async getHarvests(batchId) {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}/harvests`);
    if (!res.ok) throw new Error('Failed to fetch harvests');
    return res.json();
  },

  async createHarvest(batchId, harvestData) {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}/harvests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(harvestData),
    });
    if (!res.ok) throw new Error('Failed to create harvest');
    return res.json();
  },

  // AI Insights endpoint
  async getInsights(batchId) {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}/insights`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  // Batch comparison
  async getBatchComparison(batchIds) {
    const res = await fetch(`${API_BASE_URL}/batches/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch_ids: batchIds }),
    });
    if (!res.ok) throw new Error('Failed to compare batches');
    return res.json();
  },
};

