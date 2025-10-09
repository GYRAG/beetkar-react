# Beetkar Sensor API - Backend Documentation

This is a Cloudflare Worker API that stores and retrieves sensor data from ESP32 devices with DHT11 sensors.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (free tier works)
- Wrangler CLI

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install Wrangler CLI (if not already installed)

```bash
npm install -g wrangler
```

### 3. Login to Cloudflare

```bash
wrangler login
```

### 4. Create D1 Database

```bash
wrangler d1 create beetkar-sensors
```

This will output a database ID. Copy this ID and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "beetkar-sensors"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your actual database ID
```

### 5. Initialize Database Schema

```bash
wrangler d1 execute beetkar-sensors --file=schema.sql
```

### 6. Test Locally

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### 7. Deploy to Cloudflare

```bash
npm run deploy
```

After deployment, you'll receive a URL like: `https://beetkar-sensor-api.your-subdomain.workers.dev`

## API Endpoints

### Health Check
- **GET** `/health` or `/`
- Returns API status

### Post Sensor Data
- **POST** `/api/sensor-data`
- Body: `{ "temperature": number, "humidity": number }`
- Temperature range: -40 to 80°C
- Humidity range: 0 to 100%

Example:
```bash
curl -X POST https://your-worker.workers.dev/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.5, "humidity": 65.3}'
```

### Get Latest Reading
- **GET** `/api/sensor-data/latest`
- Returns the most recent sensor reading

Example:
```bash
curl https://your-worker.workers.dev/api/sensor-data/latest
```

### Get Historical Data
- **GET** `/api/sensor-data/history?range=7d|30d|90d`
- Returns historical sensor readings
- Aggregates data by hour for 30d and 90d ranges

Example:
```bash
curl https://your-worker.workers.dev/api/sensor-data/history?range=7d
```

## Database Schema

```sql
CREATE TABLE sensor_readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  temperature REAL NOT NULL,
  humidity REAL NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Data Retention

- Automatically deletes readings older than 90 days
- Cleanup runs periodically (10% chance on each POST)

## CORS Configuration

CORS is enabled for all origins (`*`). For production, consider restricting to your domain:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  // ...
};
```

## Monitoring

View logs and metrics in the Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Click on "Logs" or "Metrics"

## Troubleshooting

### Database Connection Issues
```bash
# List your databases
wrangler d1 list

# Execute test query
wrangler d1 execute beetkar-sensors --command="SELECT COUNT(*) FROM sensor_readings"
```

### View Recent Logs
```bash
wrangler tail
```

### Test Endpoints Locally
```bash
# In one terminal
npm run dev

# In another terminal
curl http://localhost:8787/health
```

## Cost Estimate

Cloudflare Workers free tier includes:
- 100,000 requests per day
- Unlimited D1 database reads
- 5 million D1 database writes per day

This is more than enough for a single ESP32 posting data every 5 seconds.

## Security Notes

1. Add authentication if exposing publicly
2. Rate limiting is recommended for production
3. Consider IP whitelisting for ESP32 devices
4. Use environment variables for sensitive data

## Next Steps

1. Update frontend `.env` with your worker URL
2. Configure ESP32 with your worker URL
3. Monitor API usage in Cloudflare Dashboard

