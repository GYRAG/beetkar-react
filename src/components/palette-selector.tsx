"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Palette {
  name: string
  displayName: string
  description: string
}

const PALETTES: Palette[] = [
  { name: "fusion", displayName: "Fusion", description: "Multi-color fusion" },
  { name: "rainbow", displayName: "Rainbow", description: "Full spectrum colors" },
  { name: "glowbow", displayName: "Glowbow", description: "Glowing rainbow" },
]

interface PaletteSelectorProps {
  bridgeUrl: string
  onPaletteChange?: (palette: string) => void
}

export function PaletteSelector({ bridgeUrl, onPaletteChange }: PaletteSelectorProps) {
  const [currentPalette, setCurrentPalette] = useState<string>("gray")
  const [availablePalettes, setAvailablePalettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch available palettes on mount
  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        const response = await fetch(`${bridgeUrl}/palettes`)
        if (response.ok) {
          const data = await response.json()
          // Filter to only show the 3 palettes we want
          const allowedPalettes = ["fusion", "rainbow", "glowbow"]
          const filteredPalettes = (data.palettes || []).filter((p: string) => 
            allowedPalettes.includes(p)
          )
          setAvailablePalettes(filteredPalettes)
          setCurrentPalette(data.current || "fusion")
        }
      } catch (error) {
        console.error("Failed to fetch palettes:", error)
        // Fallback to our 3 default palettes
        setAvailablePalettes(["fusion", "rainbow", "glowbow"])
        setCurrentPalette("fusion")
      }
    }

    fetchPalettes()
  }, [bridgeUrl])

  const changePalette = async (paletteName: string) => {
    console.log(`Attempting to change palette to: ${paletteName}`)
    console.log(`Bridge URL: ${bridgeUrl}`)
    setIsLoading(true)
    try {
      const response = await fetch(`${bridgeUrl}/palette`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ palette: paletteName }),
      })

      console.log(`Response status: ${response.status}`)
      console.log(`Response ok: ${response.ok}`)

      if (response.ok) {
        const data = await response.json()
        console.log(`Palette changed successfully:`, data)
        setCurrentPalette(data.palette)
        onPaletteChange?.(data.palette)
      } else {
        const errorText = await response.text()
        console.error("Failed to change palette:", response.status, errorText)
      }
    } catch (error) {
      console.error("Error changing palette:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPaletteInfo = (name: string) => {
    return PALETTES.find(p => p.name === name) || {
      name,
      displayName: name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      description: "Custom palette"
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        Current: <span className="font-medium">{getPaletteInfo(currentPalette).displayName}</span>
      </div>
      
      <div className="flex justify-center gap-2">
        {availablePalettes.map((palette) => {
          const info = getPaletteInfo(palette)
          const isActive = palette === currentPalette
          
          return (
            <Button
              key={palette}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => changePalette(palette)}
              disabled={isLoading}
              className="h-auto p-3 flex flex-col items-center space-y-1"
              title={info.description}
            >
              <span className="text-xs font-medium">{info.displayName}</span>
            </Button>
          )
        })}
      </div>
      
      {isLoading && (
        <div className="text-sm text-muted-foreground text-center">
          Changing palette...
        </div>
      )}
    </div>
  )
}
