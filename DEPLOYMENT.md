# ESP32 Sensor Integration - Deployment Guide

Complete guide for deploying the Beetkar ESP32 sensor integration system.

## Architecture Overview

```
┌─────────────┐
│   ESP32     │
│   + DHT11   │
│             │
└──────┬──────┘
       │ POST /api/sensor-data
       │ (every 5 seconds)
       ↓
┌─────────────────────────────┐
│  Cloudflare Worker (API)    │
│  - Validates sensor data    │
│  - Stores in D1 database    │
│  - Serves historical data   │
└──────────┬──────────────────┘
           │
           │ GET /api/sensor-data/latest
           │ GET /api/sensor-data/history
           ↓
┌─────────────────────────────┐
│   React Frontend            │
│   - Polls API every 5s      │
│   - Updates cards & charts  │
│   - Real-time dashboard     │
└─────────────────────────────┘
```

## Quick Start

### 1. Backend Deployment (10 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create beetkar-sensors

# Copy the database ID and update wrangler.toml
# Then initialize the schema
wrangler d1 execute beetkar-sensors --file=schema.sql

# Deploy to Cloudflare
npm run deploy
```

**Save your Worker URL**: `https://beetkar-sensor-api.your-subdomain.workers.dev`

### 2. Frontend Setup (5 minutes)

```bash
# Return to project root
cd ..

# Create .env file
echo "VITE_API_URL=https://beetkar-sensor-api.your-subdomain.workers.dev" > .env

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

### 3. ESP32 Configuration (15 minutes)

1. Wire DHT11 to ESP32 (see `backend/esp32-example/README.md`)
2. Open `backend/esp32-example/sensor-upload.ino` in Arduino IDE
3. Update:
   - WiFi credentials
   - Cloudflare Worker URL
4. Upload to ESP32
5. Monitor Serial output to verify connection

## Detailed Deployment Steps

### Backend (Cloudflare Workers + D1)

#### Prerequisites
- Cloudflare account (free tier works)
- Node.js v18+
- Wrangler CLI

#### Step-by-Step

1. **Create Cloudflare Account**
   - Sign up at https://dash.cloudflare.com/sign-up
   - Free tier includes 100,000 requests/day

2. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Create D1 Database**
   ```bash
   cd backend
   wrangler d1 create beetkar-sensors
   ```

4. **Update Configuration**
   
   Edit `backend/wrangler.toml` and replace `database_id`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "beetkar-sensors"
   database_id = "YOUR_DATABASE_ID_FROM_STEP_3"
   ```

5. **Initialize Database**
   ```bash
   wrangler d1 execute beetkar-sensors --file=schema.sql
   ```

6. **Test Locally**
   ```bash
   npm run dev
   # API available at http://localhost:8787
   ```

7. **Deploy to Production**
   ```bash
   npm run deploy
   ```

8. **Test Deployed API**
   ```bash
   # Health check
   curl https://your-worker.workers.dev/health

   # Post test data
   curl -X POST https://your-worker.workers.dev/api/sensor-data \
     -H "Content-Type: application/json" \
     -d '{"temperature": 25.5, "humidity": 60.0}'

   # Get latest reading
   curl https://your-worker.workers.dev/api/sensor-data/latest
   ```

### Frontend (React + Vite)

#### Prerequisites
- Node.js v18+
- npm or yarn

#### Step-by-Step

1. **Configure Environment**
   
   Create `.env` in project root:
   ```
   VITE_API_URL=https://your-worker.workers.dev
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

5. **Deploy Frontend** (Choose one)

   **Option A: Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

   **Option B: Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

   **Option C: Cloudflare Pages**
   ```bash
   wrangler pages deploy dist
   ```

### ESP32 Hardware Setup

#### Hardware Checklist
- [ ] ESP32 development board
- [ ] DHT11 sensor
- [ ] 3 jumper wires
- [ ] USB cable
- [ ] 10kΩ resistor (if DHT11 doesn't have built-in pull-up)

#### Wiring

```
DHT11 → ESP32
━━━━━━━━━━━━━━
VCC   → 3.3V
DATA  → GPIO 4
GND   → GND
```

#### Software Setup

1. **Install Arduino IDE**
   - Download from https://www.arduino.cc/en/software

2. **Add ESP32 Board Support**
   - File → Preferences → Additional Board Manager URLs:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
   - Tools → Board → Boards Manager → Install "esp32"

3. **Install Libraries**
   - Sketch → Include Library → Manage Libraries
   - Install: "DHT sensor library" by Adafruit
   - Install: "Adafruit Unified Sensor"

4. **Configure Code**
   
   Edit `backend/esp32-example/sensor-upload.ino`:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverUrl = "https://your-worker.workers.dev/api/sensor-data";
   ```

5. **Upload**
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → Select your ESP32 port
   - Click Upload button

6. **Monitor**
   - Tools → Serial Monitor
   - Set baud rate to 115200
   - Verify sensor readings and uploads

## Environment Variables

### Frontend (.env)
```bash
# Required
VITE_API_URL=https://your-worker.workers.dev

# Optional - for development
VITE_API_URL=http://localhost:8787
```

### Backend (wrangler.toml)
```toml
# Database configuration
[[d1_databases]]
binding = "DB"
database_name = "beetkar-sensors"
database_id = "your-database-id"

# Environment-specific settings
[env.development]
vars = { ENVIRONMENT = "development" }

[env.production]
vars = { ENVIRONMENT = "production" }
```

## Testing the Complete System

### 1. Test Backend API

```bash
# Health check
curl https://your-worker.workers.dev/health

# Manual data post
curl -X POST https://your-worker.workers.dev/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.5, "humidity": 65.0}'

# Get latest
curl https://your-worker.workers.dev/api/sensor-data/latest

# Get history
curl https://your-worker.workers.dev/api/sensor-data/history?range=7d
```

### 2. Test ESP32 Connection

1. Power on ESP32
2. Open Serial Monitor (115200 baud)
3. Verify:
   - WiFi connection successful
   - Sensor readings appear
   - HTTP 201 response from server

### 3. Test Frontend

1. Open dashboard in browser
2. Verify:
   - Temperature and humidity cards update every 5 seconds
   - Charts display historical data
   - No error messages
   - Loading states work correctly

## Monitoring & Debugging

### Cloudflare Worker Logs

```bash
# Real-time logs
wrangler tail

# Or view in dashboard
# https://dash.cloudflare.com → Workers → Your Worker → Logs
```

### Database Queries

```bash
# Count records
wrangler d1 execute beetkar-sensors \
  --command="SELECT COUNT(*) FROM sensor_readings"

# View recent readings
wrangler d1 execute beetkar-sensors \
  --command="SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 10"

# Check oldest record
wrangler d1 execute beetkar-sensors \
  --command="SELECT MIN(timestamp) FROM sensor_readings"
```

### Frontend Debugging

1. Open browser DevTools (F12)
2. Check Console for errors
3. Network tab: Monitor API calls
4. React DevTools: Inspect component state

### ESP32 Debugging

```cpp
// Add debug prints in Arduino code
Serial.print("Temperature: ");
Serial.println(temperature);
Serial.print("HTTP Response Code: ");
Serial.println(httpResponseCode);
```

## Performance Optimization

### Backend
- D1 automatically caches frequently accessed data
- Indexes on timestamp column speed up queries
- Automatic cleanup prevents database bloat

### Frontend
- Polling pauses when tab is hidden
- useMemo for chart data transformation
- Debounced updates prevent excessive renders

### ESP32
- 5-second interval balances freshness and battery life
- Adjust `uploadInterval` for different requirements
- Consider deep sleep for battery-powered deployments

## Security Considerations

### Production Checklist

- [ ] Add API authentication (API keys or JWT)
- [ ] Rate limiting on worker endpoints
- [ ] CORS restricted to your domain
- [ ] Environment variables not committed to git
- [ ] HTTPS enforced (Cloudflare does this by default)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries)

### Recommended Additions

```typescript
// Example: Simple API key authentication
if (request.headers.get('X-API-Key') !== env.API_KEY) {
  return new Response('Unauthorized', { status: 401 });
}
```

## Cost Estimation

### Free Tier Limits
- **Cloudflare Workers**: 100,000 requests/day
- **D1 Database**: 5 million writes/day, unlimited reads
- **Frontend Hosting**: Varies by provider

### Expected Usage
- ESP32 uploads: 17,280 requests/day (every 5 seconds)
- Frontend polling: ~17,280 requests/day per user
- Well within free tier for personal use

## Troubleshooting

### Issue: Frontend shows "API connection error"

**Solutions:**
1. Check `.env` file has correct `VITE_API_URL`
2. Verify worker is deployed: `wrangler deployments list`
3. Test worker directly with curl
4. Check browser console for CORS errors

### Issue: ESP32 can't connect to WiFi

**Solutions:**
1. Verify WiFi credentials are correct
2. Ensure using 2.4GHz WiFi (not 5GHz)
3. Check WiFi signal strength
4. Try mobile hotspot for testing

### Issue: Database empty after deployment

**Solutions:**
1. Verify schema was applied: `wrangler d1 execute beetkar-sensors --file=schema.sql`
2. Check worker logs for errors
3. Test POST endpoint manually
4. Ensure database binding is correct in wrangler.toml

### Issue: Charts show no data

**Solutions:**
1. Verify API returns historical data
2. Check browser console for errors
3. Ensure at least one reading exists in database
4. Try different time range (7d, 30d, 90d)

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **ESP32 Docs**: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/
- **React Docs**: https://react.dev/
- **DHT11 Datasheet**: Available in `backend/esp32-example/README.md`

## Next Steps

1. ✅ Deploy backend to Cloudflare
2. ✅ Configure frontend environment
3. ✅ Upload code to ESP32
4. ✅ Verify end-to-end data flow
5. 🚀 Add more sensors (optional)
6. 🚀 Implement alerts/notifications (optional)
7. 🚀 Create mobile app (optional)

