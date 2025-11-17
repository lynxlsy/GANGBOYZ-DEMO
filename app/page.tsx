"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryShowcase } from "@/components/category-showcase"
import { BannersShowcase } from "@/components/banners-showcase"
import { FeaturedProducts } from "@/components/featured-products"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { useEditMode } from "@/lib/edit-mode-context"
import { useBanner } from "@/hooks/use-banner"
import { getBannerConfig } from "@/lib/banner-config"
import { toast } from "sonner"
import { ImageIcon, X, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { WelcomeModal } from "@/components/welcome-modal"
import { ScrollToTop } from "@/components/scroll-to-top"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { NotificationSystem } from "@/components/notification-system"
import { CookieBanner } from "@/components/cookie-banner"
import { EditModeControls } from "@/components/edit-mode-controls"
import { FooterBanner } from "@/components/footer-banner-v2"
import { BannerStrip as HomepageBannerStrip } from "@/components/banner-strip"
import { TopBannerStrip } from "@/components/top-banner-strip"
import { RecommendationsSection } from "@/components/recommendations-section"
import { HotSection } from "@/components/hot-section"
import { OffersBanner } from "@/components/banner-renderer"
import { CouponManagement } from "@/components/coupon-management"
import { TestCouponSystem } from "@/components/test-coupon-system"
import { OngoingPurchaseNotification } from "@/components/ongoing-purchase-notification"

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  // Handle useEditMode with error handling
  let isEditMode = false
  try {
    const editModeContext = useEditMode()
    isEditMode = editModeContext.isEditMode
  } catch (error) {
    console.warn("Failed to initialize edit mode context:", error)
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      isEditMode = localStorage.getItem('edit-mode-enabled') === 'true'
    }
  }
  
  const [showBannersPanel, setShowBannersPanel] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [currentBannerId, setCurrentBannerId] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Hooks for banner data
  const { banner: heroBanner1, updateBanner: updateHeroBanner1 } = useBanner('hero-banner-1')
  const { banner: heroBanner2, updateBanner: updateHeroBanner2 } = useBanner('hero-banner-2')
  const { banner: footerBanner, updateBanner: updateFooterBanner } = useBanner('footer-banner')
  const { banner: offersBanner, updateBanner: updateOffersBanner } = useBanner('offers-banner')
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    // Verificar se o modal foi desabilitado pelo usuário
    const modalDisabled = localStorage.getItem('welcome-modal-disabled')
    const hasSeenWelcome = localStorage.getItem('gang-boyz-welcome-seen')
    
    if (modalDisabled === 'true') {
      setShowWelcomeModal(false)
      return
    }
    
    // Mostrar modal de boas-vindas apenas uma vez
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true)
      localStorage.setItem('gang-boyz-welcome-seen', 'true')
    }
    
    // Carregar script para corrigir contraste da faixa de promoção
    const script = document.createElement('script');
    script.src = '/fix-banner-contrast.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [])

  const handleEditBannerImage = (bannerId: string) => {
    setCurrentBannerId(bannerId)
    setShowUploadModal(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo permitido: 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Apenas arquivos de imagem são permitidos")
      return
    }

    setUploading(true)
    
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
      
      console.log('Updating banner with URL:', url, 'Banner ID:', currentBannerId)
      
      // Update the appropriate banner
      switch (currentBannerId) {
        case 'hero-banner-1':
          console.log('Updating hero-banner-1')
          const result1 = updateHeroBanner1({ currentImage: url })
          console.log('Update result for hero-banner-1:', result1)
          break
        case 'hero-banner-2':
          console.log('Updating hero-banner-2')
          const result2 = updateHeroBanner2({ currentImage: url })
          console.log('Update result for hero-banner-2:', result2)
          break
        case 'footer-banner':
          console.log('Updating footer-banner')
          updateFooterBanner({ currentImage: url })
          break
        case 'offers-banner':
          console.log('Updating offers-banner')
          updateOffersBanner({ currentImage: url })
          break
        default:
          // For grid banners, we need to update the collections
          const config = getBannerConfig(currentBannerId)
          if (config) {
            const savedBanners = localStorage.getItem(config.storageKey)
            if (savedBanners) {
              const banners = JSON.parse(savedBanners)
              const updatedBanners = banners.map((banner: any) => 
                banner.id === currentBannerId ? { ...banner, currentImage: url } : banner
              )
              localStorage.setItem(config.storageKey, JSON.stringify(updatedBanners))
              window.dispatchEvent(new CustomEvent(config.eventName))
            }
          }
          break
      }
      
      toast.success("Banner atualizado com sucesso!")
      setShowUploadModal(false)
      
      // Force a refresh of all banner components
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("homepageBannerUpdate"))
      }, 100)
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro ao fazer upload do banner")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getBannerTitle = (bannerId: string) => {
    switch (bannerId) {
      case 'hero-banner-1': return "Banner Hero 1"
      case 'hero-banner-2': return "Banner Hero 2"
      case 'footer-banner': return "Banner Footer"
      case 'offers-banner': return "Banner de Ofertas"
      default: return "Banner"
    }
  }

  const getBannerConfigInfo = (bannerId: string) => {
    const config = getBannerConfig(bannerId)
    return config ? `${config.dimensions} (${config.mediaTypes.join(', ')})` : ""
  }

  const getBannerCurrentImage = (bannerId: string) => {
    let imageUrl = "/placeholder-default.svg"
    
    switch (bannerId) {
      case 'hero-banner-1': 
        imageUrl = heroBanner1?.currentImage || "/placeholder-default.svg"
        break
      case 'hero-banner-2': 
        imageUrl = heroBanner2?.currentImage || "/placeholder-default.svg"
        break
      case 'footer-banner': 
        imageUrl = footerBanner?.currentImage || "/placeholder-default.svg"
        break
      case 'offers-banner': 
        imageUrl = offersBanner?.currentImage || "/placeholder-default.svg"
        break
      default: 
        imageUrl = "/placeholder-default.svg"
        break
    }
    
    // Don't add cache buster to data URLs (base64 images)
    if (imageUrl.startsWith('data:')) {
      return imageUrl
    }
    
    return `${imageUrl}?v=${Date.now()}`
  }

  // Banner information for the panel
  const bannerInfo = [
    { id: 'hero-banner-1', title: 'Hero Banner 1', description: 'Banner principal no topo da página' },
    { id: 'hero-banner-2', title: 'Hero Banner 2', description: 'Segundo banner principal' },
    { id: 'offers-banner', title: 'Banner de Ofertas', description: 'Banner de ofertas especiais no meio da página' },
    { id: 'footer-banner', title: 'Banner Footer', description: 'Banner no rodapé da página' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <TopBannerStrip />
      <Header />
      <TestCouponSystem />
      
      {/* Edit Mode Controls */}
      <EditModeControls />
      
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
      />
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editar Imagem do Banner
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">
                  Banner: {getBannerTitle(currentBannerId)}
                </p>
                <p className="text-xs text-gray-400">
                  {getBannerConfigInfo(currentBannerId)}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Enviando..." : "Selecionar Imagem"}
                </Button>
                
                <Button
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main>
        {/* Scrolling demo banner - appears above header when selected */}
        {/* {showDemoBanner && (
          <div className="hidden md:block w-full h-16 bg-black flex items-center overflow-hidden">
            <div className="flex items-center h-full">
              <div className="flex font-bold text-sm tracking-wider whitespace-nowrap" style={{ animation: '10s linear 0s infinite normal none running scroll', color: 'white' }}>
                <span className="mr-16">SITE DEMONSTRATIVO</span>
                <span className="mr-16">SITE DEMONSTRATIVO</span>
                <span className="mr-16">SITE DEMONSTRATIVO</span>
                <span className="mr-16">SITE DEMONSTRATIVO</span>
                <span className="mr-16">SITE DEMONSTRATIVO</span>
              </div>
            </div>
          </div>
        )} */}
        
        {/* Black bar above hero banner */}
        <div className="hidden md:block w-full h-[2cm] bg-black"></div>
        
        {/* Hero Section */}
        <Hero onEditBannerImage={handleEditBannerImage} />
        
        {/* Homepage Banner Strip */}
        <HomepageBannerStrip />
        
        {/* Category Showcase */}
        <CategoryShowcase />
        
        {/* Banners Showcase */}
        <BannersShowcase isEditMode={isEditMode} />
        
        {/* Recommendations Section */}
        <RecommendationsSection />
        
        {/* Hot Section */}
        <HotSection isEditMode={isEditMode} />
        
        {/* Offers Banner - Adding the missing offers banner */}
        <div className="container mx-auto px-4 py-8">
          <OffersBanner />
        </div>
        
        {/* Featured Products */}
        <FeaturedProducts />
        
        {/* Footer Banner - Moved above Services Section as requested */}
        <FooterBanner />
        
        {/* Sobre a Gang Boyz Section */}
        <div className="py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-6">Sobre a Gang Boyz</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              A Gang Boyz é uma marca de streetwear brasileira que traz autenticidade, estilo e qualidade para as ruas. 
              Representamos a cultura urbana com roupas que expressam a verdadeira essência da juventude brasileira.
            </p>
          </div>
        </div>
        
        {/* Services Section with spacing */}
        <div className="mt-8">
          <ServicesSection isEditMode={isEditMode} />
        </div>
        
        {/* Product Information Edit Section - Removed as per new requirements */}
        {/* {isEditMode && <ProductInfoEditor />} */}
        
        {/* Coupon Management - Only visible in edit mode */}
        {isEditMode && (
          <div className="container mx-auto px-4 py-8">
            <CouponManagement />
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <ScrollToTop />
      <WhatsAppButton />
      <NotificationSystem />
      <CookieBanner />
      <OngoingPurchaseNotification />
    </div>
  )
}
