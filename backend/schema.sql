-- Create sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  temperature REAL NOT NULL,
  humidity REAL NOT NULL,
  gas_resistance REAL NOT NULL,
  pressure REAL NOT NULL,
  vibration_rms REAL NOT NULL,
  audio_dbfs REAL NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index on timestamp for efficient queries
CREATE INDEX IF NOT EXISTS idx_timestamp ON sensor_readings(timestamp DESC);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_old_records ON sensor_readings(timestamp ASC);

