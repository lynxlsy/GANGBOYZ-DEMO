"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { CropData, BannerConfig, BannerCropManager } from '@/lib/banner-crop'

interface BannerCropEditorProps {
  bannerId: string
  imageSrc: string
  containerWidth: number
  containerHeight: number
  onCropChange: (cropData: CropData) => void
  onSave: (config: BannerConfig) => void
}

export function BannerCropEditor({
  bannerId,
  imageSrc,
  containerWidth,
  containerHeight,
  onCropChange,
  onSave
}: BannerCropEditorProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    width: containerWidth,
    height: containerHeight,
    scale: 1,
    rotation: 0
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const manager = BannerCropManager.getInstance()

  // Carregar configuração existente
  useEffect(() => {
    const existingConfig = manager.loadCropConfig(bannerId)
    if (existingConfig) {
      setCropData(existingConfig.cropData)
      onCropChange(existingConfig.cropData)
    }
  }, [bannerId, manager, onCropChange])

  // Carregar dimensões da imagem
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      setImageDimensions({ width: naturalWidth, height: naturalHeight })
      setImageLoaded(true)
      
      // Se não há crop configurado, centralizar a imagem
      const existingConfig = manager.loadCropConfig(bannerId)
      if (!existingConfig) {
        const initialCrop: CropData = {
          x: 0,
          y: 0,
          width: containerWidth,
          height: containerHeight,
          scale: 1,
          rotation: 0
        }
        setCropData(initialCrop)
        onCropChange(initialCrop)
      }
    }
  }, [bannerId, containerWidth, containerHeight, manager, onCropChange])

  // Calcular escala da imagem no container
  const getImageScale = () => {
    if (!imageLoaded) return 1
    
    const { width: imgWidth, height: imgHeight } = imageDimensions
    const scaleX = containerWidth / imgWidth
    const scaleY = containerHeight / imgHeight
    return Math.min(scaleX, scaleY)
  }

  // Converter coordenadas do mouse para coordenadas da imagem
  const getImageCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current || !imageRef.current) return { x: 0, y: 0 }
    
    const rect = containerRef.current.getBoundingClientRect()
    const scale = getImageScale()
    const imgRect = imageRef.current.getBoundingClientRect()
    
    const x = (clientX - imgRect.left) / scale
    const y = (clientY - imgRect.top) / scale
    
    return { x, y }
  }

  // Iniciar drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const coords = getImageCoordinates(e.clientX, e.clientY)
    setDragStart(coords)
  }

  // Durante o drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const coords = getImageCoordinates(e.clientX, e.clientY)
    const deltaX = coords.x - dragStart.x
    const deltaY = coords.y - dragStart.y
    
    const newCropData = {
      ...cropData,
      x: Math.max(0, Math.min(cropData.x - deltaX, imageDimensions.width - cropData.width)),
      y: Math.max(0, Math.min(cropData.y - deltaY, imageDimensions.height - cropData.height))
    }
    
    setCropData(newCropData)
    onCropChange(newCropData)
  }

  // Finalizar drag
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Atualizar escala
  const handleScaleChange = (value: number[]) => {
    const newScale = value[0]
    const newCropData = {
      ...cropData,
      scale: newScale,
      width: containerWidth / newScale,
      height: containerHeight / newScale
    }
    
    setCropData(newCropData)
    onCropChange(newCropData)
  }

  // Salvar configuração
  const handleSave = () => {
    const config: BannerConfig = {
      id: bannerId,
      src: imageSrc,
      cropData,
      containerWidth,
      containerHeight,
      imageWidth: imageDimensions.width,
      imageHeight: imageDimensions.height
    }
    
    manager.saveCropConfig(bannerId, config)
    onSave(config)
  }

  // Resetar crop
  const handleReset = () => {
    const resetCrop: CropData = {
      x: 0,
      y: 0,
      width: containerWidth,
      height: containerHeight,
      scale: 1,
      rotation: 0
    }
    
    setCropData(resetCrop)
    onCropChange(resetCrop)
  }

  return (
    <div className="space-y-4">
      {/* Preview do Crop */}
      <div 
        ref={containerRef}
        className="relative bg-gray-900 rounded-lg overflow-hidden"
        style={{ 
          width: containerWidth, 
          height: containerHeight,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {imageSrc && (
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Banner Preview"
            className="absolute top-0 left-0 w-full h-full object-contain"
            style={{
              transform: manager.calculateTransform({
                id: bannerId,
                src: imageSrc,
                cropData,
                containerWidth,
                containerHeight,
                imageWidth: imageDimensions.width,
                imageHeight: imageDimensions.height
              })
            }}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Overlay do crop */}
        <div 
          className="absolute border-2 border-red-500 bg-red-500/20"
          style={{
            left: (cropData.x / imageDimensions.width) * containerWidth,
            top: (cropData.y / imageDimensions.height) * containerHeight,
            width: (cropData.width / imageDimensions.width) * containerWidth,
            height: (cropData.height / imageDimensions.height) * containerHeight
          }}
        />
        
        {/* Indicador de carregamento */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="space-y-4">
        {/* Controle de Escala */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Zoom: {cropData.scale.toFixed(2)}x
          </label>
          <Slider
            value={[cropData.scale]}
            onValueChange={handleScaleChange}
            min={0.1}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Informações do Crop */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <span className="font-medium">X:</span> {cropData.x.toFixed(0)}px
          </div>
          <div>
            <span className="font-medium">Y:</span> {cropData.y.toFixed(0)}px
          </div>
          <div>
            <span className="font-medium">Largura:</span> {cropData.width.toFixed(0)}px
          </div>
          <div>
            <span className="font-medium">Altura:</span> {cropData.height.toFixed(0)}px
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            Salvar Crop
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Resetar
          </Button>
        </div>
      </div>
    </div>
  )
}



