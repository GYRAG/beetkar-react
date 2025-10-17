"use client"

import { PaletteSelector } from "./palette-selector"

export function ThermalCameraStream({ src }: { src: string }) {
  // Extract base URL for palette API calls
  const baseUrl = src.replace('/mjpeg', '')
  
  return (
    <div className="space-y-4">
      <div className="bg-background p-6">
        <div className="mb-4 text-center">
          <h3 className="text-xl font-semibold mb-1">Live Thermal Camera</h3>
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
      
      <PaletteSelector 
        bridgeUrl={baseUrl}
        onPaletteChange={(palette) => {
          console.log("Palette changed to:", palette)
        }}
      />
    </div>
  )
}


