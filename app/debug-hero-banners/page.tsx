"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Banner {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: any
}

export default function DebugHeroBannersPage() {
  const [allBanners, setAllBanners] = useState<Banner[]>([])
  const [heroBanners, setHeroBanners] = useState<Array<{
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
      const banners: Banner[] = JSON.parse(savedBanners)
      setAllBanners(banners)
      
      // Simular a lógica do Hero.tsx
      const heroBanner1 = banners.find(banner => banner.id === "hero-banner-1")
      const heroBanner2 = banners.find(banner => banner.id === "hero-banner-2")
      
      if (heroBanner1 && heroBanner2) {
        const formattedBanners = [
          {
            id: heroBanner1.id,
            imageSrc: heroBanner1.currentImage,
            alt: heroBanner1.name || "Gang BoyZ Hero Banner 1"
          },
          {
            id: heroBanner2.id,
            imageSrc: heroBanner2.currentImage,
            alt: heroBanner2.name || "Gang BoyZ Hero Banner 2"
          }
        ]
        setHeroBanners(formattedBanners)
      } else {
        setHeroBanners([])
      }
    } else {
      setAllBanners([])
      setHeroBanners([])
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
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug - Hero Banners</h1>
        
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
                <span className="font-bold">{allBanners.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Banners Hero:</span>
                <span className="font-bold text-red-400">{heroBanners.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Banner 1:</span>
                <span className="font-bold text-green-400">
                  {allBanners.find(b => b.id === "hero-banner-1") ? "✅" : "❌"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Banner 2:</span>
                <span className="font-bold text-green-400">
                  {allBanners.find(b => b.id === "hero-banner-2") ? "✅" : "❌"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Banners Hero */}
        <Card className="p-6 mb-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Banners Hero (Carrossel)</h2>
          {heroBanners.length === 0 ? (
            <p className="text-gray-400">Nenhum banner hero encontrado</p>
          ) : (
            <div className="space-y-4">
              {heroBanners.map((banner, index) => (
                <div key={banner.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{banner.alt}</h3>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                      Posição {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">ID: {banner.id}</p>
                  <p className="text-gray-400 text-sm">Imagem: {banner.imageSrc}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Todos os Banners */}
        <Card className="p-6 mb-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Todos os Banners (localStorage)</h2>
          {allBanners.length === 0 ? (
            <p className="text-gray-400">Nenhum banner encontrado</p>
          ) : (
            <div className="space-y-4">
              {allBanners.map((banner) => (
                <div key={banner.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{banner.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      banner.id.startsWith("hero-banner") 
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}>
                      {banner.id.startsWith("hero-banner") ? "HERO" : "OUTRO"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">ID: {banner.id}</p>
                  <p className="text-gray-400 text-sm">Imagem: {banner.currentImage}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Instruções */}
        <Card className="p-6 bg-blue-900/20 border-blue-700/30">
          <h2 className="text-xl font-bold mb-4">Instruções</h2>
          <div className="space-y-2 text-gray-300">
            <p>1. <strong>Verifique</strong> se aparecem exatamente 2 banners hero</p>
            <p>2. <strong>Clique</strong> em "Criar Banners Hero" se necessário</p>
            <p>3. <strong>Vá para a homepage</strong> e teste o carrossel</p>
            <p>4. <strong>Abra o console</strong> para ver os logs de debug</p>
            <p>5. <strong>Verifique</strong> se não há banners extras causando o problema</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

