# Quick Start Guide - 5 Minutes to Live Dashboard

Get your ESP32 sensor dashboard running in 5 minutes! ⚡

## What You'll Get

- Real-time temperature & humidity monitoring
- Beautiful charts and cards
- Data updates every 5 seconds
- Historical data visualization

## Prerequisites

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ Cloudflare account (sign up at https://dash.cloudflare.com - it's free!)
- ✅ ESP32 + DHT11 sensor (optional for now - you can test with mock data first)

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Install Wrangler globally (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create beetkar-sensors
```

**Important:** Copy the `database_id` from the output and paste it into `backend/wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "beetkar-sensors"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

```bash
# Initialize database
wrangler d1 execute beetkar-sensors --file=schema.sql

# Deploy to Cloudflare
npm run deploy
```

**Save your Worker URL** - you'll see something like:
```
Published beetkar-sensor-api
  https://beetkar-sensor-api.your-subdomain.workers.dev
```

## Step 2: Frontend Setup (1 minute)

```bash
# Go back to project root
cd ..

# Install dependencies
npm install

# Create .env file with your Worker URL
echo "VITE_API_URL=https://beetkar-sensor-api.testarosa.workers.dev/" > .env

# Start the app!
npm run dev
```

Open http://localhost:5173/dashboard in your browser! 🎉

## Step 3: Test with Mock Data (30 seconds)

The dashboard is running, but it needs data! Let's add some test data:

```bash
# In a new terminal, post some test data
curl -X POST https://beetkar-sensor-api.your-subdomain.workers.dev/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.5, "humidity": 65.0}'

curl -X POST https://beetkar-sensor-api.your-subdomain.workers.dev/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 25.0, "humidity": 64.5}'

curl -X POST https://beetkar-sensor-api.your-subdomain.workers.dev/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.8, "humidity": 65.2}'
```

**Refresh your dashboard** - you should see the data appear! 🎊

## Step 4: ESP32 Setup (Optional - 5 minutes)

If you have ESP32 + DHT11 hardware:

### Wiring
```
DHT11 VCC  → ESP32 3.3V
DHT11 DATA → ESP32 GPIO 4
DHT11 GND  → ESP32 GND
```

### Code Upload

1. Open Arduino IDE
2. Install libraries:
   - DHT sensor library (by Adafruit)
   - Adafruit Unified Sensor
3. Open `backend/esp32-example/sensor-upload.ino`
4. Update these lines:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverUrl = "https://beetkar-sensor-api.your-subdomain.workers.dev/api/sensor-data";
   ```
5. Select your ESP32 board and port
6. Click Upload!

Open Serial Monitor (115200 baud) to see it working!

## Verify Everything Works

### Check 1: Backend Health
```bash
curl https://beetkar-sensor-api.your-subdomain.workers.dev/health
```

Should return: `{"status":"ok",...}`

### Check 2: Latest Data
```bash
curl https://beetkar-sensor-api.your-subdomain.workers.dev/api/sensor-data/latest
```

Should return your sensor data!

### Check 3: Dashboard
Open http://localhost:5173/dashboard

You should see:
- ✅ Temperature card showing current value
- ✅ Humidity card showing current value
- ✅ Charts with historical data
- ✅ No error messages

## 🎉 Success!

Your dashboard is live! Here's what's happening:

1. ESP32 posts sensor data every 5 seconds → Cloudflare Worker
2. Data is stored in D1 database (SQLite at the edge)
3. Dashboard polls API every 5 seconds for updates
4. Charts automatically update with new data

## Next Steps

### Generate More Test Data

Run this script to simulate continuous sensor readings:

```bash
# Linux/Mac
while true; do
  TEMP=$(awk -v min=22 -v max=28 'BEGIN{srand(); print min+rand()*(max-min)}')
  HUM=$(awk -v min=60 -v max=75 'BEGIN{srand(); print min+rand()*(max-min)}')
  curl -X POST https://your-worker.workers.dev/api/sensor-data \
    -H "Content-Type: application/json" \
    -d "{\"temperature\": $TEMP, \"humidity\": $HUM}"
  echo "Posted: Temp=$TEMP, Humidity=$HUM"
  sleep 5
done
```

### Deploy Frontend to Production

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel

# OR deploy to Netlify
npx netlify deploy --prod

# OR deploy to Cloudflare Pages
wrangler pages deploy dist
```

### Add More Features

- Add alerts when temperature/humidity exceeds thresholds
- Add more sensors (light, pressure, etc.)
- Create mobile app
- Add user authentication
- Export data to CSV

## Troubleshooting

### "VITE_API_URL is not defined"
Create a `.env` file in the project root with:
```
VITE_API_URL=https://your-worker.workers.dev
```

### Cards show "--" or error
1. Check that you've posted at least one sensor reading
2. Verify API is accessible: `curl https://your-worker.workers.dev/health`
3. Check browser console for errors

### ESP32 won't connect to WiFi
1. Use 2.4GHz WiFi (ESP32 doesn't support 5GHz)
2. Check WiFi credentials are correct
3. Move ESP32 closer to router

### Charts are empty
1. Post multiple readings (at least 3-5)
2. Wait a few seconds for data to sync
3. Try changing time range (7d, 30d, 90d)

## Getting Help

- 📖 Full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🔧 Backend API docs: [backend/README.md](backend/README.md)
- 🔌 ESP32 setup guide: [backend/esp32-example/README.md](backend/esp32-example/README.md)
- 🧪 API testing guide: [backend/API_TESTING.md](backend/API_TESTING.md)

## Cost Breakdown

**Everything runs on free tiers!**

- Cloudflare Workers: 100,000 requests/day (FREE)
- D1 Database: 5M writes/day (FREE)
- Your usage: ~35,000 requests/day
- Cost: **$0/month** 💰

---

**Happy monitoring! 🌡️💧**

