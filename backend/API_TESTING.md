# API Testing Guide

This guide provides commands and examples for testing the Beetkar Sensor API.

## Prerequisites

- `curl` installed (comes with most Unix systems, Git Bash on Windows)
- OR Postman/Insomnia for GUI-based testing
- Your Cloudflare Worker URL

## Environment Setup

Set your worker URL as an environment variable for easier testing:

```bash
# Linux/Mac
export WORKER_URL="https://your-worker.workers.dev"

# Windows (PowerShell)
$env:WORKER_URL = "https://your-worker.workers.dev"

# Windows (CMD)
set WORKER_URL=https://your-worker.workers.dev
```

## Test Endpoints

### 1. Health Check

**Request:**
```bash
curl $WORKER_URL/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Beetkar Sensor API is running",
  "timestamp": "2024-10-09T12:34:56.789Z"
}
```

### 2. Post Sensor Data

**Valid Request:**
```bash
curl -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 24.5,
    "humidity": 65.3
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "id": 1,
  "message": "Sensor data stored successfully"
}
```

**Invalid Request (out of range):**
```bash
curl -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 150,
    "humidity": 200
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid sensor data. Temperature must be between -40 and 80, humidity between 0 and 100."
}
```

### 3. Get Latest Reading

**Request:**
```bash
curl $WORKER_URL/api/sensor-data/latest
```

**Expected Response (with data):**
```json
{
  "success": true,
  "data": {
    "temperature": 24.5,
    "humidity": 65.3,
    "timestamp": "2024-10-09T12:34:56"
  }
}
```

**Expected Response (no data):**
```json
{
  "success": false,
  "error": "No sensor data available"
}
```

### 4. Get Historical Data

**7 Days (raw data):**
```bash
curl "$WORKER_URL/api/sensor-data/history?range=7d"
```

**30 Days (hourly aggregation):**
```bash
curl "$WORKER_URL/api/sensor-data/history?range=30d"
```

**90 Days (hourly aggregation):**
```bash
curl "$WORKER_URL/api/sensor-data/history?range=90d"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "temperature": 24.5,
      "humidity": 65.3,
      "timestamp": "2024-10-09T12:00:00"
    },
    {
      "temperature": 25.0,
      "humidity": 64.8,
      "timestamp": "2024-10-09T13:00:00"
    }
  ],
  "range": "7d",
  "aggregation": "raw"
}
```

## Automated Test Script

Create a file `test-api.sh`:

```bash
#!/bin/bash

# Configuration
WORKER_URL="https://your-worker.workers.dev"

echo "==================================="
echo "Beetkar Sensor API Test Suite"
echo "==================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "-----------------------------------"
curl -s $WORKER_URL/health | jq .
echo ""

# Test 2: Post Valid Data
echo "Test 2: Post Valid Sensor Data"
echo "-----------------------------------"
curl -s -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.5, "humidity": 65.0}' | jq .
echo ""

# Test 3: Post Invalid Data
echo "Test 3: Post Invalid Sensor Data"
echo "-----------------------------------"
curl -s -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 150, "humidity": 200}' | jq .
echo ""

# Test 4: Get Latest
echo "Test 4: Get Latest Reading"
echo "-----------------------------------"
curl -s $WORKER_URL/api/sensor-data/latest | jq .
echo ""

# Test 5: Get History
echo "Test 5: Get 7-day History"
echo "-----------------------------------"
curl -s "$WORKER_URL/api/sensor-data/history?range=7d" | jq '.data | length'
echo " records returned"
echo ""

echo "==================================="
echo "All tests completed!"
echo "==================================="
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Load Testing

### Generate Sample Data

Post 100 random readings:

```bash
#!/bin/bash

WORKER_URL="https://your-worker.workers.dev"

for i in {1..100}; do
  TEMP=$(awk -v min=20 -v max=30 'BEGIN{srand(); print min+rand()*(max-min)}')
  HUM=$(awk -v min=50 -v max=80 'BEGIN{srand(); print min+rand()*(max-min)}')
  
  echo "Posting reading $i: Temp=$TEMP, Humidity=$HUM"
  
  curl -s -X POST $WORKER_URL/api/sensor-data \
    -H "Content-Type: application/json" \
    -d "{\"temperature\": $TEMP, \"humidity\": $HUM}" > /dev/null
  
  sleep 0.5
done

echo "Posted 100 readings successfully!"
```

### Simulate ESP32 Behavior

```bash
#!/bin/bash

WORKER_URL="https://your-worker.workers.dev"

echo "Simulating ESP32 sensor (Ctrl+C to stop)"
echo "Posting data every 5 seconds..."

while true; do
  # Generate random values within normal range
  TEMP=$(awk -v min=22 -v max=28 'BEGIN{srand(); print min+rand()*(max-min)}')
  HUM=$(awk -v min=60 -v max=75 'BEGIN{srand(); print min+rand()*(max-min)}')
  
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  echo "[$TIMESTAMP] Temp: ${TEMP}°C, Humidity: ${HUM}%"
  
  RESPONSE=$(curl -s -X POST $WORKER_URL/api/sensor-data \
    -H "Content-Type: application/json" \
    -d "{\"temperature\": $TEMP, \"humidity\": $HUM}")
  
  if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "  ✓ Upload successful"
  else
    echo "  ✗ Upload failed: $RESPONSE"
  fi
  
  sleep 5
done
```

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Beetkar Sensor API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://your-worker.workers.dev",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Post Sensor Data",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"temperature\": 24.5,\n  \"humidity\": 65.0\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/sensor-data",
          "host": ["{{base_url}}"],
          "path": ["api", "sensor-data"]
        }
      }
    },
    {
      "name": "Get Latest Reading",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/sensor-data/latest",
          "host": ["{{base_url}}"],
          "path": ["api", "sensor-data", "latest"]
        }
      }
    },
    {
      "name": "Get 7-day History",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/sensor-data/history?range=7d",
          "host": ["{{base_url}}"],
          "path": ["api", "sensor-data", "history"],
          "query": [
            {
              "key": "range",
              "value": "7d"
            }
          ]
        }
      }
    }
  ]
}
```

## Database Inspection

### Using Wrangler CLI

```bash
# Count total records
wrangler d1 execute beetkar-sensors \
  --command="SELECT COUNT(*) as total FROM sensor_readings"

# Get latest 10 readings
wrangler d1 execute beetkar-sensors \
  --command="SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 10"

# Get average temperature and humidity
wrangler d1 execute beetkar-sensors \
  --command="SELECT AVG(temperature) as avg_temp, AVG(humidity) as avg_hum FROM sensor_readings"

# Get min/max values
wrangler d1 execute beetkar-sensors \
  --command="SELECT MIN(temperature) as min_temp, MAX(temperature) as max_temp, MIN(humidity) as min_hum, MAX(humidity) as max_hum FROM sensor_readings"

# Get oldest and newest records
wrangler d1 execute beetkar-sensors \
  --command="SELECT MIN(timestamp) as oldest, MAX(timestamp) as newest FROM sensor_readings"

# Count readings per day (last 7 days)
wrangler d1 execute beetkar-sensors \
  --command="SELECT DATE(timestamp) as date, COUNT(*) as count FROM sensor_readings WHERE timestamp >= datetime('now', '-7 days') GROUP BY DATE(timestamp) ORDER BY date"
```

## Performance Testing

### Measure API Response Time

```bash
# Test GET endpoint
time curl -s $WORKER_URL/api/sensor-data/latest > /dev/null

# Test POST endpoint
time curl -s -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.5, "humidity": 65.0}' > /dev/null

# Multiple requests
for i in {1..10}; do
  time curl -s $WORKER_URL/api/sensor-data/latest > /dev/null
done
```

### Test CORS

```bash
curl -X OPTIONS $WORKER_URL/api/sensor-data \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## Monitoring

### View Real-time Logs

```bash
wrangler tail
```

### Check Deployment Status

```bash
wrangler deployments list
```

### View Worker Analytics

```bash
# Open in browser
wrangler dev --remote
```

## Cleanup Test Data

```bash
# Delete all test data
wrangler d1 execute beetkar-sensors \
  --command="DELETE FROM sensor_readings"

# Reset auto-increment
wrangler d1 execute beetkar-sensors \
  --command="DELETE FROM sqlite_sequence WHERE name='sensor_readings'"

# Verify deletion
wrangler d1 execute beetkar-sensors \
  --command="SELECT COUNT(*) FROM sensor_readings"
```

## Common Issues

### Issue: CORS Error
```bash
# Test CORS headers
curl -I $WORKER_URL/api/sensor-data
# Look for: Access-Control-Allow-Origin: *
```

### Issue: 500 Internal Server Error
```bash
# Check worker logs
wrangler tail

# Test database connection
wrangler d1 execute beetkar-sensors --command="SELECT 1"
```

### Issue: 404 Not Found
```bash
# Verify deployment
wrangler deployments list

# Check route configuration
curl $WORKER_URL/health
```

## Expected Performance

- **GET /latest**: < 100ms
- **POST /sensor-data**: < 150ms
- **GET /history?range=7d**: < 200ms
- **GET /history?range=90d**: < 500ms

## Security Testing

```bash
# Test SQL injection (should be prevented)
curl -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": "25; DROP TABLE sensor_readings;--", "humidity": 65}'

# Test XSS (should be sanitized)
curl -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature": "<script>alert(1)</script>", "humidity": 65}'

# Test oversized payload (should be rejected)
curl -X POST $WORKER_URL/api/sensor-data \
  -H "Content-Type: application/json" \
  -d "$(printf '{"temperature": 25, "humidity": 65, "data": "%0.s-" {1..10000}}')"
```

All tests should return appropriate error responses, not server errors.

