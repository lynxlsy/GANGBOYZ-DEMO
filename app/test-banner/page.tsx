"use client"

import { useState, useEffect } from "react"
import { BannerRendererV2 } from "@/components/banner-renderer-v2"
import { InlineCropViewport } from "@/components/inline-crop-viewport"

export default function TestBannerPage() {
  const [testImage] = useState("/urban-streetwear-model-in-black-hoodie-against-dar.jpg")
  const [cropMetadata, setCropMetadata] = useState<any>(null)
  const [hotCropMetadata, setHotCropMetadata] = useState<any>(null)
  const [footerCropMetadata, setFooterCropMetadata] = useState<any>(null)

  // Carregar metadados existentes
  useEffect(() => {
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    if (savedBanners) {
      const banners = JSON.parse(savedBanners)
      
      const heroBanner = banners.find((banner: any) => banner.id === "hero-banner")
      if (heroBanner && heroBanner.cropMetadata) {
        setCropMetadata(heroBanner.cropMetadata)
      }
      
      const hotBanner = banners.find((banner: any) => banner.id === "hot-banner")
      if (hotBanner && hotBanner.cropMetadata) {
        setHotCropMetadata(hotBanner.cropMetadata)
      }
      
      const footerBanner = banners.find((banner: any) => banner.id === "footer-banner")
      if (footerBanner && footerBanner.cropMetadata) {
        setFooterCropMetadata(footerBanner.cropMetadata)
      }
    }
  }, [])

  const handleCropSave = (metadata: any) => {
    setCropMetadata(metadata)
    
    // Salvar no localStorage
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    let banners = savedBanners ? JSON.parse(savedBanners) : []
    
    const heroBannerIndex = banners.findIndex((banner: any) => banner.id === "hero-banner")
    if (heroBannerIndex >= 0) {
      banners[heroBannerIndex].cropMetadata = metadata
    } else {
      banners.push({
        id: "hero-banner",
        name: "Hero Banner",
        currentImage: testImage,
        cropMetadata: metadata
      })
    }
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(banners))
    
    // Disparar evento para atualizar outras abas
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
  }

  const handleCropCancel = () => {
    // Não fazer nada no cancelamento
  }

  const handleHotCropSave = (metadata: any) => {
    setHotCropMetadata(metadata)
    
    // Salvar no localStorage
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    let banners = savedBanners ? JSON.parse(savedBanners) : []
    
    const hotBannerIndex = banners.findIndex((banner: any) => banner.id === "hot-banner")
    if (hotBannerIndex >= 0) {
      banners[hotBannerIndex].cropMetadata = metadata
    } else {
      banners.push({
        id: "hot-banner",
        name: "Hot Banner",
        currentImage: testImage,
        cropMetadata: metadata
      })
    }
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(banners))
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
  }

  const handleHotCropCancel = () => {
    // Não fazer nada no cancelamento
  }

  const handleFooterCropSave = (metadata: any) => {
    setFooterCropMetadata(metadata)
    
    // Salvar no localStorage
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    let banners = savedBanners ? JSON.parse(savedBanners) : []
    
    const footerBannerIndex = banners.findIndex((banner: any) => banner.id === "footer-banner")
    if (footerBannerIndex >= 0) {
      banners[footerBannerIndex].cropMetadata = metadata
    } else {
      banners.push({
        id: "footer-banner",
        name: "Footer Banner",
        currentImage: testImage,
        cropMetadata: metadata
      })
    }
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(banners))
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
  }

  const handleFooterCropCancel = () => {
    // Não fazer nada no cancelamento
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Teste de Consistência do Banner
        </h1>
        
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Hero Banner - Preview do Admin</h2>
              <InlineCropViewport
                imageUrl={testImage}
                cropMetadata={cropMetadata}
                onSave={handleCropSave}
                onCancel={handleCropCancel}
                bannerName="Hero Banner"
                bannerType="hero"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Hero Banner - Homepage (Imagem Inteira)</h2>
              <div className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl" style={{ aspectRatio: '16/9' }}>
                <BannerRendererV2
                  bannerId="hero-banner"
                  imageSrc={testImage}
                  containerWidth={1920}
                  containerHeight={1080}
                  className="w-full h-full"
                  alt="Test Banner"
                />
              </div>
              <p className="text-sm text-gray-400">Este banner mostra a imagem inteira (object-contain)</p>
            </div>
          </div>

          {/* Hot Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Hot Banner - Preview do Admin</h2>
              <InlineCropViewport
                imageUrl={testImage}
                cropMetadata={hotCropMetadata}
                onSave={handleHotCropSave}
                onCancel={handleHotCropCancel}
                bannerName="Hot Banner"
                bannerType="other"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Hot Banner - Homepage (Largura Total)</h2>
              <div className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl w-full" style={{ aspectRatio: '1920/650' }}>
                <img
                  src={testImage}
                  alt="Hot Banner"
                  className="w-full h-full object-contain"
                  style={{
                    transform: hotCropMetadata ? 
                      `translate3d(${hotCropMetadata.tx * 50}%, ${hotCropMetadata.ty * 50}%, 0) scale(${hotCropMetadata.scale})` : 
                      'none',
                    willChange: 'transform',
                    transformOrigin: 'center'
                  }}
                />
              </div>
              <p className="text-sm text-gray-400">Este banner ocupa toda a largura da tela (w-screen) e mostra a imagem inteira</p>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Footer Banner - Preview do Admin</h2>
              <InlineCropViewport
                imageUrl={testImage}
                cropMetadata={footerCropMetadata}
                onSave={handleFooterCropSave}
                onCancel={handleFooterCropCancel}
                bannerName="Footer Banner"
                bannerType="other"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Footer Banner - Homepage (Largura Total)</h2>
              <div className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl w-full" style={{ aspectRatio: '1920/650' }}>
                <img
                  src={testImage}
                  alt="Footer Banner"
                  className="w-full h-full object-contain"
                  style={{
                    transform: footerCropMetadata ? 
                      `translate3d(${footerCropMetadata.tx * 50}%, ${footerCropMetadata.ty * 50}%, 0) scale(${footerCropMetadata.scale})` : 
                      'none',
                    willChange: 'transform',
                    transformOrigin: 'center'
                  }}
                />
              </div>
              <p className="text-sm text-gray-400">Este banner ocupa toda a largura da tela (w-screen) e mostra a imagem inteira</p>
            </div>
          </div>
        </div>
        
        {/* Informações de Debug */}
        {(cropMetadata || hotCropMetadata || footerCropMetadata) && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Metadados Atuais:</h3>
            {cropMetadata && (
              <div className="mb-4">
                <h4 className="font-medium text-blue-400">Hero Banner:</h4>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(cropMetadata, null, 2)}
                </pre>
              </div>
            )}
            {hotCropMetadata && (
              <div className="mb-4">
                <h4 className="font-medium text-red-400">Hot Banner:</h4>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(hotCropMetadata, null, 2)}
                </pre>
              </div>
            )}
            {footerCropMetadata && (
              <div className="mb-4">
                <h4 className="font-medium text-green-400">Footer Banner:</h4>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(footerCropMetadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {/* Instruções */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Como testar:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>Todos os banners:</strong> Mostram a imagem inteira (object-contain)</li>
            <li><strong>Hero:</strong> Proporção 16:9, responsivo</li>
            <li><strong>Hot e Footer:</strong> Proporção 1920:650, largura total da tela</li>
            <li>Clique em "Editar" no preview do admin</li>
            <li>Arraste a imagem para mover</li>
            <li>Use o scroll para fazer zoom</li>
            <li>Clique em "Salvar"</li>
            <li>Verifique se ambos os previews ficaram idênticos</li>
            <li><strong>Responsivo:</strong> Redimensione a janela - as imagens devem se adaptar</li>
            <li><strong>Consistência:</strong> Todos mostram a imagem inteira sem recorte</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
