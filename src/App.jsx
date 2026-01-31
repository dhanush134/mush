import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BatchList from './components/BatchList';
import BatchForm from './components/BatchForm';
import BatchDetail from './components/BatchDetail';
import BatchComparison from './components/BatchComparison';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<BatchList />} />
          <Route path="/batches/new" element={<BatchForm />} />
          <Route path="/batches/:batchId" element={<BatchDetail />} />
          <Route path="/compare" element={<BatchComparison />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
