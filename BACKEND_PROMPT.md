# Backend Implementation Prompt for Mushroom Farming Optimization API

Build a RESTful API backend for a mushroom farming optimization application using **SQLite** for local storage. The backend should be production-ready, efficient, and focused on data integrity and AI-powered insights.

## Technology Stack Requirements

- **Database**: SQLite (local file-based storage)
- **Language**: Python (preferred) or Node.js
- **Framework**: FastAPI (Python) or Express.js (Node.js)
- **Database ORM**: SQLAlchemy (Python) or better-sqlite3/sequelize (Node.js)

## Database Schema

### Table: `batches`
```sql
CREATE TABLE batches (
    batch_id INTEGER PRIMARY KEY AUTOINCREMENT,
    substrate_type TEXT NOT NULL,
    substrate_moisture_percent REAL NOT NULL,
    spawn_rate_percent REAL NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `daily_observations`
```sql
CREATE TABLE daily_observations (
    observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id INTEGER NOT NULL,
    date DATE NOT NULL,
    ambient_temperature_celsius REAL,
    relative_humidity_percent REAL,
    CO2_level TEXT CHECK(CO2_level IN ('low', 'medium', 'high')),
    light_hours_per_day REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
    UNIQUE(batch_id, date)
);
```

### Table: `harvests`
```sql
CREATE TABLE harvests (
    harvest_id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id INTEGER NOT NULL,
    flush_number INTEGER NOT NULL,
    flush_yield_kg REAL NOT NULL,
    total_batch_yield_kg REAL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
    UNIQUE(batch_id, flush_number)
);
```

## API Endpoints

### Batch Endpoints

#### `GET /api/batches`
Returns all batches ordered by most recent first.

**Response:**
```json
[
  {
    "batch_id": 1,
    "substrate_type": "Straw",
    "substrate_moisture_percent": 60.0,
    "spawn_rate_percent": 5.0,
    "start_date": "2024-01-15",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

#### `GET /api/batches/:batchId`
Returns a single batch with all related observations and harvests.

**Response:**
```json
{
  "batch_id": 1,
  "substrate_type": "Straw",
  "substrate_moisture_percent": 60.0,
  "spawn_rate_percent": 5.0,
  "start_date": "2024-01-15",
  "observations": [...],
  "harvests": [...]
}
```

#### `POST /api/batches`
Creates a new batch.

**Request Body:**
```json
{
  "substrate_type": "Straw",
  "substrate_moisture_percent": 60.0,
  "spawn_rate_percent": 5.0,
  "start_date": "2024-01-15"
}
```

**Response:** Created batch object (same structure as GET response)

### Daily Observation Endpoints

#### `GET /api/batches/:batchId/observations`
Returns all observations for a batch, ordered by date (newest first).

**Response:**
```json
[
  {
    "observation_id": 1,
    "batch_id": 1,
    "date": "2024-01-16",
    "ambient_temperature_celsius": 22.5,
    "relative_humidity_percent": 85.0,
    "CO2_level": "medium",
    "light_hours_per_day": 12.0,
    "created_at": "2024-01-16T08:00:00Z"
  }
]
```

#### `POST /api/batches/:batchId/observations`
Creates a new daily observation. If an observation for the same date already exists, update it instead.

**Request Body:**
```json
{
  "date": "2024-01-16",
  "ambient_temperature_celsius": 22.5,
  "relative_humidity_percent": 85.0,
  "CO2_level": "medium",
  "light_hours_per_day": 12.0
}
```

**Response:** Created/updated observation object

### Harvest Endpoints

#### `GET /api/batches/:batchId/harvests`
Returns all harvests for a batch, ordered by flush_number.

**Response:**
```json
[
  {
    "harvest_id": 1,
    "batch_id": 1,
    "flush_number": 1,
    "flush_yield_kg": 2.5,
    "total_batch_yield_kg": 2.5,
    "date": "2024-01-20",
    "created_at": "2024-01-20T10:00:00Z"
  }
]
```

#### `POST /api/batches/:batchId/harvests`
Creates a new harvest record. If a harvest with the same flush_number exists, update it.

**Request Body:**
```json
{
  "flush_number": 1,
  "flush_yield_kg": 2.5,
  "total_batch_yield_kg": 2.5
}
```

**Response:** Created/updated harvest object

### AI Insights Endpoint

#### `GET /api/batches/:batchId/insights`
Generates AI-powered insights for a batch based on patterns, anomalies, and trends.

**Response:**
```json
{
  "warnings": [
    "Early yield underperformance detected: First flush yield (2.5 kg) is 30% below historical average for similar batches.",
    "Temperature variance detected: Daily temperature fluctuations exceed 5°C, which may stress mycelium growth."
  ],
  "anomalies": [
    "Humidity dropped to 65% on 2024-01-18, significantly below optimal range (80-90%).",
    "CO2 levels remained 'high' for 5 consecutive days, which may indicate insufficient ventilation."
  ],
  "suggestions": [
    "Consider increasing humidity to 85-90% based on successful batches with similar substrate types.",
    "Average temperature of 22.5°C is optimal. Maintain this range for consistent yields.",
    "Light exposure of 12 hours/day aligns with best-performing batches. Continue this pattern."
  ],
  "trends": [
    "Humidity trend: Increasing from 75% to 85% over the past week, approaching optimal range.",
    "Yield trend: First flush shows promise. Historical data suggests second flush may yield 1.8-2.2 kg if conditions remain stable."
  ],
  "summary": "Batch #1 shows promising early indicators with optimal temperature control. Main concern is humidity stability - maintain 85-90% range. CO2 levels need monitoring to prevent stagnation. Projected total yield: 6-8 kg based on current trajectory."
}
```

**AI Insights Logic Requirements:**

1. **Pattern Detection:**
   - Compare current batch metrics against historical averages (if available)
   - Identify deviations from optimal ranges:
     - Temperature: 20-24°C optimal
     - Humidity: 80-90% optimal
     - CO2: Low to medium preferred
     - Light: 10-14 hours/day typical

2. **Anomaly Detection:**
   - Flag sudden changes in environmental conditions (>10% humidity change, >3°C temperature change)
   - Detect prolonged periods of suboptimal conditions
   - Identify missing data patterns

3. **Yield Analysis:**
   - Compare flush yields against historical averages
   - Detect early underperformance (first flush <70% of average)
   - Project future yields based on current trajectory

4. **Optimization Suggestions:**
   - Recommend adjustments based on successful historical batches
   - Suggest environmental corrections for detected anomalies
   - Provide actionable insights, not just observations

5. **Trend Analysis:**
   - Identify improving or declining trends
   - Project future outcomes based on current patterns
   - Highlight positive developments

### Batch Comparison Endpoint

#### `POST /api/batches/compare`
Compares multiple batches and provides comparative insights.

**Request Body:**
```json
{
  "batch_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "yield_comparison": [
    {
      "batch_id": 1,
      "total_yield": 7.5,
      "flushes": 3
    },
    {
      "batch_id": 2,
      "total_yield": 6.2,
      "flushes": 2
    }
  ],
  "average_conditions": [
    {
      "batch_id": 1,
      "avg_temperature": 22.3,
      "avg_humidity": 85.2,
      "substrate_type": "Straw"
    },
    {
      "batch_id": 2,
      "avg_temperature": 21.8,
      "avg_humidity": 82.5,
      "substrate_type": "Sawdust"
    }
  ],
  "insights": [
    "Batch #1 (Straw substrate) outperformed Batch #2 (Sawdust) by 21% in total yield.",
    "Higher average humidity (85.2% vs 82.5%) correlates with better yields in this comparison.",
    "Temperature variance was lower in Batch #1, suggesting more stable conditions."
  ]
}
```

## Implementation Requirements

### Database Setup
1. Initialize SQLite database file (e.g., `mushroom_farming.db`)
2. Create all tables with proper foreign key constraints
3. Implement database migrations if needed
4. Add indexes on frequently queried columns:
   - `batches.start_date`
   - `daily_observations.batch_id, date`
   - `harvests.batch_id`

### Error Handling
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Provide clear error messages in JSON format:
  ```json
  {
    "error": "Error message here"
  }
  ```
- Validate all input data (required fields, data types, ranges)
- Handle database errors gracefully

### Data Validation
- Validate date formats (YYYY-MM-DD)
- Ensure numeric values are within reasonable ranges
- Validate CO2_level enum values
- Check foreign key relationships exist before creating related records

### CORS Configuration
- Enable CORS for frontend origin (configure appropriately)
- Allow necessary HTTP methods (GET, POST, PUT, DELETE)

### Performance Considerations
- Use database indexes appropriately
- Implement efficient queries (avoid N+1 problems)
- Consider pagination for large datasets (if needed in future)

### Code Organization
- Separate routes/controllers from business logic
- Create a dedicated module for AI insights generation
- Use environment variables for configuration
- Follow clean code principles

## AI Insights Implementation Details

The AI insights should be **statistical and pattern-based**, not requiring external AI APIs. Focus on:

1. **Statistical Analysis:**
   - Calculate averages, medians, standard deviations
   - Compare against historical data (all batches)
   - Identify outliers using statistical methods

2. **Rule-Based Pattern Detection:**
   - Define optimal ranges based on mushroom farming best practices
   - Detect sequences (e.g., 3+ days of high CO2)
   - Identify correlations (e.g., humidity vs yield)

3. **Natural Language Generation:**
   - Convert statistical findings into readable insights
   - Use templates with dynamic data insertion
   - Prioritize actionable insights over observations

4. **Historical Context:**
   - Compare current batch to similar historical batches (same substrate type, similar conditions)
   - Learn from successful batches
   - Identify what worked and what didn't

## Example Project Structure (Python/FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   │   ├── batches.py
│   │   ├── observations.py
│   │   ├── harvests.py
│   │   └── insights.py
│   └── services/
│       └── ai_insights.py
├── requirements.txt
├── .env
└── README.md
```

## Example Project Structure (Node.js/Express)

```
backend/
├── src/
│   ├── index.js
│   ├── database.js
│   ├── models/
│   │   ├── Batch.js
│   │   ├── Observation.js
│   │   └── Harvest.js
│   ├── routes/
│   │   ├── batches.js
│   │   ├── observations.js
│   │   ├── harvests.js
│   │   └── insights.js
│   └── services/
│       └── aiInsights.js
├── package.json
├── .env
└── README.md
```

## Testing Recommendations

- Test all CRUD operations
- Test data validation
- Test AI insights generation with various data scenarios
- Test edge cases (empty data, missing fields, invalid values)
- Test foreign key constraints

## Additional Notes

- The database file should be created in the project root or a `data/` directory
- Consider adding a `.gitignore` entry for the database file if it contains test data
- Document API endpoints (Swagger/OpenAPI recommended for FastAPI)
- Add logging for debugging and monitoring
- Consider adding database backup functionality for production use

## Environment Variables

Create a `.env` file with:
```
DATABASE_PATH=./mushroom_farming.db
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

---

**Priority**: Focus on data integrity, efficient queries, and meaningful AI insights. The backend should feel like a tool built by someone who understands both data systems and mushroom farming operations.

