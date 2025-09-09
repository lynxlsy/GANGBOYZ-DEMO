"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HeroCarousel } from "@/components/hero-carousel"

export default function DebugCarouselPage() {
  const [banners, setBanners] = useState<Array<{
    id: string
    imageSrc: string
    alt: string
  }>>([])

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = () => {
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    if (savedBanners) {
      const bannersData = JSON.parse(savedBanners)
      const heroBanners = bannersData.filter((banner: any) => banner.id.startsWith("hero-banner"))
      
      if (heroBanners.length > 0) {
        const formattedBanners = heroBanners.map((banner: any) => ({
          id: banner.id,
          imageSrc: banner.currentImage,
          alt: banner.name || "Gang BoyZ Hero Banner"
        }))
        setBanners(formattedBanners)
      } else {
        // Banners padrão se não encontrar
        setBanners([
          {
            id: "hero-banner-1",
            imageSrc: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
            alt: "Gang BoyZ Hero Banner 1"
          },
          {
            id: "hero-banner-2", 
            imageSrc: "/black-streetwear-hoodie-with-white-logo.jpg",
            alt: "Gang BoyZ Hero Banner 2"
          }
        ])
      }
    } else {
      // Banners padrão se não houver dados
      setBanners([
        {
          id: "hero-banner-1",
          imageSrc: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
          alt: "Gang BoyZ Hero Banner 1"
        },
        {
          id: "hero-banner-2", 
          imageSrc: "/black-streetwear-hoodie-with-white-logo.jpg",
          alt: "Gang BoyZ Hero Banner 2"
        }
      ])
    }
  }

  const createHeroBanners = () => {
    const heroBanner1 = {
      id: "hero-banner-1",
      name: "Banner Principal 1 (Hero)",
      description: "Primeiro banner do carrossel principal da página inicial",
      currentImage: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
      mediaType: "image",
      dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
      format: "JPG, PNG, WebP, MP4, GIF",
      position: "Background da seção hero (abaixo da faixa de aviso)"
    }
    
    const heroBanner2 = {
      id: "hero-banner-2",
      name: "Banner Principal 2 (Hero)",
      description: "Segundo banner do carrossel principal da página inicial",
      currentImage: "/black-streetwear-hoodie-with-white-logo.jpg",
      mediaType: "image",
      dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
      format: "JPG, PNG, WebP, MP4, GIF",
      position: "Background da seção hero (abaixo da faixa de aviso)"
    }
    
    const existingBanners = localStorage.getItem("gang-boyz-homepage-banners")
    let allBanners = []
    
    if (existingBanners) {
      const parsed = JSON.parse(existingBanners)
      // Remover banners hero existentes
      allBanners = parsed.filter((banner: any) => !banner.id.startsWith("hero-banner"))
    }
    
    // Adicionar os novos banners hero
    allBanners = [heroBanner1, heroBanner2, ...allBanners]
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(allBanners))
    loadBanners()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Debug - Carrossel Hero</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Controles */}
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Controles</h2>
            <div className="space-y-4">
              <Button onClick={loadBanners} className="w-full">
                🔄 Recarregar Banners
              </Button>
              <Button onClick={createHeroBanners} className="w-full bg-red-600 hover:bg-red-700">
                ➕ Criar Banners Hero
              </Button>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total de Banners:</span>
                <span className="font-bold">{banners.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Banner 1:</span>
                <span className="font-bold text-green-400">
                  {banners.find(b => b.id === "hero-banner-1") ? "✅" : "❌"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Banner 2:</span>
                <span className="font-bold text-green-400">
                  {banners.find(b => b.id === "hero-banner-2") ? "✅" : "❌"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Banners */}
        <Card className="p-6 mb-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Banners Carregados</h2>
          {banners.length === 0 ? (
            <p className="text-gray-400">Nenhum banner encontrado</p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{banner.alt}</h3>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                      {banner.id}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Imagem: {banner.imageSrc}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      {/* Carrossel */}
      {banners.length > 0 && (
        <HeroCarousel banners={banners} autoPlayInterval={4000} />
      )}
      
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Instruções:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Clique em "Criar Banners Hero" se não aparecerem banners</li>
          <li>Verifique se ambos os banners aparecem na lista acima</li>
          <li>Teste a navegação do carrossel com as setas e indicadores</li>
          <li>Verifique se ambas as imagens aparecem ao navegar</li>
        </ul>
      </div>
    </div>
  )
}

