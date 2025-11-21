"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Upload, 
  Eye, 
  Save, 
  RefreshCw, 
  Trash2, 
  Settings, 
  Image as ImageIcon, 
  Cloud, 
  CloudOff,
  Palette,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  Smartphone,
  Monitor,
  Grid,
  List,
  Plus,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { BannerConfig, BANNER_CONFIGS, BANNER_STRIP_CONFIGS } from "@/lib/banner-config"
import { BannerData, BannerStripData } from "@/hooks/use-banner"
import { bannerSyncServiceV2 } from "@/lib/banner-sync-service-v2"

interface HomepageBannersAdminProps {
  storageKey: string
  eventName: string
  bannerConfigs: BannerConfig[]
  stripConfig?: typeof BANNER_STRIP_CONFIGS.homepage
  showCategoryStrip?: boolean
}

export function HomepageBannersAdmin({ 
  storageKey, 
  eventName, 
  bannerConfigs,
  stripConfig,
  showCategoryStrip = false 
}: HomepageBannersAdminProps) {
  const [banners, setBanners] = useState<BannerData[]>([])
  const [loading, setLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'desktop'>('desktop')
  const [editingBanner, setEditingBanner] = useState<string | null>(null)
  const [cropData, setCropData] = useState<{x: number, y: number, scale: number}>({x: 0, y: 0, scale: 1})
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  
  // Strip states
  const [stripData, setStripData] = useState<BannerStripData | null>(null)
  const [stripSaving, setStripSaving] = useState(false)
  const [stripSaved, setStripSaved] = useState(false)

  useEffect(() => {
    loadBanners()
    if (stripConfig) {
      loadStripData()
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
      }
    } catch (error) {
      console.error("Error loading banners:", error)
      toast.error("Error loading banners")
    }
  }

  const loadStripData = () => {
    if (!stripConfig) return
    
    try {
      const savedData = localStorage.getItem(stripConfig.storageKey)
      if (savedData) {
        setStripData(JSON.parse(savedData))
      } else {
        setStripData(stripConfig.defaultSettings)
      }
    } catch (error) {
      console.error("Error loading strip data:", error)
    }
  }

  const handleFileUpload = async (bannerId: string, file: File) => {
    setLoading(true)
    
    try {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Maximum 5MB allowed.")
        return
      }
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
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
      
      toast.success("Banner updated successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Error uploading banner")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    setBanners(updatedBanners)
    localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
    window.dispatchEvent(new CustomEvent(eventName))
    toast.success("Banner deleted successfully!")
  }

  const handleStripSave = async () => {
    if (!stripConfig || !stripData) return
    
    setStripSaving(true)
    
    try {
      localStorage.setItem(stripConfig.storageKey, JSON.stringify(stripData))
      window.dispatchEvent(new CustomEvent(stripConfig.eventName))
      
      // Sincronização com Firebase desativada temporariamente
      // try {
      //   await bannerSyncServiceV2.syncHomepageBannersToFirebase()
      // } catch (syncError) {
      //   console.warn("⚠️ Erro ao sincronizar strip com Firebase:", syncError)
      // }
      
      setStripSaving(false)
      setStripSaved(true)
      
      setTimeout(() => {
        setStripSaved(false)
      }, 2000)
      
      toast.success("Strip settings saved successfully!")
    } catch (error) {
      console.error("Error saving strip:", error)
      toast.error("Error saving settings")
      setStripSaving(false)
    }
  }

  const syncToFirebase = async () => {
    toast.info("Sincronização com Firebase desativada temporariamente.", { duration: 2000 })
    // Sincronização desativada conforme solicitado
    // setIsSyncing(true)
    // toast.info("🔄 Starting synchronization...", { duration: 2000 })
    // 
    // try {
    //   const startTime = Date.now()
    //   await bannerSyncServiceV2.syncHomepageBannersToFirebase()
    //   const duration = Date.now() - startTime
    //   
    //   toast.success(`✅ Synchronization completed! (${duration}ms)`, { duration: 3000 })
    // } catch (error: any) {
    //   console.error("Sync error:", error)
    //   
    //   if (error?.code === 'resource-exhausted' || error?.message?.includes('quota')) {
    //     toast.warning("⚠️ Firebase quota exceeded. Using local sync.", { duration: 4000 })
    //   } else {
    //     toast.error("❌ Sync error. Using local backup.", { duration: 4000 })
    //   }
    // } finally {
    //   setIsSyncing(false)
    // }
  }

  const openEditor = (bannerId: string) => {
    const banner = banners.find(b => b.id === bannerId)
    if (!banner || !banner.currentImage) {
      toast.error("No image to edit")
      return
    }
    
    setEditingBanner(bannerId)
    const existingCrop = banner.cropMetadata || {tx: 0, ty: 0, scale: 1}
    setCropData({
      x: existingCrop.tx || 0,
      y: existingCrop.ty || 0,
      scale: existingCrop.scale || 1
    })
    setIsEditorOpen(true)
  }

  const saveCrop = async () => {
    if (!editingBanner) return
    
    const updatedBanners = banners.map(banner => 
      banner.id === editingBanner 
        ? { 
            ...banner, 
            cropMetadata: {
              src: banner.currentImage,
              ratio: "16:9", // Default ratio, you might want to calculate this dynamically
              scale: cropData.scale,
              tx: cropData.x,
              ty: cropData.y
            }
          }
        : banner
    )
    
    setBanners(updatedBanners)
    localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
    window.dispatchEvent(new CustomEvent(eventName))
    
    setIsEditorOpen(false)
    setEditingBanner(null)
    toast.success("Crop saved successfully!")
  }

  const resetCrop = () => {
    setCropData({x: 0, y: 0, scale: 1})
  }

  const BannerCard = ({ banner }: { banner: BannerData }) => {
    const config = bannerConfigs.find(c => c.id === banner.id)
    if (!config) return null

    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
        viewMode === 'grid' ? 'w-full' : 'flex items-center'
      }`}>
        {/* Banner Preview */}
        <div className={`${viewMode === 'grid' ? 'w-full' : 'w-1/3'}`}>
          <div className="relative group">
            {banner.currentImage ? (
              <div className="relative w-full overflow-hidden bg-gray-100">
                <div 
                  className="relative"
                  style={{ 
                    aspectRatio: config.aspectRatio.includes(':') 
                      ? config.aspectRatio.replace(':', '/') 
                      : '16/9',
                    width: '100%'
                  }}
                >
                  <Image
                    src={banner.currentImage}
                    alt={banner.name}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                  {banner.cropMetadata && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Move className="h-3 w-3 mr-1" />
                      Cropped
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="flex items-center justify-center bg-gray-50"
                style={{ 
                  aspectRatio: config.aspectRatio.includes(':') 
                    ? config.aspectRatio.replace(':', '/') 
                    : '16/9',
                  width: '100%'
                }}
              >
                <div className="text-center p-4">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-500">No image</p>
                  <p className="text-xs text-gray-400 mt-1">{config.dimensions}</p>
                </div>
              </div>
            )}
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditor(banner.id)}
                  className="h-8 px-3"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="h-8 px-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Info */}
        <div className={`${viewMode === 'grid' ? 'p-4' : 'p-4 w-2/3'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{banner.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{config.dimensions}</p>
              <p className="text-xs text-gray-400 mt-1">{config.description}</p>
            </div>
            {banner.currentImage && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEditor(banner.id)}
                className="h-8 w-8 p-0"
              >
                <Palette className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Upload Area */}
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Upload New Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Choose file</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF (max 5MB)</p>
                  </div>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(banner.id, file)
                  }}
                  className="hidden"
                  id={`file-upload-${banner.id}`}
                />
                <Button
                  size="sm"
                  onClick={() => document.getElementById(`file-upload-${banner.id}`)?.click()}
                  className="h-8"
                >
                  <span className="hidden sm:inline">Select</span>
                  <span className="sm:hidden">
                    <Upload className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Homepage Banners</h1>
                <p className="text-sm text-gray-500 mt-1">{banners.length} banners configured</p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
              <Button
                onClick={syncToFirebase}
                disabled={isSyncing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Cloud className="h-4 w-4 mr-2" />
                )}
                <span className="hidden sm:inline">
                  {isSyncing ? 'Syncing...' : 'Sync to Firebase'}
                </span>
                <span className="sm:hidden">
                  {isSyncing ? 'Sync...' : 'Sync'}
                </span>
              </Button>
              
              <Button
                onClick={() => {
                  localStorage.removeItem(storageKey)
                  loadBanners()
                  toast.success("Banners reset to defaults!")
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Reset</span>
                <span className="sm:hidden">Reset</span>
              </Button>
              
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
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Limpar Todos os Dados</span>
                <span className="sm:hidden">Limpar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Preview:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={devicePreview === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevicePreview('desktop')}
                  className="h-8 px-3"
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Desktop</span>
                </Button>
                <Button
                  variant={devicePreview === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevicePreview('mobile')}
                  className="h-8 px-3"
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mobile</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Strip Configuration */}
        {stripConfig && stripData && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 p-2 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-700" />
                  </div>
                  <h2 className="ml-3 text-lg font-semibold text-gray-900">{stripConfig.name}</h2>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Active</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={stripData.isActive}
                      onChange={(e) => setStripData({...stripData, isActive: e.target.checked})}
                      className="sr-only"
                      id="strip-toggle"
                    />
                    <label
                      htmlFor="strip-toggle"
                      className={`block h-6 w-10 rounded-full cursor-pointer ${
                        stripData.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        stripData.isActive ? 'transform translate-x-4' : ''
                      }`}></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="strip-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Strip Text
                  </Label>
                  <Textarea
                    id="strip-text"
                    value={stripData.text}
                    onChange={(e) => setStripData({...stripData, text: e.target.value})}
                    placeholder="Enter strip text"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strip-emoji" className="block text-sm font-medium text-gray-700 mb-2">
                      Emoji
                    </Label>
                    <Input
                      id="strip-emoji"
                      value={stripData.emoji}
                      onChange={(e) => setStripData({...stripData, emoji: e.target.value})}
                      placeholder="🎯"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="strip-bg-color" className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </Label>
                    <select
                      id="strip-bg-color"
                      value={stripData.bgColor}
                      onChange={(e) => setStripData({...stripData, bgColor: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strip-height" className="block text-sm font-medium text-gray-700 mb-2">
                      Height (px)
                    </Label>
                    <Input
                      id="strip-height"
                      type="number"
                      min="20"
                      max="100"
                      value={stripData.height}
                      onChange={(e) => setStripData({...stripData, height: parseInt(e.target.value) || 38})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="strip-speed" className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Speed
                    </Label>
                    <Input
                      id="strip-speed"
                      type="number"
                      min="10"
                      max="100"
                      value={stripData.speed}
                      onChange={(e) => setStripData({...stripData, speed: parseInt(e.target.value) || 50})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="strip-repetitions" className="block text-sm font-medium text-gray-700 mb-2">
                      Repetitions
                    </Label>
                    <Input
                      id="strip-repetitions"
                      type="number"
                      min="1"
                      max="10"
                      value={stripData.repetitions}
                      onChange={(e) => setStripData({...stripData, repetitions: parseInt(e.target.value) || 4})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </Label>
                  <div 
                    className={`rounded-lg border border-gray-300 overflow-hidden ${
                      stripData.bgColor === 'black' ? 'bg-black' :
                      stripData.bgColor === 'red' ? 'bg-red-500' :
                      stripData.bgColor === 'blue' ? 'bg-blue-500' :
                      stripData.bgColor === 'green' ? 'bg-green-500' :
                      stripData.bgColor === 'purple' ? 'bg-purple-500' :
                      stripData.bgColor === 'orange' ? 'bg-orange-500' : 'bg-black'
                    }`}
                    style={{ height: `${stripData.height}px` }}
                  >
                    <div 
                      className="flex items-center h-full text-white text-sm font-bold whitespace-nowrap"
                      style={{
                        animation: `${stripData.speed}s linear 0s infinite normal none running scroll`
                      }}
                    >
                      {Array.from({ length: stripData.repetitions }).map((_, i) => (
                        <span key={i} className="mr-8 flex-shrink-0">
                          {stripData.emoji && <span className="mr-2">{stripData.emoji}</span>}
                          {stripData.text || 'DEMO SITE'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleStripSave}
                  disabled={stripSaving}
                  className="w-full sm:w-auto"
                >
                  {stripSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : stripSaved ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Strip Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Banners Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-200 p-2 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-gray-700" />
                </div>
                <h2 className="ml-3 text-lg font-semibold text-gray-900">Banners</h2>
              </div>
              <div className="text-sm text-gray-500">
                {banners.length} banners
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {banners.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No banners configured</h3>
                <p className="mt-2 text-gray-500">Get started by adding your first banner.</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
              }>
                {banners.map((banner) => (
                  <BannerCard key={banner.id} banner={banner} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      {isEditorOpen && editingBanner && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Banner Image</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditorOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3">
                  <div className="bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full max-w-2xl max-h-[500px]">
                          <Image
                            src={banners.find(b => b.id === editingBanner)?.currentImage || ''}
                            alt="Banner preview"
                            fill
                            className="object-contain cursor-move"
                            style={{
                              transform: `translate(${cropData.x}px, ${cropData.y}px) scale(${cropData.scale})`
                            }}
                            unoptimized={true}
                            draggable={false}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              const startX = e.clientX - cropData.x
                              const startY = e.clientY - cropData.y

                              const handleMouseMove = (e: MouseEvent) => {
                                const newCropData = {
                                  x: e.clientX - startX,
                                  y: e.clientY - startY,
                                  scale: cropData.scale
                                }
                                setCropData(newCropData)
                              }

                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                              }

                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Crop Controls</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Zoom</Label>
                        <div className="flex items-center mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCropData({...cropData, scale: Math.max(0.5, cropData.scale - 0.1)})}
                            className="h-9 w-9 p-0"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 mx-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(cropData.scale - 0.5) * (100 / 2.5)}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCropData({...cropData, scale: Math.min(3, cropData.scale + 0.1)})}
                            className="h-9 w-9 p-0"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-center text-sm text-gray-500 mt-1">
                          {Math.round(cropData.scale * 100)}%
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Position</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <Label className="text-xs text-gray-500">X: {cropData.x}px</Label>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Y: {cropData.y}px</Label>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={resetCrop}
                        className="w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Position
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={saveCrop}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditorOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}