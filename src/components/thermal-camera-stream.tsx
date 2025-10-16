"use client"

export function ThermalCameraStream({ src }: { src: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="mb-2 text-sm font-medium">Live Thermal</h3>
      <p className="text-xs text-gray-500 mb-2">URL: {src}</p>
      <img 
        src={src} 
        style={{ maxWidth: "100%", imageRendering: "pixelated" }} 
        onError={(e) => {
          console.error("Image load error:", e);
          console.error("Failed URL:", src);
        }}
        onLoad={() => console.log("Image loaded successfully:", src)}
      />
    </div>
  )
}


