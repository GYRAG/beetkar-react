/**
 * Cloudflare Worker API for ESP32 Sensor Data
 * Handles sensor data storage and retrieval with D1 database
 */

interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

interface SensorReading {
  id?: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

interface SensorDataRequest {
  temperature: number;
  humidity: number;
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Handle CORS preflight requests
 */
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

/**
 * Validate sensor data input
 */
function validateSensorData(data: any): data is SensorDataRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.temperature === 'number' &&
    typeof data.humidity === 'number' &&
    data.temperature >= -40 &&
    data.temperature <= 80 &&
    data.humidity >= 0 &&
    data.humidity <= 100
  );
}

/**
 * POST /api/sensor-data
 * Store new sensor reading
 */
async function handlePostSensorData(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();

    if (!validateSensorData(data)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid sensor data. Temperature must be between -40 and 80, humidity between 0 and 100.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Insert sensor reading into database
    const result = await env.DB.prepare(
      'INSERT INTO sensor_readings (temperature, humidity, timestamp) VALUES (?, ?, datetime("now"))'
    )
      .bind(data.temperature, data.humidity)
      .run();

    // Clean up old records (older than 90 days) - run periodically
    if (Math.random() < 0.1) {
      await env.DB.prepare(
        'DELETE FROM sensor_readings WHERE timestamp < datetime("now", "-90 days")'
      ).run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: result.meta.last_row_id,
        message: 'Sensor data stored successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Error storing sensor data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to store sensor data',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}

/**
 * GET /api/sensor-data/latest
 * Retrieve the most recent sensor reading
 */
async function handleGetLatest(env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      'SELECT temperature, humidity, timestamp FROM sensor_readings ORDER BY timestamp DESC LIMIT 1'
    ).first<SensorReading>();

    if (!result) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No sensor data available',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Error fetching latest data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch latest sensor data',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}

/**
 * GET /api/sensor-data/history?range=15m|1h|24h|7d
 * Retrieve historical sensor readings
 */
async function handleGetHistory(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '24h';

    let timeFilter = '';
    let aggregation = 'raw'; // raw or aggregated

    switch (range) {
      case '15m':
        timeFilter = "datetime('now', '-15 minutes')";
        aggregation = 'raw';
        break;
      case '1h':
        timeFilter = "datetime('now', '-1 hour')";
        aggregation = 'raw';
        break;
      case '24h':
        timeFilter = "datetime('now', '-24 hours')";
        aggregation = 'raw';
        break;
      case '7d':
        timeFilter = "datetime('now', '-7 days')";
        aggregation = 'hourly';
        break;
      default:
        timeFilter = "datetime('now', '-24 hours')";
        aggregation = 'raw';
    }

    let query: string;
    
    if (aggregation === 'raw') {
      // Return all raw data for shorter time ranges
      query = `
        SELECT 
          temperature, 
          humidity, 
          timestamp 
        FROM sensor_readings 
        WHERE timestamp >= ${timeFilter}
        ORDER BY timestamp ASC
      `;
    } else {
      // For 7 days, aggregate by hour to reduce data points
      query = `
        SELECT 
          AVG(temperature) as temperature,
          AVG(humidity) as humidity,
          datetime(strftime('%Y-%m-%d %H:00:00', timestamp)) as timestamp
        FROM sensor_readings 
        WHERE timestamp >= ${timeFilter}
        GROUP BY strftime('%Y-%m-%d %H', timestamp)
        ORDER BY timestamp ASC
      `;
    }

    const result = await env.DB.prepare(query).all<SensorReading>();

    return new Response(
      JSON.stringify({
        success: true,
        data: result.results || [],
        range: range,
        aggregation: aggregation,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Error fetching history:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch sensor history',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route handling
    if (path === '/api/sensor-data' && request.method === 'POST') {
      return handlePostSensorData(request, env);
    }

    if (path === '/api/sensor-data/latest' && request.method === 'GET') {
      return handleGetLatest(env);
    }

    if (path === '/api/sensor-data/history' && request.method === 'GET') {
      return handleGetHistory(request, env);
    }

    // Health check endpoint
    if (path === '/health' || path === '/') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'Beetkar Sensor API is running',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Not found',
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  },
};

