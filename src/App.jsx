
import React, { useEffect, useState } from 'react'

export default function App() {
  const [batches, setBatches] = useState([])

  useEffect(() => {
    fetch('https://mushbackend-production.up.railway.app/batches')
      .then(res => res.json())
      .then(setBatches)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Mushroom Farming Dashboard</h2>
      {batches.map(b => (
        <div key={b.batch_id}>
          Batch #{b.batch_id} – {b.substrate_type}
        </div>
      ))}
    </div>
  )
}
