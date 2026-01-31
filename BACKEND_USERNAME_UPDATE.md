# Backend Update: Add Username Field to Batches

## Overview
Add a `username` field to the batches table to track which user owns each batch. This allows multi-user support and better batch identification.

## Database Schema Update

### Migration: Add username column to batches table

**Option 1: If using migrations, create a new migration file**

**Option 2: If modifying schema directly, update the CREATE TABLE statement:**

```sql
CREATE TABLE batches (
    batch_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    substrate_type TEXT NOT NULL,
    substrate_moisture_percent REAL NOT NULL,
    spawn_rate_percent REAL NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**For existing databases, run this ALTER TABLE:**

```sql
ALTER TABLE batches ADD COLUMN username TEXT;

-- If you want to make it required for new batches, you can set a default for existing rows
UPDATE batches SET username = 'unknown' WHERE username IS NULL;

-- Then make it NOT NULL (SQLite doesn't support adding NOT NULL directly, so you may need to recreate the table)
-- OR keep it nullable and handle in application logic
```

**Note:** SQLite has limitations with ALTER TABLE. If you need to make username NOT NULL:
1. Create a new table with the schema
2. Copy data from old table (set username to a default value for existing rows)
3. Drop old table
4. Rename new table

## API Changes

### Updated Request/Response Formats

#### `POST /api/batches` - Updated Request Body

**Request Body:**
```json
{
  "username": "john_doe",
  "substrate_type": "Straw",
  "substrate_moisture_percent": 60.0,
  "spawn_rate_percent": 5.0,
  "start_date": "2024-01-15"
}
```

**Validation:**
- `username` should be required (or optional, depending on your requirements)
- Validate username format (alphanumeric, underscores, hyphens allowed)
- Suggested length: 3-50 characters

#### `GET /api/batches` - Updated Response

**Response:**
```json
[
  {
    "batch_id": 1,
    "username": "john_doe",
    "substrate_type": "Straw",
    "substrate_moisture_percent": 60.0,
    "spawn_rate_percent": 5.0,
    "start_date": "2024-01-15",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

#### `GET /api/batches/:batchId` - Updated Response

**Response:**
```json
{
  "batch_id": 1,
  "username": "john_doe",
  "substrate_type": "Straw",
  "substrate_moisture_percent": 60.0,
  "spawn_rate_percent": 5.0,
  "start_date": "2024-01-15",
  "observations": [...],
  "harvests": [...]
}
```

## Implementation Details

### Model/Schema Updates

**Python/SQLAlchemy Example:**
```python
class Batch(Base):
    __tablename__ = "batches"
    
    batch_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False)  # or nullable=True if optional
    substrate_type = Column(String(100), nullable=False)
    substrate_moisture_percent = Column(Float, nullable=False)
    spawn_rate_percent = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**Node.js/Sequelize Example:**
```javascript
const Batch = sequelize.define('Batch', {
  batch_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false  // or true if optional
  },
  substrate_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  substrate_moisture_percent: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  spawn_rate_percent: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
```

### Validation Rules

Add validation for the username field:

**Python/Pydantic Example:**
```python
from pydantic import BaseModel, validator
import re

class BatchCreate(BaseModel):
    username: str
    substrate_type: str
    substrate_moisture_percent: float
    spawn_rate_percent: float
    start_date: str
    
    @validator('username')
    def validate_username(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Username cannot be empty')
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Username must be between 3 and 50 characters')
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.strip()
```

**Node.js/Express Example:**
```javascript
const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    throw new Error('Username cannot be empty');
  }
  if (username.length < 3 || username.length > 50) {
    throw new Error('Username must be between 3 and 50 characters');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
  }
  return username.trim();
};
```

### Route Handler Updates

**Python/FastAPI Example:**
```python
@router.post("/batches", response_model=BatchResponse)
async def create_batch(batch: BatchCreate):
    # Validation is handled by Pydantic
    db_batch = Batch(**batch.dict())
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch
```

**Node.js/Express Example:**
```javascript
router.post('/batches', async (req, res) => {
  try {
    const { username, substrate_type, substrate_moisture_percent, spawn_rate_percent, start_date } = req.body;
    
    // Validate username
    const validatedUsername = validateUsername(username);
    
    // Create batch
    const batch = await Batch.create({
      username: validatedUsername,
      substrate_type,
      substrate_moisture_percent,
      spawn_rate_percent,
      start_date
    });
    
    res.status(201).json(batch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Optional: Filtering by Username

Consider adding an optional query parameter to filter batches by username:

### `GET /api/batches?username=john_doe`

**Implementation Example (Python/FastAPI):**
```python
@router.get("/batches")
async def get_batches(username: Optional[str] = None):
    query = db.query(Batch)
    if username:
        query = query.filter(Batch.username == username)
    batches = query.order_by(Batch.created_at.desc()).all()
    return batches
```

**Implementation Example (Node.js/Express):**
```javascript
router.get('/batches', async (req, res) => {
  try {
    const { username } = req.query;
    const where = username ? { username } : {};
    const batches = await Batch.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Database Migration Script (SQLite)

If you need to migrate existing data, here's a complete migration script:

```python
# migration_add_username.py
import sqlite3

def migrate_add_username(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(batches)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'username' not in columns:
            # Add username column (nullable for existing rows)
            cursor.execute("ALTER TABLE batches ADD COLUMN username TEXT")
            
            # Set default username for existing batches
            cursor.execute("UPDATE batches SET username = 'unknown' WHERE username IS NULL")
            
            conn.commit()
            print("Migration completed: username column added")
        else:
            print("Username column already exists")
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_username("./mushroom_farming.db")
```

## Testing Checklist

- [ ] Create batch with username - should succeed
- [ ] Create batch without username - should fail (if required) or succeed with default
- [ ] Get batches - should include username in response
- [ ] Get single batch - should include username
- [ ] Filter batches by username (if implemented)
- [ ] Validate username format (invalid characters should be rejected)
- [ ] Validate username length (too short/long should be rejected)
- [ ] Update existing batches (if update endpoint exists)

## Backward Compatibility

**If username is optional:**
- Existing batches will have `username: null` or `username: "unknown"`
- Frontend should handle null/undefined usernames gracefully
- Consider a migration to set default usernames for existing data

**If username is required:**
- All new batches must include username
- Existing batches need to be updated with a default username
- Consider a one-time migration script

## Summary

1. **Add `username` column to batches table** (TEXT, nullable or NOT NULL)
2. **Update batch creation endpoint** to accept and validate username
3. **Update all batch response formats** to include username
4. **Add validation** for username format and length
5. **Optional:** Add filtering by username query parameter
6. **Test thoroughly** with existing and new data

The frontend is already updated to send and display the username field, so once the backend is updated, everything should work seamlessly.

