import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function BatchCharts({ observations, harvests }) {
  const humidityYieldData = useMemo(() => {
    if (!observations.length || !harvests.length) return [];

    const data = observations
      .filter(obs => obs.relative_humidity_percent != null)
      .map(obs => {
        const harvest = harvests.find(h => {
          const obsDate = new Date(obs.date);
          const harvestDate = new Date(h.date || obs.date);
          return Math.abs(obsDate - harvestDate) < 7 * 24 * 60 * 60 * 1000;
        });

        return {
          date: format(new Date(obs.date), 'MMM d'),
          humidity: obs.relative_humidity_percent,
          yield: harvest ? harvest.flush_yield_kg : null,
        };
      })
      .filter(d => d.yield != null);

    return data;
  }, [observations, harvests]);

  const temperatureYieldData = useMemo(() => {
    if (!observations.length || !harvests.length) return [];

    const data = observations
      .filter(obs => obs.ambient_temperature_celsius != null)
      .map(obs => {
        const harvest = harvests.find(h => {
          const obsDate = new Date(obs.date);
          const harvestDate = new Date(h.date || obs.date);
          return Math.abs(obsDate - harvestDate) < 7 * 24 * 60 * 60 * 1000;
        });

        return {
          date: format(new Date(obs.date), 'MMM d'),
          temperature: obs.ambient_temperature_celsius,
          yield: harvest ? harvest.flush_yield_kg : null,
        };
      })
      .filter(d => d.yield != null);

    return data;
  }, [observations, harvests]);

  const yieldPerFlushData = useMemo(() => {
    return harvests
      .sort((a, b) => a.flush_number - b.flush_number)
      .map(h => ({
        flush: `Flush ${h.flush_number}`,
        yield: h.flush_yield_kg,
      }));
  }, [harvests]);

  if (!observations.length && !harvests.length) {
    return (
      <div className="empty-charts">
        <p>No data available for charts. Start logging observations and harvests.</p>
      </div>
    );
  }

  return (
    <div className="charts-container">
      {yieldPerFlushData.length > 0 && (
        <div className="chart-section">
          <h3>Yield per Flush</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldPerFlushData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="flush" />
              <YAxis label={{ value: 'Yield (kg)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="yield" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {humidityYieldData.length > 0 && (
        <div className="chart-section">
          <h3>Humidity vs Yield</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={humidityYieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Yield (kg)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                stroke="#8884d8"
                name="Humidity (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yield"
                stroke="#82ca9d"
                name="Yield (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {temperatureYieldData.length > 0 && (
        <div className="chart-section">
          <h3>Temperature vs Yield</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureYieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Yield (kg)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="#ff7300"
                name="Temperature (°C)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yield"
                stroke="#82ca9d"
                name="Yield (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {humidityYieldData.length === 0 && temperatureYieldData.length === 0 && yieldPerFlushData.length === 0 && (
        <div className="empty-charts">
          <p>Insufficient data for correlation charts. Log more observations and harvests.</p>
        </div>
      )}
    </div>
  );
}

