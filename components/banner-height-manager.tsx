"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

interface BannerHeightManagerProps {
  onHeightChange?: (desktopHeight: number, mobileHeight: number) => void
}

export function BannerHeightManager({ onHeightChange }: BannerHeightManagerProps) {
  const [desktopHeight, setDesktopHeight] = useState<number>(750)
  const [mobileHeight, setMobileHeight] = useState<number>(650)
  const [logoWidth, setLogoWidth] = useState<number>(339) // Current logo width in pixels
  const { toast } = useToast()

  // Load saved heights from localStorage
  useEffect(() => {
    const savedDesktopHeight = localStorage.getItem("gang-boyz-banner-desktop-height")
    const savedMobileHeight = localStorage.getItem("gang-boyz-banner-mobile-height")
    const savedLogoWidth = localStorage.getItem("gang-boyz-logo-width")
    
    if (savedDesktopHeight) {
      setDesktopHeight(parseInt(savedDesktopHeight))
    }
    
    if (savedMobileHeight) {
      setMobileHeight(parseInt(savedMobileHeight))
    }
    
    if (savedLogoWidth) {
      setLogoWidth(parseInt(savedLogoWidth))
    }
  }, [])

  // Save heights to localStorage
  const saveHeights = () => {
    localStorage.setItem("gang-boyz-banner-desktop-height", desktopHeight.toString())
    localStorage.setItem("gang-boyz-banner-mobile-height", mobileHeight.toString())
    localStorage.setItem("gang-boyz-logo-width", logoWidth.toString())
    
    // Notify parent component of changes
    if (onHeightChange) {
      onHeightChange(desktopHeight, mobileHeight)
    }
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('bannerHeightChanged', {
      detail: { desktopHeight, mobileHeight }
    }))
    
    // Dispatch custom event for logo width changes
    window.dispatchEvent(new CustomEvent('logoWidthChanged', {
      detail: { logoWidth }
    }))
    
    toast({
      title: "Alturas salvas",
      description: "As alturas do banner e tamanho do logo foram atualizados com sucesso.",
    })
  }

  // Reset to default values
  const resetHeights = () => {
    setDesktopHeight(750)
    setMobileHeight(650)
    setLogoWidth(339)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white">Ajustar Altura do Banner</h3>
      
      {/* Desktop Height */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-200">
          Altura Desktop (px)
        </Label>
        <Slider
          value={[desktopHeight]}
          onValueChange={(value) => setDesktopHeight(value[0])}
          min={300}
          max={1200}
          step={10}
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={desktopHeight}
            onChange={(e) => setDesktopHeight(parseInt(e.target.value) || 300)}
            min={300}
            max={1200}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
          <span className="text-sm text-gray-300">px</span>
        </div>
      </div>
      
      {/* Mobile Height */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-200">
          Altura Mobile (px)
        </Label>
        <Slider
          value={[mobileHeight]}
          onValueChange={(value) => setMobileHeight(value[0])}
          min={200}
          max={800}
          step={10}
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={mobileHeight}
            onChange={(e) => setMobileHeight(parseInt(e.target.value) || 200)}
            min={200}
            max={800}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
          <span className="text-sm text-gray-300">px</span>
        </div>
      </div>
      
      {/* Logo Width Adjustment */}
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={saveHeights} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
          Salvar Alturas
        </Button>
        <Button variant="outline" onClick={resetHeights} className="flex-1 border-gray-600 text-black hover:bg-gray-700">
          Resetar
        </Button>
      </div>
    </div>
  )
}