import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export function useLoading(initialState: LoadingState = { isLoading: false }) {
  const [loadingState, setLoadingState] = useState<LoadingState>(initialState);

  const startLoading = useCallback((message?: string) => {
    setLoadingState({ isLoading: true, message });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({ isLoading: false });
  }, []);

  const setLoading = useCallback((isLoading: boolean, message?: string) => {
    setLoadingState({ isLoading, message });
  }, []);

  return {
    ...loadingState,
    startLoading,
    stopLoading,
    setLoading,
  };
}

// Hook for page-level loading
export function usePageLoading() {
  return useLoading({ isLoading: false });
}

// Hook for component-level loading
export function useComponentLoading() {
  return useLoading({ isLoading: false });
}
