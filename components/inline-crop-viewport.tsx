"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, X, Check, Crop } from "lucide-react"

interface CropMetadata {
  src: string
  ratio: string  // "1920x650"
  scale: number
  tx: number     // translateX relativo (-1..1)
  ty: number     // translateY relativo (-1..1)
}

interface InlineCropViewportProps {
  imageUrl: string
  cropMetadata?: CropMetadata
  onSave: (metadata: CropMetadata) => void
  onCancel: () => void
  bannerName: string
  bannerType?: 'hero' | 'other' // Tipo do banner para determinar proporção
  className?: string
}

export function InlineCropViewport({
  imageUrl,
  cropMetadata,
  onSave,
  onCancel,
  bannerName,
  bannerType = 'other',
  className = ""
}: InlineCropViewportProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0) // translateX relativo (-1..1)
  const [ty, setTy] = useState(0) // translateY relativo (-1..1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [history, setHistory] = useState<{scale: number, tx: number, ty: number}[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Proporção baseada no tipo de banner - usar mesma proporção da homepage
  const FIXED_RATIO = bannerType === 'hero' ? "16:9" : "1920x650"
  const aspectRatio = bannerType === 'hero' ? 16 / 9 : 1920 / 650

  // Inicializar estado baseado nos metadados existentes
  useEffect(() => {
    if (cropMetadata) {
      setScale(cropMetadata.scale)
      setTx(cropMetadata.tx)
      setTy(cropMetadata.ty)
    } else {
      // Calcular scale inicial para cobrir todo o viewport
      const initialScale = calculateInitialScale()
      setScale(initialScale)
      setTx(0)
      setTy(0)
    }
  }, [cropMetadata, imageDimensions])

  // Carregar imagem e obter dimensões
  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      setImageLoaded(true)
    }
    img.src = imageUrl
  }, [imageUrl])

  // Calcular scale inicial para mostrar a imagem inteira
  const calculateInitialScale = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) return 1
    
    if (bannerType === 'hero') {
      // Para Hero: usar proporção 16:9 (1920x1080) - mostrar imagem inteira
      const containerWidth = 1920
      const containerHeight = 1080
      
      const scaleX = containerWidth / imageDimensions.width
      const scaleY = containerHeight / imageDimensions.height
      
      // Usar o MENOR scale para mostrar imagem inteira (contain)
      return Math.min(scaleX, scaleY)
    } else {
      // Para outros banners: usar proporção fixa 1920x650 - mostrar imagem inteira
      const viewportWidth = 1920
      const viewportHeight = 650
      
      const scaleX = viewportWidth / imageDimensions.width
      const scaleY = viewportHeight / imageDimensions.height
      
      // Usar o MENOR scale para mostrar imagem inteira (contain)
      return Math.min(scaleX, scaleY)
    }
  }, [imageDimensions, bannerType])

  // Adicionar estado ao histórico
  const addToHistory = useCallback((newState: {scale: number, tx: number, ty: number}) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Eventos de mouse para arrastar
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isEditing) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    // Converter pixels para valores relativos (-1..1)
    const containerWidth = containerRef.current?.clientWidth || 400
    const containerHeight = containerRef.current?.clientHeight || 300
    
    // Movimento intuitivo: arrasta para onde quer que a imagem vá
    const newTx = Math.max(-2, Math.min(2, tx + (deltaX / containerWidth) * 2))
    const newTy = Math.max(-2, Math.min(2, ty + (deltaY / containerHeight) * 2))
    
    setTx(newTx)
    setTy(newTy)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      addToHistory({ scale, tx, ty })
      setIsDragging(false)
    }
  }

  // Eventos de touch para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEditing) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isEditing) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    
    const containerWidth = containerRef.current?.clientWidth || 400
    const containerHeight = containerRef.current?.clientHeight || 300
    
    // Movimento intuitivo: arrasta para onde quer que a imagem vá
    const newTx = Math.max(-2, Math.min(2, tx + (deltaX / containerWidth) * 2))
    const newTy = Math.max(-2, Math.min(2, ty + (deltaY / containerHeight) * 2))
    
    setTx(newTx)
    setTy(newTy)
    setDragStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      addToHistory({ scale, tx, ty })
      setIsDragging(false)
    }
  }

  // Zoom com scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (!isEditing) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.05 : 0.05 // Zoom mais suave
    const minScale = 0.1 // Permitir zoom bem pequeno
    const maxScale = 2.0 // Zoom máximo mais razoável
    const newScale = Math.max(minScale, Math.min(maxScale, scale + delta))
    
    if (newScale !== scale) {
      addToHistory({ scale, tx, ty })
      setScale(newScale)
    }
  }

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return
      
      switch (e.key) {
        case 'Escape':
          handleCancel()
          break
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) {
              // Refazer
              if (historyIndex < history.length - 1) {
                const nextState = history[historyIndex + 1]
                setScale(nextState.scale)
                setTx(nextState.tx)
                setTy(nextState.ty)
                setHistoryIndex(historyIndex + 1)
              }
            } else {
              // Desfazer
              if (historyIndex > 0) {
                const prevState = history[historyIndex - 1]
                setScale(prevState.scale)
                setTx(prevState.tx)
                setTy(prevState.ty)
                setHistoryIndex(historyIndex - 1)
              }
            }
          }
          break
      }
    }

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, history, historyIndex])

  // Iniciar edição
  const startEditing = () => {
    setIsEditing(true)
    setHistory([{ scale, tx, ty }])
    setHistoryIndex(0)
  }

  // Cancelar edição
  const handleCancel = () => {
    if (cropMetadata) {
      setScale(cropMetadata.scale)
      setTx(cropMetadata.tx)
      setTy(cropMetadata.ty)
    } else {
      const initialScale = calculateInitialScale()
      setScale(initialScale)
      setTx(0)
      setTy(0)
    }
    setIsEditing(false)
    setHistory([])
    setHistoryIndex(-1)
    onCancel()
  }

  // Resetar para estado inicial
  const resetCrop = () => {
    const initialScale = calculateInitialScale()
    setScale(initialScale)
    setTx(0)
    setTy(0)
    addToHistory({ scale, tx, ty })
  }

  // Salvar metadados
  const handleSave = () => {
    if (!imageLoaded) return
    
    const metadata: CropMetadata = {
      src: imageUrl,
      ratio: FIXED_RATIO,
      scale,
      tx,
      ty
    }
    
    onSave(metadata)
    setIsEditing(false)
    setHistory([])
    setHistoryIndex(-1)
  }

  // Double click para resetar
  const handleDoubleClick = () => {
    if (isEditing) {
      resetCrop()
    }
  }

  // Calcular transform CSS - usar mesma lógica do BannerRendererV2
  const transformStyle = {
    transform: `translate3d(${tx * 50}%, ${ty * 50}%, 0) scale(${scale})`,
    willChange: 'transform'
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              onClick={startEditing}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-400 hover:bg-blue-900"
            >
              <Crop className="h-4 w-4 mr-1" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={resetCrop}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Resetar
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}
        </div>
        
        {isEditing && (
          <div className="text-xs text-gray-400">
            Esc: cancelar • Ctrl+Z: desfazer • DblClick: resetar
          </div>
        )}
      </div>

      {/* Preview */}
      <div 
        ref={containerRef}
        className={`relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl ${
          isEditing ? 'cursor-move' : ''
        }`}
        style={{ aspectRatio: aspectRatio }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        tabIndex={isEditing ? 0 : -1}
        aria-label={isEditing ? `Editando recorte do ${bannerName}` : `Preview do ${bannerName}`}
      >
        {imageLoaded && (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={bannerName}
            className="absolute inset-0"
            style={{
              ...transformStyle,
              width: '100%',
              height: '100%',
              objectFit: 'contain', // Todos os banners mostram a imagem inteira
              objectPosition: 'center'
            }}
            draggable={false}
          />
        )}
        
        {/* Overlay de edição */}
        {isEditing && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Grade 3x3 (regra dos terços) */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30"></div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30"></div>
            
            {/* Indicador de modo de edição */}
            <div className="absolute top-2 left-2 bg-blue-600/90 text-white px-2 py-1 rounded text-xs font-medium">
              Modo de Edição
            </div>
            
            {/* Informações de zoom */}
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {Math.round(scale * 100)}%
            </div>
          </div>
        )}
        
        {/* Indicador de tipo de mídia */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/20">
          Imagem
        </div>
      </div>

      {/* Dicas */}
      {isEditing && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300 text-center">
            Arraste para mover • Scroll para zoom • Proporção: {FIXED_RATIO} {bannerType === 'hero' ? '(16:9)' : '(≈2.95:1)'}
          </p>
        </div>
      )}

      {/* Status do recorte */}
      {cropMetadata && !isEditing && (
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-300 text-center">
            ✅ Recorte configurado • X: {Math.round(cropMetadata.tx * 100)}% • Y: {Math.round(cropMetadata.ty * 100)}% • Zoom: {Math.round(cropMetadata.scale * 100)}% • Proporção: {cropMetadata.ratio}
          </p>
        </div>
      )}
    </div>
  )
}
