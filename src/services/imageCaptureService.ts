/**
 * Service for capturing images from the thermal camera bridge
 */

export interface ImageCaptureResult {
  success: boolean;
  imageData?: string; // Base64 encoded image data
  error?: string;
  timestamp?: string;
}

export interface ImageCaptureStatus {
  isCapturing: boolean;
  capturedImages: string[]; // Array of base64 image data
  lastCaptureTime?: string;
  error?: string;
}

class ImageCaptureService {
  private bridgeUrl: string;
  private status: ImageCaptureStatus = {
    isCapturing: false,
    capturedImages: [],
  };

  constructor(bridgeUrl: string = 'http://localhost:8080') {
    this.bridgeUrl = bridgeUrl;
  }

  /**
   * Capture a single image
   */
  async captureSingleImage(): Promise<ImageCaptureResult> {
    return await this.captureImage();
  }

  /**
   * Capture a single image from the thermal camera
   */
  async captureImage(): Promise<ImageCaptureResult> {
    try {
      // Get the latest image from the MJPEG stream
      const response = await fetch(`${this.bridgeUrl}/mjpeg`, {
        method: 'GET',
        headers: {
          'Accept': 'image/jpeg',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      
      // Convert blob to base64
      const base64 = await this.blobToBase64(imageBlob);
      
      // Add to captured images array
      this.status.capturedImages.push(base64);
      this.status.lastCaptureTime = new Date().toISOString();

      // Keep only last 10 images in memory to prevent memory issues
      if (this.status.capturedImages.length > 10) {
        this.status.capturedImages = this.status.capturedImages.slice(-10);
      }

      return {
        success: true,
        imageData: base64,
        timestamp: this.status.lastCaptureTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.status.error = errorMessage;
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get current capture status
   */
  getStatus(): ImageCaptureStatus {
    return { ...this.status };
  }

  /**
   * Clear captured images
   */
  clearCapturedImages(): void {
    this.status.capturedImages = [];
  }

  /**
   * Download all captured images as a zip file
   */
  async downloadCapturedImages(): Promise<void> {
    if (this.status.capturedImages.length === 0) {
      throw new Error('No images to download');
    }

    // For now, download images individually
    // In a production app, you might want to create a zip file
    this.status.capturedImages.forEach((imageData, index) => {
      this.downloadImage(imageData, `thermal_capture_${index + 1}.jpg`);
    });
  }

  /**
   * Download a single image
   */
  private downloadImage(base64Data: string, filename: string): void {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Check if the thermal camera bridge is available
   */
  async checkBridgeHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.bridgeUrl}/health`);
      const data = await response.json();
      return data.ok === true;
    } catch {
      return false;
    }
  }
}

// Create a singleton instance
export const imageCaptureService = new ImageCaptureService();
