"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Save, RefreshCw, Trash2, Settings, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { BannerConfig, BANNER_CONFIGS, BANNER_STRIP_CONFIGS } from "@/lib/banner-config"
import { BannerData, BannerStripData } from "@/hooks/use-banner"
import { BannerAdminMobile } from "@/components/banner-admin-mobile"
import { HomepageBannersAdmin } from "@/components/homepage-banners-admin"
import { useMobile } from "@/hooks/use-mobile"

interface BannerAdminProps {
  storageKey: string
  eventName: string
  bannerConfigs: BannerConfig[]
  stripConfig?: typeof BANNER_STRIP_CONFIGS.homepage | typeof BANNER_STRIP_CONFIGS.categoryPages
  showCategoryStrip?: boolean
}

export function BannerAdmin({ storageKey, eventName, bannerConfigs, stripConfig, showCategoryStrip = false }: BannerAdminProps) {
  const isMobile = useMobile()
  const [banners, setBanners] = useState<BannerData[]>([])
  const [loading, setLoading] = useState(false)
  const [editingBanner, setEditingBanner] = useState<string | null>(null)
  const [cropData, setCropData] = useState<{x: number, y: number, scale: number}>({x: 0, y: 0, scale: 1})

  // Helper function to calculate scale factor based on banner type and viewport
  const calculateScaleFactor = (bannerId: string) => {
    const editorWidth = 280
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    
    const config = bannerConfigs.find(c => c.id === bannerId)
    let realBannerWidth = viewportWidth
    
    if (config) {
      const aspectRatio = config.aspectRatio.includes(':') 
        ? config.aspectRatio.split(':').map(Number).reduce((a, b) => a / b)
        : parseFloat(config.aspectRatio)
      
      if (bannerId.includes('hero')) {
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
        realBannerWidth = viewportHeight * aspectRatio
      } else {
        realBannerWidth = viewportWidth
      }
    }
    
    const responsiveEditorWidth = Math.min(280, viewportWidth * 0.8)
    
    return {
      scaleFactor: realBannerWidth / responsiveEditorWidth,
      inverseScaleFactor: responsiveEditorWidth / realBannerWidth,
      realBannerWidth,
      viewportWidth,
      editorWidth: responsiveEditorWidth
    }
  }
  
  // Estados para faixa de aviso
  const [stripData, setStripData] = useState<BannerStripData | null>(null)
  const [stripSaving, setStripSaving] = useState(false)
  const [stripSaved, setStripSaved] = useState(false)
  
  // Estados para faixa de categorias
  const [categoryStripData, setCategoryStripData] = useState<BannerStripData | null>(null)
  const [categoryStripSaving, setCategoryStripSaving] = useState(false)
  const [categoryStripSaved, setCategoryStripSaved] = useState(false)

  useEffect(() => {
    loadBanners()
    if (stripConfig) {
      loadStripData()
    }
    if (showCategoryStrip) {
      loadCategoryStripData()
    }
  }, [])

  const loadBanners = () => {
    try {
      const savedBanners = localStorage.getItem(storageKey)
      if (savedBanners) {
        const parsedBanners: BannerData[] = JSON.parse(savedBanners)
        const correctedBanners = parsedBanners.map(banner => {
          const config = bannerConfigs.find(c => c.id === banner.id)
          if (config && (banner.currentImage === "/banner-footer.svg" || banner.currentImage === "/banner-template-1891x100.jpg")) {
            return { ...banner, currentImage: config.defaultImage }
          }
          return banner
        })
        setBanners(correctedBanners)
        localStorage.setItem(storageKey, JSON.stringify(correctedBanners))
      } else {
        const defaultBanners: BannerData[] = bannerConfigs.map(config => ({
          id: config.id,
          name: config.name,
          description: config.description,
          currentImage: config.defaultImage,
          mediaType: 'image',
          dimensions: config.dimensions,
          format: config.mediaTypes.join(', '),
          position: config.position
        }))
        setBanners(defaultBanners)
        localStorage.setItem(storageKey, JSON.stringify(defaultBanners))
      }
    } catch (error) {
      console.error("Erro ao carregar banners:", error)
      toast.error("Erro ao carregar banners")
    }
  }

  const loadStripData = () => {
    if (!stripConfig) return
    
    try {
      const savedData = stripConfig ? localStorage.getItem(stripConfig.storageKey) : null
      if (savedData) {
        setStripData(JSON.parse(savedData))
      } else {
        setStripData(stripConfig?.defaultSettings || { isActive: false, text: '', emoji: '', bgColor: 'black', height: 38, speed: 50, repetitions: 4 })
      }
    } catch (error) {
      console.error("Erro ao carregar dados da faixa:", error)
    }
  }

  const loadCategoryStripData = () => {
    try {
      const savedData = localStorage.getItem(BANNER_STRIP_CONFIGS.categoryPages.storageKey)
      if (savedData) {
        setCategoryStripData(JSON.parse(savedData))
      } else {
        setCategoryStripData(BANNER_STRIP_CONFIGS.categoryPages.defaultSettings)
      }
    } catch (error) {
      console.error("Erro ao carregar dados da faixa de categorias:", error)
    }
  }

  const handleFileUpload = async (bannerId: string, file: File) => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const { url } = await response.json()
      
      const updatedBanners = banners.map(banner => 
        banner.id === bannerId 
          ? { ...banner, currentImage: url }
          : banner
      )
      
      setBanners(updatedBanners)
      localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
      window.dispatchEvent(new CustomEvent(eventName))
      
      toast.success("Banner atualizado com sucesso!")
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro ao fazer upload do banner")
    } finally {
      setLoading(false)
    }
  }

  const handleCropSave = (bannerId: string, metadata: any) => {
    
    const { scaleFactor, editorWidth } = calculateScaleFactor(bannerId)
    
    // Normalizar os dados de crop e aplicar o fator de escala
    const normalizedMetadata = {
      tx: Math.round((metadata.x || metadata.tx || 0) * scaleFactor),
      ty: Math.round((metadata.y || metadata.ty || 0) * scaleFactor),
      scale: metadata.scale || 1
    }
    
    console.log('Editor position:', {x: metadata.x, y: metadata.y})
    console.log('Editor width:', editorWidth)
    console.log('Scale factor:', scaleFactor)
    console.log('Real banner position:', {tx: normalizedMetadata.tx, ty: normalizedMetadata.ty})
    
    const updatedBanners = banners.map(banner => 
      banner.id === bannerId 
        ? { ...banner, cropMetadata: normalizedMetadata as any }
        : banner
    )
    
    console.log('Banners atualizados:', updatedBanners)
    setBanners(updatedBanners)
    localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
    console.log('Disparando evento:', eventName)
    window.dispatchEvent(new CustomEvent(eventName))
    
    toast.success("Recorte salvo com sucesso!")
  }

  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    setBanners(updatedBanners)
    localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
    window.dispatchEvent(new CustomEvent(eventName))
    toast.success("Banner excluído com sucesso!")
  }

  const handleStripSave = async () => {
    if (!stripConfig || !stripData) return
    
    setStripSaving(true)
    
    try {
      if (stripConfig) {
        localStorage.setItem(stripConfig.storageKey, JSON.stringify(stripData))
        window.dispatchEvent(new CustomEvent(stripConfig.eventName))
      }
      
      setStripSaving(false)
      setStripSaved(true)
      
      setTimeout(() => {
        setStripSaved(false)
      }, 2000)
      
      toast.success("Configurações da faixa salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar faixa:", error)
      toast.error("Erro ao salvar configurações")
      setStripSaving(false)
    }
  }

  const handleCategoryStripSave = async () => {
    if (!categoryStripData) return
    
    setCategoryStripSaving(true)
    
    try {
      localStorage.setItem(BANNER_STRIP_CONFIGS.categoryPages.storageKey, JSON.stringify(categoryStripData))
      window.dispatchEvent(new CustomEvent(BANNER_STRIP_CONFIGS.categoryPages.eventName))
      
      setCategoryStripSaving(false)
      setCategoryStripSaved(true)
      
      setTimeout(() => {
        setCategoryStripSaved(false)
      }, 2000)
      
      toast.success("Configurações da faixa de categorias salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar faixa de categorias:", error)
      toast.error("Erro ao salvar configurações")
      setCategoryStripSaving(false)
    }
  }

  const forceReload = () => {
    localStorage.removeItem(storageKey)
    loadBanners()
    if (stripConfig) {
      loadStripData()
    }
    if (showCategoryStrip) {
      loadCategoryStripData()
    }
    toast.success("Dados atualizados com sucesso!")
  }

  // Se for mobile, renderizar versão mobile
  if (isMobile) {
    // For homepage banners, use the new component
    if (storageKey === "gang-boyz-homepage-banners") {
      return (
        <div className="w-full">
          <HomepageBannersAdmin
            storageKey={storageKey}
            eventName={eventName}
            bannerConfigs={bannerConfigs}
            stripConfig={stripConfig}
            showCategoryStrip={showCategoryStrip}
          />
        </div>
      )
    }
    
    return (
      <BannerAdminMobile
        storageKey={storageKey}
        eventName={eventName}
        bannerConfigs={bannerConfigs}
        stripConfig={stripConfig}
        showCategoryStrip={showCategoryStrip}
      />
    )
  }

  // For homepage banners on desktop, use the new component
  if (storageKey === "gang-boyz-homepage-banners") {
    return (
      <div className="w-full">
        <HomepageBannersAdmin
          storageKey={storageKey}
          eventName={eventName}
          bannerConfigs={bannerConfigs}
          stripConfig={stripConfig}
          showCategoryStrip={showCategoryStrip}
        />
      </div>
    )
  }

  // Versão desktop original
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-slate-200 overflow-hidden max-w-full">
      {/* Header com estatísticas - Otimizado para mobile */}
      <div className="flex flex-col gap-4">
        {/* Título e estatísticas */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Painel de Banners</h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600">Gerencie todos os banners do site</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-center sm:text-right">
              <p className="text-xs sm:text-sm text-slate-600">Total de Banners</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">{banners.length}</p>
            </div>
          </div>
        </div>
        
        {/* Botões de ação - Layout mobile otimizado */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full overflow-x-auto pb-2 sm:pb-0">
            <Button
              onClick={forceReload}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm h-10 sm:h-8 w-full sm:w-auto min-w-fit flex-shrink-0"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Atualizar</span>
              <span className="sm:hidden">Atualizar</span>
            </Button>
            <Button
              onClick={() => {
                // Forçar atualização do cache
                window.dispatchEvent(new CustomEvent('forceBannerSync', {
                  detail: { 
                    timestamp: Date.now(),
                    cacheBust: true,
                    forceRefresh: true
                  }
                }))
                toast.success("🔄 Cache atualizado! Recarregando imagens...", { duration: 3000 })
              }}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm h-10 sm:h-8 w-full sm:w-auto min-w-fit flex-shrink-0"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Forçar Cache</span>
              <span className="sm:hidden">Cache</span>
            </Button>
          </div>
        </div>

      {/* Instruções de Sincronização */}
      <div className="space-y-4">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 w-full h-9 px-4 py-2 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          Como Sincronizar com Firebase
        </button>
      </div>

      {/* Faixa de Aviso */}
      {stripConfig && stripData && (
        <div className="bg-gray-100 rounded-xl md:rounded-2xl shadow-lg border border-gray-300 overflow-hidden max-w-full">
          <div className="bg-gray-200 p-4 md:p-6 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-300 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{stripConfig?.name || 'Faixa de Aviso'}</h3>
                  <p className="text-gray-600">Configure a faixa de aviso superior</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Label htmlFor="strip-active" className="text-gray-700 font-medium">Ativo</Label>
                <div className="relative">
                  <input
                    id="strip-active"
                    type="checkbox"
                    checked={stripData?.isActive || false}
                    onChange={(e) => {
                      if (!stripData) return
                      const newData = { ...stripData, isActive: e.target.checked }
                      setStripData(newData)
                      // Salvar automaticamente
                      if (stripConfig) {
                        localStorage.setItem(stripConfig.storageKey, JSON.stringify(newData))
                        window.dispatchEvent(new CustomEvent(stripConfig.eventName))
                      }
                    }}
                    className="sr-only"
                  />
                  <label
                    htmlFor="strip-active"
                    className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer block ${
                      stripData?.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 mt-0.5 ${
                      stripData?.isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="strip-text" className="text-gray-800 font-medium">Texto da Faixa</Label>
                <Input
                  id="strip-text"
                  value={stripData?.text || ''}
                  onChange={(e) => {
                    if (!stripData) return
                    setStripData({ ...stripData, text: e.target.value })
                  }}
                  placeholder="Digite o texto da faixa"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strip-emoji" className="text-gray-800 font-medium">Emoji</Label>
                <Input
                  id="strip-emoji"
                  value={stripData?.emoji || ''}
                  onChange={(e) => {
                    if (!stripData) return
                    setStripData({ ...stripData, emoji: e.target.value })
                  }}
                  placeholder="🎯"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strip-bg" className="text-gray-800 font-medium">Cor de Fundo</Label>
                <select
                  id="strip-bg"
                  value={stripData?.bgColor || 'black'}
                  onChange={(e) => {
                    if (!stripData) return
                    setStripData({ ...stripData, bgColor: e.target.value })
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                >
                  <option value="black">Preto</option>
                  <option value="red">Vermelho</option>
                  <option value="blue">Azul</option>
                  <option value="green">Verde</option>
                  <option value="purple">Roxo</option>
                  <option value="orange">Laranja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="strip-height" className="text-gray-800 font-medium">Altura (px)</Label>
                <Input
                  id="strip-height"
                  type="number"
                  value={stripData?.height || 38}
                  onChange={(e) => {
                    if (!stripData) return
                    setStripData({ ...stripData, height: parseInt(e.target.value) })
                  }}
                  min="20"
                  max="100"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strip-speed" className="text-gray-800 font-medium">Velocidade</Label>
                <Input
                  id="strip-speed"
                  type="number"
                  value={stripData?.speed || 50}
                  onChange={(e) => {
                    if (!stripData) return
                    setStripData({ ...stripData, speed: parseInt(e.target.value) })
                  }}
                  min="10"
                  max="100"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strip-repetitions" className="text-gray-800 font-medium">Repetições</Label>
                <Input
                  id="strip-repetitions"
                  type="number"
                  value={stripData?.repetitions || 4}
                  onChange={(e) => {
                    if (!stripData) return
                    setStripData({ ...stripData, repetitions: parseInt(e.target.value) })
                  }}
                  min="1"
                  max="10"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Preview da Faixa de Aviso */}
            <div className="space-y-3">
              <Label className="text-gray-800 font-medium">Preview da Faixa</Label>
              <div
                className={`overflow-hidden rounded-xl border-2 border-dashed border-gray-400 w-full max-w-full ${
                  stripData?.bgColor === 'black' ? 'bg-black' :
                  stripData?.bgColor === 'red' ? 'bg-red-500' :
                  stripData?.bgColor === 'blue' ? 'bg-blue-500' :
                  stripData?.bgColor === 'green' ? 'bg-green-500' :
                  stripData?.bgColor === 'purple' ? 'bg-purple-500' :
                  stripData?.bgColor === 'orange' ? 'bg-orange-500' : 'bg-black'
                }`}
                style={{ height: `${stripData?.height || 38}px` }}
              >
                <div
                  className="flex items-center h-full font-bold text-xs sm:text-sm tracking-wider whitespace-nowrap text-white w-full overflow-x-auto"
                  style={{
                    animation: `${stripData?.speed || 50}s linear 0s infinite normal none running scroll`
                  }}
                >
                  {Array.from({ length: stripData?.repetitions || 4 }, (_, i) => (
                    <span key={i} className="mr-8 sm:mr-12 md:mr-16 flex-shrink-0">
                      {stripData?.emoji && <span className="mr-1 sm:mr-2">{stripData.emoji}</span>}
                      {stripData?.text || 'SITE DEMONSTRATIVO'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleStripSave}
              disabled={stripSaving || stripSaved}
              className={`w-full text-white transition-all duration-200 ${
                stripSaved
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700 hover:scale-105 hover:shadow-lg active:scale-95'
              }`}
              style={{
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseDown={(e) => {
                if (stripSaved) return
                const button = e.currentTarget
                const ripple = document.createElement('span')
                const rect = button.getBoundingClientRect()
                const size = Math.max(rect.width, rect.height)
                const x = e.clientX - rect.left - size / 2
                const y = e.clientY - rect.top - size / 2

                ripple.style.width = ripple.style.height = size + 'px'
                ripple.style.left = x + 'px'
                ripple.style.top = y + 'px'
                ripple.style.position = 'absolute'
                ripple.style.borderRadius = '50%'
                ripple.style.background = 'rgba(255, 255, 255, 0.3)'
                ripple.style.transform = 'scale(0)'
                ripple.style.animation = 'ripple 0.6s linear'
                ripple.style.pointerEvents = 'none'

                button.appendChild(ripple)

                setTimeout(() => {
                  ripple.remove()
                }, 600)
              }}
            >
              {stripSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : stripSaved ? (
                <>
                  <svg className="h-4 w-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Faixa de Aviso das Categorias */}
      {showCategoryStrip && categoryStripData && (
        <div className="bg-gray-100 rounded-xl md:rounded-2xl shadow-lg border border-gray-300 overflow-hidden max-w-full">
          <div className="bg-gray-200 p-4 md:p-6 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-300 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{BANNER_STRIP_CONFIGS.categoryPages.name}</h3>
                  <p className="text-gray-600">Configure a faixa das páginas de categoria</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Label htmlFor="category-strip-active" className="text-gray-700 font-medium">Ativo</Label>
                <div className="relative">
                  <input
                    id="category-strip-active"
                    type="checkbox"
                    checked={categoryStripData?.isActive || false}
                    onChange={(e) => {
                      if (!categoryStripData) return
                      const newData = { ...categoryStripData, isActive: e.target.checked }
                      setCategoryStripData(newData)
                      // Salvar automaticamente
                      localStorage.setItem(BANNER_STRIP_CONFIGS.categoryPages.storageKey, JSON.stringify(newData))
                      window.dispatchEvent(new CustomEvent(BANNER_STRIP_CONFIGS.categoryPages.eventName))
                    }}
                    className="sr-only"
                  />
                  <label
                    htmlFor="category-strip-active"
                    className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer block ${
                      categoryStripData?.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 mt-0.5 ${
                      categoryStripData?.isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="category-strip-text" className="text-gray-800 font-medium">Texto da Faixa</Label>
                <Input
                  id="category-strip-text"
                  value={categoryStripData?.text || ''}
                  onChange={(e) => {
                    if (!categoryStripData) return
                    setCategoryStripData({ ...categoryStripData, text: e.target.value })
                  }}
                  placeholder="Digite o texto da faixa"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-strip-emoji" className="text-gray-800 font-medium">Emoji</Label>
                <Input
                  id="category-strip-emoji"
                  value={categoryStripData?.emoji || ''}
                  onChange={(e) => {
                    if (!categoryStripData) return
                    setCategoryStripData({ ...categoryStripData, emoji: e.target.value })
                  }}
                  placeholder="🎯"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-strip-bg" className="text-gray-800 font-medium">Cor de Fundo</Label>
                <select
                  id="category-strip-bg"
                  value={categoryStripData?.bgColor || 'black'}
                  onChange={(e) => {
                    if (!categoryStripData) return
                    setCategoryStripData({ ...categoryStripData, bgColor: e.target.value })
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                >
                  <option value="black">Preto</option>
                  <option value="red">Vermelho</option>
                  <option value="blue">Azul</option>
                  <option value="green">Verde</option>
                  <option value="purple">Roxo</option>
                  <option value="orange">Laranja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="category-strip-height" className="text-gray-800 font-medium">Altura (px)</Label>
                <Input
                  id="category-strip-height"
                  type="number"
                  value={categoryStripData?.height || 38}
                  onChange={(e) => {
                    if (!categoryStripData) return
                    setCategoryStripData({ ...categoryStripData, height: parseInt(e.target.value) })
                  }}
                  min="20"
                  max="100"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-strip-speed" className="text-gray-800 font-medium">Velocidade</Label>
                <Input
                  id="category-strip-speed"
                  type="number"
                  value={categoryStripData?.speed || 50}
                  onChange={(e) => {
                    if (!categoryStripData) return
                    setCategoryStripData({ ...categoryStripData, speed: parseInt(e.target.value) })
                  }}
                  min="10"
                  max="100"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-strip-repetitions" className="text-gray-800 font-medium">Repetições</Label>
                <Input
                  id="category-strip-repetitions"
                  type="number"
                  value={categoryStripData?.repetitions || 4}
                  onChange={(e) => {
                    if (!categoryStripData) return
                    setCategoryStripData({ ...categoryStripData, repetitions: parseInt(e.target.value) })
                  }}
                  min="1"
                  max="10"
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Preview da Faixa de Categorias */}
            <div className="space-y-3">
              <Label className="text-gray-800 font-medium">Preview da Faixa</Label>
              <div
                className={`overflow-hidden rounded-xl border-2 border-dashed border-gray-400 w-full max-w-full ${
                  categoryStripData?.bgColor === 'black' ? 'bg-black' :
                  categoryStripData?.bgColor === 'red' ? 'bg-red-500' :
                  categoryStripData?.bgColor === 'blue' ? 'bg-blue-500' :
                  categoryStripData?.bgColor === 'green' ? 'bg-green-500' :
                  categoryStripData?.bgColor === 'purple' ? 'bg-purple-500' :
                  categoryStripData?.bgColor === 'orange' ? 'bg-orange-500' : 'bg-black'
                }`}
                style={{ height: `${categoryStripData?.height || 38}px` }}
              >
                <div
                  className="flex items-center h-full font-bold text-xs sm:text-sm tracking-wider whitespace-nowrap text-white w-full overflow-x-auto"
                  style={{
                    animation: `${categoryStripData?.speed || 50}s linear 0s infinite normal none running scroll`
                  }}
                >
                  {Array.from({ length: categoryStripData?.repetitions || 4 }, (_, i) => (
                    <span key={i} className="mr-8 sm:mr-12 md:mr-16 flex-shrink-0">
                      {categoryStripData?.emoji && <span className="mr-1 sm:mr-2">{categoryStripData.emoji}</span>}
                      {categoryStripData?.text || 'SITE DEMONSTRATIVO'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleCategoryStripSave}
              disabled={categoryStripSaving || categoryStripSaved}
              className={`w-full text-white transition-all duration-200 ${
                categoryStripSaved
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700 hover:scale-105 hover:shadow-lg active:scale-95'
              }`}
              style={{
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseDown={(e) => {
                if (categoryStripSaved) return
                const button = e.currentTarget
                const ripple = document.createElement('span')
                const rect = button.getBoundingClientRect()
                const size = Math.max(rect.width, rect.height)
                const x = e.clientX - rect.left - size / 2
                const y = e.clientY - rect.top - size / 2

                ripple.style.width = ripple.style.height = size + 'px'
                ripple.style.left = x + 'px'
                ripple.style.top = y + 'px'
                ripple.style.position = 'absolute'
                ripple.style.borderRadius = '50%'
                ripple.style.background = 'rgba(255, 255, 255, 0.3)'
                ripple.style.transform = 'scale(0)'
                ripple.style.animation = 'ripple 0.6s linear'
                ripple.style.pointerEvents = 'none'

                button.appendChild(ripple)

                setTimeout(() => {
                  ripple.remove()
                }, 600)
              }}
            >
              {categoryStripSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : categoryStripSaved ? (
                <>
                  <svg className="h-4 w-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Banners */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-300 rounded-lg">
              <ImageIcon className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Banners Principais</h3>
          </div>
          <Button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar todos os dados locais? Isso irá remover todas as personalizações feitas, incluindo banners, cards, categorias, cookies e ferramentas de desenvolvedor.')) {
                // Clear all localStorage keys related to the app
                const keysToClear = [
                  'gang-boyz-categories',
                  'gang-boyz-standalone-products',
                  'gang-boyz-hot-products',
                  'gang-boyz-recommendations',
                  'gang-boyz-test-products',
                  'gang-boyz-products',
                  'gang-boyz-editable-contents',
                  'gang-boyz-active-theme',
                  'gang-boyz-about-info',
                  'gang-boyz-homepage-banners',
                  'gang-boyz-collections',
                  'gang-boyz-showcase-banners',
                  'gang-boyz-contacts',
                  'gang-boyz-contact-info',
                  'gang-boyz-homepage-banner-strip',
                  'gang-boyz-welcome-seen',
                  'welcome-modal-disabled',
                  'edit-mode-enabled',
                  'developer-tools-enabled',
                  'gang-boyz-user-preferences',
                  'gang-boyz-card-products',
                  'gang-boyz-destaques-config',
                  'gang-boyz-banners',
                  'gang-boyz-footer-banner',
                  'gang-boyz-explore-categories', // Add explore categories
                  'gang-boyz-explore-title', // Add explore title
                  'gang-boyz-explore-description', // Add explore description
                  'gang-boyz-custom-pages', // Add custom pages
                  'gang-boyz-page-configs', // Add page configurations
                  'gang-boyz-subcategory-data', // Add subcategory data
                  'gang-boyz-custom-content', // Add custom content
                  'gang-boyz-notification-settings', // Add notification settings
                  'gang-boyz-products-backup', // Add products backup
                  'gang-boyz-banner-strip-config', // Add banner strip config
                  'gang-boyz-useful-links', // Add useful links
                  'gang-boyz-cookie-consent', // Add cookie consent
                  'gang-boyz-cookie-timestamp', // Add cookie timestamp
                  'gang-boyz-user', // Add user data
                  'gang-boyz-card-products-cache', // Add card products cache
                  'gang-boyz-services', // Add services data
                  'gang-boyz-test-products-cache' // Add test products cache
                ];
                
                keysToClear.forEach(key => {
                  localStorage.removeItem(key);
                });
                
                // Clear all cookies
                document.cookie.split(";").forEach(cookie => {
                  const eqPos = cookie.indexOf("=");
                  const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                });
                
                // Reload the page to reflect changes
                window.location.reload();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar Todos os Dados
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {banners.map((banner) => {
            const config = bannerConfigs.find(c => c.id === banner.id)
            if (!config) return null

            const isEditing = editingBanner === banner.id

            return (
              <div key={banner.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 max-w-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{banner.name}</h4>
                      <p className="text-xs text-gray-500">{config.dimensions}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteBanner(banner.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Upload */}
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-800 mb-3 block">
                    Upload de Imagem
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 group">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Upload className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Selecionar arquivo</p>
                          <p className="text-xs text-gray-500">ou arraste e solte aqui</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Máximo {config.maxFileSize.image}</p>
                        <p className="text-xs text-gray-400">JPG, PNG, GIF</p>
                      </div>
                    </div>
                    <div className="mt-3 relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(banner.id, file)
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center justify-center w-full h-12 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center space-x-2">
                          <Upload className="h-4 w-4 text-gray-600 group-hover:text-gray-700" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800">
                            Escolher arquivo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview/Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {isEditing ? 'Editor de Imagem' : 'Preview'}
                    </Label>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBanner(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>

                  <div
                    className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mx-auto"
                    style={{
                      height: isEditing ? '300px' : '180px',
                      width: '100%',
                      maxWidth: '100%',
                      minHeight: isEditing ? '300px' : '180px'
                    }}
                  >
                    {isEditing ? (
                      <div className="w-full h-full bg-white relative">
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <div className="relative overflow-hidden rounded-lg border-2 border-blue-500 max-w-full max-h-full">
                            <Image
                              src={banner.currentImage}
                              alt={banner.name}
                              width={calculateScaleFactor(banner.id).editorWidth}
                              height={Math.round(calculateScaleFactor(banner.id).editorWidth / (config.aspectRatio.includes(':') ? config.aspectRatio.split(':').map(Number).reduce((a, b) => a / b) : parseFloat(config.aspectRatio)))}
                              className="object-cover cursor-move transition-transform"
                              style={{
                                transform: `translate(${(cropData as any).x}px, ${(cropData as any).y}px) scale(${(cropData as any).scale})`
                              }}
                              unoptimized={true}
                              draggable={false}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                const startX = e.clientX - (cropData as any).x
                                const startY = e.clientY - (cropData as any).y

                                const handleMouseMove = (e: MouseEvent) => {
                                  const newCropData = {
                                    x: e.clientX - startX,
                                    y: e.clientY - startY,
                                    scale: (cropData as any).scale
                                  }
                                  console.log('Movendo imagem - Nova posição:', newCropData)
                                  setCropData(newCropData)
                                }

                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove)
                                  document.removeEventListener('mouseup', handleMouseUp)
                                }

                                document.addEventListener('mousemove', handleMouseMove)
                                document.addEventListener('mouseup', handleMouseUp)
                              }}
                              onTouchStart={(e) => {
                                e.preventDefault()
                                const touch = e.touches[0]
                                const startX = touch.clientX - (cropData as any).x
                                const startY = touch.clientY - (cropData as any).y

                                const handleTouchMove = (e: TouchEvent) => {
                                  e.preventDefault()
                                  const touch = e.touches[0]
                                  const newCropData = {
                                    x: touch.clientX - startX,
                                    y: touch.clientY - startY,
                                    scale: (cropData as any).scale
                                  }
                                  console.log('Movendo imagem (touch) - Nova posição:', newCropData)
                                  setCropData(newCropData)
                                }

                                const handleTouchEnd = () => {
                                  document.removeEventListener('touchmove', handleTouchMove)
                                  document.removeEventListener('touchend', handleTouchEnd)
                                }

                                document.addEventListener('touchmove', handleTouchMove, { passive: false })
                                document.addEventListener('touchend', handleTouchEnd)
                              }}
                            />
                            {/* Overlay de crop */}
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-500/20"></div>
                              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-500/20"></div>
                              <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-500/20"></div>
                              <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/20"></div>
                            </div>
                          </div>
                        </div>

                        {/* Controles de Zoom */}
                        <div className="absolute top-4 right-4 flex flex-col space-y-2">
                          <Button
                            onClick={() => {
                              const newScale = Math.min((cropData as any).scale + 0.1, 3)
                              console.log('Aumentando zoom - Nova escala:', newScale)
                              setCropData(prev => ({...prev, scale: newScale}))
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 md:h-10 md:w-10 p-0 text-lg font-bold shadow-lg"
                          >
                            +
                          </Button>
                          <Button
                            onClick={() => {
                              const newScale = Math.max((cropData as any).scale - 0.1, 0.5)
                              console.log('Diminuindo zoom - Nova escala:', newScale)
                              setCropData(prev => ({...prev, scale: newScale}))
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 md:h-10 md:w-10 p-0 text-lg font-bold shadow-lg"
                          >
                            -
                          </Button>
                        </div>

                        {/* Info Panel */}
                        <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-sm font-mono shadow-xl border border-white/20">
                          <div className="font-semibold mb-1">Editor</div>
                          <div>X: {Math.round(cropData.x)}px</div>
                          <div>Y: {Math.round(cropData.y)}px</div>
                          <div>Zoom: {Math.round(cropData.scale * 100)}%</div>
                          <div className="border-t border-white/30 mt-2 pt-2">
                            <div className="font-semibold mb-1">Real</div>
                            <div>X: {Math.round((cropData as any).x * calculateScaleFactor(banner.id).scaleFactor)}px</div>
                            <div>Y: {Math.round((cropData as any).y * calculateScaleFactor(banner.id).scaleFactor)}px</div>
                            <div>Scale: {calculateScaleFactor(banner.id).scaleFactor.toFixed(2)}x</div>
                          </div>
                        </div>

                        {/* Controles */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                          <Button
                            onClick={() => {
                              handleCropSave(banner.id, cropData)
                              setEditingBanner(null)
                              toast.success("Imagem salva!")
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white h-12 md:h-10 px-6 md:px-4 text-sm font-semibold shadow-lg"
                            size="sm"
                          >
                            Salvar
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingBanner(null)
                              // Converter tx, ty para x, y para o editor
                              const existingCrop = banner.cropMetadata || {tx: 0, ty: 0, scale: 1}
                              
                              // Calcular o fator de escala inverso usando a função helper
                              const { inverseScaleFactor } = calculateScaleFactor(banner.id)
                              
                              setCropData({
                                x: Math.round(((existingCrop as any).tx || (existingCrop as any).x || 0) * inverseScaleFactor),
                                y: Math.round(((existingCrop as any).ty || (existingCrop as any).y || 0) * inverseScaleFactor),
                                scale: (existingCrop as any).scale || 1
                              })
                            }}
                            variant="outline"
                            size="sm"
                            className="h-12 md:h-10 px-6 md:px-4 text-sm font-semibold border-2 shadow-lg"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {banner.currentImage ? (
                          <div
                            className="relative w-full h-full cursor-pointer group overflow-hidden"
                            onClick={() => {
                              setEditingBanner(banner.id)
                              // Converter tx, ty para x, y para o editor
                              const existingCrop = banner.cropMetadata || {tx: 0, ty: 0, scale: 1}
                              
                              // Calcular o fator de escala inverso usando a função helper
                              const { inverseScaleFactor } = calculateScaleFactor(banner.id)
                              
                              setCropData({
                                x: Math.round(((existingCrop as any).tx || (existingCrop as any).x || 0) * inverseScaleFactor),
                                y: Math.round(((existingCrop as any).ty || (existingCrop as any).y || 0) * inverseScaleFactor),
                                scale: (existingCrop as any).scale || 1
                              })
                            }}
                          >
                            <Image
                              src={banner.currentImage}
                              alt={banner.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              style={{
                                transform: banner.cropMetadata ?
                                  `translate(${(banner.cropMetadata as any).tx || (banner.cropMetadata as any).x || 0}px, ${(banner.cropMetadata as any).ty || (banner.cropMetadata as any).y || 0}px) scale(${(banner.cropMetadata as any).scale || 1})` :
                                  undefined
                              }}
                              unoptimized={true}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="bg-white/95 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-xl border border-gray-200 min-w-[80px] text-center">
                                  <Eye className="h-4 w-4 inline mr-2" />
                                  Editar
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-center h-full cursor-pointer group"
                            onClick={() => {
                              setEditingBanner(banner.id)
                              // Converter tx, ty para x, y para o editor
                              const existingCrop = banner.cropMetadata || {tx: 0, ty: 0, scale: 1}
                              
                              // Calcular o fator de escala inverso usando a função helper
                              const { inverseScaleFactor } = calculateScaleFactor(banner.id)
                              
                              setCropData({
                                x: Math.round(((existingCrop as any).tx || (existingCrop as any).x || 0) * inverseScaleFactor),
                                y: Math.round(((existingCrop as any).ty || (existingCrop as any).y || 0) * inverseScaleFactor),
                                scale: (existingCrop as any).scale || 1
                              })
                            }}
                          >
                            <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                              <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                              <p className="text-xs">Clique para editar</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}