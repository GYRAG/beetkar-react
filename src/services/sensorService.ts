/**
 * Sensor Data Service
 * Handles communication with the Cloudflare Worker API
 */

export interface SensorReading {
  temperature: number;
  humidity: number;
  gas_resistance: number;
  pressure: number;
  vibration_rms: number;
  audio_dbfs: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  range?: string;
  aggregation?: string;
}

export type TimeRange = '15m' | '1h' | '24h' | '7d';

// Get API URL from environment variable or use default for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

// Debug: Log the API URL being used
console.log('🔧 Sensor Service API URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.VITE_API_URL);

/**
 * Fetch the latest sensor reading
 */
export async function fetchLatestReading(): Promise<SensorReading | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sensor-data/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch latest reading:', response.statusText);
      return null;
    }

    const result: ApiResponse<SensorReading> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return null;
  }
}

/**
 * Fetch historical sensor readings
 */
export async function fetchHistoricalData(
  range: TimeRange = '7d'
): Promise<SensorReading[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/sensor-data/history?range=${range}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch historical data:', response.statusText);
      return [];
    }

    const result: ApiResponse<SensorReading[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

/**
 * Post sensor data (mainly for testing)
 */
export async function postSensorData(
  temperature: number,
  humidity: number,
  gas_resistance: number,
  pressure: number,
  vibration_rms: number,
  audio_dbfs: number
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sensor-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        temperature, 
        humidity, 
        gas_resistance, 
        pressure, 
        vibration_rms, 
        audio_dbfs 
      }),
    });

    if (!response.ok) {
      console.error('Failed to post sensor data:', response.statusText);
      return false;
    }

    const result: ApiResponse<any> = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error posting sensor data:', error);
    return false;
  }
}

/**
 * Check API health
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
