import { useState, useEffect, useCallback } from 'react';
import { imageCaptureService, type ImageCaptureStatus, type ImageCaptureResult } from '@/services/imageCaptureService';

export interface UseImageCaptureReturn {
  status: ImageCaptureStatus;
  captureSingleImage: () => Promise<ImageCaptureResult>;
  clearImages: () => void;
  downloadImages: () => Promise<void>;
  isBridgeAvailable: boolean;
  checkBridgeHealth: () => Promise<void>;
}

export function useImageCapture(): UseImageCaptureReturn {
  const [status, setStatus] = useState<ImageCaptureStatus>({
    isCapturing: false,
    capturedImages: [],
  });
  const [isBridgeAvailable, setIsBridgeAvailable] = useState(false);

  // Update status from service
  const updateStatus = useCallback(() => {
    const serviceStatus = imageCaptureService.getStatus();
    setStatus(serviceStatus);
  }, []);

  // Check bridge health
  const checkBridgeHealth = useCallback(async () => {
    const isAvailable = await imageCaptureService.checkBridgeHealth();
    setIsBridgeAvailable(isAvailable);
  }, []);


  // Capture a single image
  const captureSingleImage = useCallback(async (): Promise<ImageCaptureResult> => {
    const result = await imageCaptureService.captureSingleImage();
    updateStatus();
    return result;
  }, [updateStatus]);

  // Clear captured images
  const clearImages = useCallback(() => {
    imageCaptureService.clearCapturedImages();
    updateStatus();
  }, [updateStatus]);

  // Download captured images
  const downloadImages = useCallback(async () => {
    try {
      await imageCaptureService.downloadCapturedImages();
    } catch (error) {
      console.error('Failed to download images:', error);
      throw error;
    }
  }, []);

  // Check bridge health on mount
  useEffect(() => {
    checkBridgeHealth();
  }, [checkBridgeHealth]);

  return {
    status,
    captureSingleImage,
    clearImages,
    downloadImages,
    isBridgeAvailable,
    checkBridgeHealth,
  };
}
