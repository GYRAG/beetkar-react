"use client"

export function ThermalCameraStream({ src }: { src: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="mb-2 text-sm font-medium">Live Thermal</h3>
      <img src={src} style={{ maxWidth: "100%", imageRendering: "pixelated" }} />
    </div>
  )
}


