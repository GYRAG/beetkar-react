/**
 * Custom hook for managing sensor data
 * Handles polling, state management, and data updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchLatestReading,
  fetchHistoricalData,
  type SensorReading,
  type TimeRange,
} from '@/services/sensorService';

interface UseSensorDataReturn {
  latestReading: SensorReading | null;
  historicalData: SensorReading[];
  isLoading: boolean;
  isError: boolean;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
  setTimeRange: (range: TimeRange) => void;
  currentRange: TimeRange;
}

interface UseSensorDataOptions {
  pollingInterval?: number; // in milliseconds
  enablePolling?: boolean;
  initialRange?: TimeRange;
}

/**
 * Hook to manage sensor data fetching and polling
 */
export function useSensorData(
  options: UseSensorDataOptions = {}
): UseSensorDataReturn {
  const {
    pollingInterval = 5000, // Default: 5 seconds
    enablePolling = true,
    initialRange = '7d',
  } = options;

  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentRange, setCurrentRange] = useState<TimeRange>(initialRange);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch latest sensor reading
   */
  const fetchLatest = useCallback(async () => {
    try {
      console.log('🔄 Fetching latest sensor reading...');
      const reading = await fetchLatestReading();
      console.log('📊 Received reading:', reading);
      
      if (reading) {
        console.log('✅ Setting latest reading:', reading);
        setLatestReading(reading);
        setLastUpdated(new Date());
        setIsError(false);
      } else {
        console.log('❌ No reading received');
        setIsError(true);
      }
    } catch (error) {
      console.error('❌ Error fetching latest reading:', error);
      setIsError(true);
    }
  }, []);

  /**
   * Fetch historical data
   */
  const fetchHistory = useCallback(async (range: TimeRange) => {
    try {
      const data = await fetchHistoricalData(range);
      setHistoricalData(data);
      setIsError(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setIsError(true);
    }
  }, []);

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchLatest(), fetchHistory(currentRange)]);
    setIsLoading(false);
  }, [fetchLatest, fetchHistory, currentRange]);

  /**
   * Change time range and fetch new historical data
   */
  const handleSetTimeRange = useCallback(
    (range: TimeRange) => {
      setCurrentRange(range);
      fetchHistory(range);
    },
    [fetchHistory]
  );

  /**
   * Initial data fetch
   */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Set up polling for latest data
   */
  useEffect(() => {
    if (!enablePolling) return;

    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Set up new polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchLatest();
    }, pollingInterval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [enablePolling, pollingInterval, fetchLatest]);

  /**
   * Handle visibility change to pause/resume polling
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause polling when tab is not visible
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } else {
        // Resume polling when tab becomes visible
        if (enablePolling && !pollingIntervalRef.current) {
          fetchLatest(); // Fetch immediately
          pollingIntervalRef.current = setInterval(fetchLatest, pollingInterval);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enablePolling, pollingInterval, fetchLatest]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    latestReading,
    historicalData,
    isLoading,
    isError,
    lastUpdated,
    refreshData,
    setTimeRange: handleSetTimeRange,
    currentRange,
  };
}

