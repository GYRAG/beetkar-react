# Beetkar - ESP32 Sensor Monitoring Dashboard

A modern, real-time IoT dashboard for monitoring temperature and humidity data from ESP32 devices with DHT11 sensors. Built with React, Cloudflare Workers, and D1 database.

## ✨ Features

- 🌡️ **Real-time Monitoring**: Temperature and humidity updates every 5 seconds
- 📊 **Interactive Charts**: Visualize historical sensor data with customizable time ranges
- 🔄 **Auto-refresh**: Automatic polling with smart pause when tab is hidden
- 📱 **Responsive Design**: Beautiful UI that works on desktop and mobile
- ☁️ **Serverless Backend**: Powered by Cloudflare Workers and D1 database
- 🔌 **ESP32 Integration**: Simple Arduino code for ESP32 + DHT11 sensor
- 💾 **Data Retention**: Automatic cleanup of data older than 90 days
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account (free tier works)
- ESP32 board + DHT11 sensor (for hardware integration)
- Arduino IDE (for ESP32 programming)

### 1. Clone Repository

```bash
git clone <repository-url>
cd beetkar-react
```

### 2. Deploy Backend

```bash
cd backend
npm install

# Login to Cloudflare
wrangler login

# Create database
wrangler d1 create beetkar-sensors

# Update wrangler.toml with your database ID
# Then initialize schema
wrangler d1 execute beetkar-sensors --file=schema.sql

# Deploy
npm run deploy
```

### 3. Setup Frontend

```bash
cd ..
npm install

# Create .env file with your Worker URL
echo "VITE_API_URL=https://your-worker.workers.dev" > .env

# Start development server
npm run dev
```

### 4. Configure ESP32

1. Wire DHT11 to ESP32 (see [ESP32 Guide](backend/esp32-example/README.md))
2. Open `backend/esp32-example/sensor-upload.ino` in Arduino IDE
3. Update WiFi credentials and Worker URL
4. Upload to ESP32

## 📁 Project Structure

```
beetkar-react/
├── src/
│   ├── components/          # React components
│   │   ├── section-cards.tsx       # Live sensor data cards
│   │   ├── chart-area-interactive.tsx  # Humidity chart
│   │   └── chart-temperature-line.tsx  # Temperature chart
│   ├── hooks/              # Custom React hooks
│   │   └── useSensorData.ts       # Sensor data polling hook
│   ├── services/           # API client services
│   │   └── sensorService.ts       # API communication
│   └── app/dashboard/      # Dashboard page
│
├── backend/
│   ├── src/
│   │   └── index.ts        # Cloudflare Worker API
│   ├── schema.sql          # D1 database schema
│   ├── wrangler.toml       # Worker configuration
│   └── esp32-example/      # ESP32 Arduino code
│       ├── sensor-upload.ino
│       └── README.md       # ESP32 setup guide
│
└── DEPLOYMENT.md           # Detailed deployment guide
```

## 🔌 API Endpoints

### POST /api/sensor-data
Upload sensor readings from ESP32

**Request:**
```json
{
  "temperature": 24.5,
  "humidity": 65.0
}
```

### GET /api/sensor-data/latest
Get the most recent sensor reading

**Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 24.5,
    "humidity": 65.0,
    "timestamp": "2024-10-09T12:34:56Z"
  }
}
```

### GET /api/sensor-data/history?range=7d|30d|90d
Get historical sensor data

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "temperature": 24.5,
      "humidity": 65.0,
      "timestamp": "2024-10-09T12:34:56Z"
    }
  ],
  "range": "7d",
  "aggregation": "raw"
}
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Radix UI** - UI components
- **Framer Motion** - Animations

### Backend
- **Cloudflare Workers** - Serverless API
- **D1 Database** - SQLite edge database
- **Wrangler** - Deployment tool

### Hardware
- **ESP32** - Microcontroller
- **DHT11** - Temperature/humidity sensor
- **Arduino IDE** - Programming environment

## 📊 Data Flow

```
ESP32 + DHT11
     ↓ (POST every 5s)
Cloudflare Worker
     ↓
D1 Database (SQLite)
     ↓ (GET polling)
React Dashboard
```

## 🎯 Features in Detail

### Real-time Cards
- Display current temperature and humidity
- Show last update timestamp
- Trend indicators (up/down)
- Error states with retry logic
- Skeleton loaders during initial fetch

### Interactive Charts
- **Humidity Chart**: Area chart with target line
- **Temperature Chart**: Line chart with smooth curves
- Time range filters: 7 days, 30 days, 90 days
- Automatic data aggregation for longer ranges
- Responsive design with mobile optimization

### Smart Polling
- Updates every 5 seconds when tab is active
- Automatically pauses when tab is hidden
- Resumes immediately when tab becomes visible
- Prevents unnecessary API calls

### Data Management
- Automatic cleanup of old data (90+ days)
- Efficient indexing for fast queries
- Hourly aggregation for 30d and 90d views
- Raw data for 7d view

## 📖 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Complete deployment instructions
- **[Backend README](backend/README.md)** - API documentation and setup
- **[ESP32 Guide](backend/esp32-example/README.md)** - Hardware wiring and code

## 🐛 Troubleshooting

### Frontend shows "Connection Error"
1. Verify `VITE_API_URL` in `.env` is correct
2. Check Cloudflare Worker is deployed
3. Test API with: `curl https://your-worker.workers.dev/health`

### ESP32 won't connect
1. Double-check WiFi credentials
2. Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
3. Verify Worker URL is correct
4. Check Serial Monitor for error messages

### No data in charts
1. Ensure ESP32 is uploading data
2. Check database has records: `wrangler d1 execute beetkar-sensors --command="SELECT COUNT(*) FROM sensor_readings"`
3. Verify API returns data: `curl https://your-worker.workers.dev/api/sensor-data/latest`

## 💰 Cost

**Free tier is sufficient for personal use:**
- Cloudflare Workers: 100,000 requests/day (free)
- D1 Database: 5M writes/day (free)
- Expected usage: ~35,000 requests/day (well within limits)

## 🔐 Security

- CORS enabled (configure for production)
- Input validation on all endpoints
- Parameterized SQL queries (SQL injection protection)
- HTTPS enforced by Cloudflare
- Consider adding API authentication for production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT

## 🙏 Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Charts powered by [Recharts](https://recharts.org/)
- ESP32 by [Espressif](https://www.espressif.com/)

## 📧 Support

For issues and questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides
2. Review [Troubleshooting](#-troubleshooting) section
3. Open an issue on GitHub

---

**Built with ❤️ for IoT monitoring**
