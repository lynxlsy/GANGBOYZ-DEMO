import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, RotateCcw, X, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Banner, UploadResponse, BannerUpdatePayload } from '@/lib/banner-types'
import { uploadFile, updateBanner, BannerBroadcastChannel } from '@/hooks/use-banners'

interface InlineCropViewportProps {
  banner: Banner
  onBannerUpdate: (banner: Banner) => void
  className?: string
}

export function InlineCropViewport({ banner, onBannerUpdate, className = "" }: InlineCropViewportProps) {
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
  const [isSaving, setIsSaving] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const broadcastChannel = useRef<BannerBroadcastChannel | null>(null)

  // Proporção fixa: 1920x650 (≈2.95:1)
  const FIXED_RATIO = "1920x650"
  const aspectRatio = 1920 / 650 // ≈ 2.95

  // Inicializar estado baseado no banner
  useEffect(() => {
    if (banner) {
      setScale(banner.scale)
      setTx(banner.tx)
      setTy(banner.ty)
    }
  }, [banner])

  // Carregar dimensões da imagem
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      setImageLoaded(true)
    }
    img.src = banner.src
  }, [banner.src])

  // Inicializar BroadcastChannel
  useEffect(() => {
    broadcastChannel.current = new BannerBroadcastChannel()
    return () => {
      broadcastChannel.current?.close()
    }
  }, [])

  // Calcular scale inicial para cobrir todo o viewport (1920x650)
  const calculateInitialScale = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) return 1
    
    const viewportWidth = 1920
    const viewportHeight = 650
    
    const scaleX = viewportWidth / imageDimensions.width
    const scaleY = viewportHeight / imageDimensions.height
    
    // Usar o maior scale para cobrir todo o viewport
    return Math.max(scaleX, scaleY)
  }, [imageDimensions])

  // Adicionar estado ao histórico
  const addToHistory = useCallback((newState: {scale: number, tx: number, ty: number}) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setScale(prevState.scale)
      setTx(prevState.tx)
      setTy(prevState.ty)
      setHistoryIndex(historyIndex - 1)
    }
  }, [history, historyIndex])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setScale(nextState.scale)
      setTx(nextState.tx)
      setTy(nextState.ty)
      setHistoryIndex(historyIndex + 1)
    }
  }, [history, historyIndex])

  // Resetar para estado inicial
  const reset = useCallback(() => {
    const initialScale = calculateInitialScale()
    setScale(initialScale)
    setTx(0)
    setTy(0)
    setHistory([])
    setHistoryIndex(-1)
  }, [calculateInitialScale])

  // Cancelar edição
  const cancel = useCallback(() => {
    if (banner) {
      setScale(banner.scale)
      setTx(banner.tx)
      setTy(banner.ty)
    }
    setIsEditing(false)
    setHistory([])
    setHistoryIndex(-1)
  }, [banner])

  // Salvar alterações
  const handleSave = async () => {
    if (!imageLoaded) return
    
    setIsSaving(true)
    try {
      const payload: BannerUpdatePayload = {
        src: banner.src,
        mime: banner.mime,
        naturalWidth: banner.naturalWidth,
        naturalHeight: banner.naturalHeight,
        scale,
        tx,
        ty
      }

      const updatedBanner = await updateBanner(banner.id, payload)
      
      // Atualizar estado local
      onBannerUpdate(updatedBanner)
      
      // Disparar broadcast
      broadcastChannel.current?.broadcast(banner.id, updatedBanner.version)
      
      setIsEditing(false)
      setHistory([])
      setHistoryIndex(-1)
      
      toast.success("Banner publicado com sucesso!")
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
      toast.error("Erro ao salvar banner")
    } finally {
      setIsSaving(false)
    }
  }

  // Upload de arquivo
  const handleFileUpload = async (file: File) => {
    try {
      const uploadResult: UploadResponse = await uploadFile(file)
      
      // Atualizar banner com nova imagem
      const updatedBanner: Banner = {
        ...banner,
        src: uploadResult.url,
        mime: uploadResult.mime,
        naturalWidth: uploadResult.width,
        naturalHeight: uploadResult.height,
        scale: calculateInitialScale(),
        tx: 0,
        ty: 0,
        version: banner.version + 1,
        published: true,
        updatedAt: new Date().toISOString()
      }
      
      onBannerUpdate(updatedBanner)
      
      // Resetar estado de edição
      setScale(updatedBanner.scale)
      setTx(0)
      setTy(0)
      setHistory([])
      setHistoryIndex(-1)
      
      toast.success("Imagem carregada com sucesso!")
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error("Erro ao carregar imagem")
    }
  }

  // Eventos de mouse/touch
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
    
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (containerRect) {
      const newTx = tx + (deltaX / containerRect.width) * 2
      const newTy = ty + (deltaY / containerRect.height) * 2
      
      // Limitar movimento para não mostrar áreas vazias
      const maxTx = Math.max(0, (scale * imageDimensions.width - 1920) / 2)
      const maxTy = Math.max(0, (scale * imageDimensions.height - 650) / 2)
      
      setTx(Math.max(-maxTx, Math.min(maxTx, newTx)))
      setTy(Math.max(-maxTy, Math.min(maxTy, newTy)))
    }
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      addToHistory({ scale, tx, ty })
      setIsDragging(false)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!isEditing) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.5, Math.min(3, scale + delta))
    
    if (newScale !== scale) {
      setScale(newScale)
      addToHistory({ scale: newScale, tx, ty })
    }
  }

  // Eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return
      
      if (e.key === 'Escape') {
        cancel()
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undo()
        } else if (e.key === 'z' && e.shiftKey) {
          e.preventDefault()
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, cancel, undo, redo])

  // Double click para reset
  const handleDoubleClick = () => {
    if (isEditing) {
      reset()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Container */}
      <div 
        ref={containerRef}
        className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
        style={{ aspectRatio: `${aspectRatio}` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        {/* Imagem */}
        <img
          ref={imageRef}
          src={`${banner.src}?v=${banner.version}`}
          alt="Banner Preview"
          className="absolute inset-0"
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: `translate3d(${tx * 25}%, ${ty * 25}%, 0) scale(${scale})`,
            transformOrigin: 'center',
            willChange: 'transform',
            cursor: isEditing ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        />

        {/* Overlay de edição */}
        {isEditing && (
          <>
            {/* Grid 3x3 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="grid grid-cols-3 grid-rows-3 h-full">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>

            {/* Safe area */}
            <div className="absolute inset-4 border-2 border-yellow-400/50 rounded-lg pointer-events-none" />
          </>
        )}

        {/* Controles de upload */}
        {!isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Upload className="h-4 w-4" />
              Trocar Imagem
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm"
            >
              Editar
            </Button>
          ) : (
            <>
              <Button
                onClick={reset}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
              <Button
                onClick={cancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          )}
        </div>

        {/* Status */}
        <div className="text-sm text-gray-400">
          Versão {banner.version} • {banner.published ? 'Publicado' : 'Rascunho'}
        </div>
      </div>

      {/* Dicas */}
      {isEditing && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300 text-center">
            Arraste para mover • Scroll para zoom • Proporção: {FIXED_RATIO} (≈2.95:1)
          </p>
        </div>
      )}

      {/* Status do recorte */}
      {!isEditing && banner.scale !== 1 && (
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-300 text-center">
            ✅ Recorte configurado • X: {Math.round(banner.tx * 100)}% • Y: {Math.round(banner.ty * 100)}% • Zoom: {Math.round(banner.scale * 100)}% • Proporção: {banner.ratio}
          </p>
        </div>
      )}
    </div>
  )
}
