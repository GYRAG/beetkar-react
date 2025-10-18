"use client"

import { Camera, Download, Trash2 } from "lucide-react"
import { PaletteSelector } from "./palette-selector"
import { useImageCapture } from "@/hooks/useImageCapture"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ThermalCameraStream({ src }: { src: string }) {
  // Extract base URL for palette API calls
  const baseUrl = src.replace('/mjpeg', '')
  
  const {
    status: captureStatus,
    captureSingleImage,
    clearImages,
    downloadImages,
    isBridgeAvailable,
  } = useImageCapture()

  const handleCapture = async () => {
    try {
      await captureSingleImage()
    } catch (error) {
      console.error('Failed to capture image:', error)
    }
  }

  const handleDownloadImages = async () => {
    try {
      await downloadImages()
    } catch (error) {
      console.error('Failed to download images:', error)
    }
  }

  const handleClearImages = () => {
    clearImages()
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-background p-6">
        <div className="mb-4 text-center">
          <h3 className="text-xl font-semibold mb-1">თერმული კამერის პირდაპირი ტრანსლაცია</h3>
          <p className="text-sm text-gray-500">URL: {src}</p>
        </div>
        <div className="flex justify-center">
          <div 
            className="thermal-video-container"
            style={{
              display: "inline-block",
              borderRadius: "8px",
              border: "2px solid #374151",
              backgroundColor: "#000",
              padding: "4px"
            }}
          >
            <img 
              src={src} 
              className="thermal-preview"
              style={{ 
                width: "100%", 
                height: "auto",
                minHeight: "300px",
                maxHeight: "400px",
                imageRendering: "pixelated",
                objectFit: "contain",
                display: "block"
              }} 
              onError={(e) => {
                console.error("Image load error:", e);
                console.error("Failed URL:", src);
              }}
              onLoad={() => console.log("Image loaded successfully:", src)}
            />
          </div>
        </div>
      </div>
      
      {/* Image Capture Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">ფოტოს გადაღება</h3>
          {!isBridgeAvailable && (
            <Badge variant="destructive" className="text-xs">
              კამერა მიუწვდომელია
            </Badge>
          )}
          {captureStatus.capturedImages.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {captureStatus.capturedImages.length} სურათი
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={handleCapture}
            disabled={!isBridgeAvailable}
            size="default"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Camera className="h-4 w-4 mr-2" />
            სურათის გადაღება
          </Button>
          
          {captureStatus.capturedImages.length > 0 && (
            <>
              <Button
                onClick={handleDownloadImages}
                size="default"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                ჩამოტვირთვა
              </Button>
              <Button
                onClick={handleClearImages}
                size="default"
                variant="outline"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                გასუფთავება
              </Button>
            </>
          )}
        </div>
        
        {captureStatus.error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {captureStatus.error}
          </div>
        )}
      </div>
      
      <PaletteSelector 
        bridgeUrl={baseUrl}
        onPaletteChange={(palette) => {
          console.log("Palette changed to:", palette)
        }}
      />
    </div>
  )
}


