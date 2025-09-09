"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

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

export default function TestAdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = () => {
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    if (savedBanners) {
      const bannersData = JSON.parse(savedBanners)
      setBanners(bannersData)
    } else {
      setBanners([])
    }
  }

  const createHeroBanners = () => {
    const currentBanners = [...banners]
    const filteredBanners = currentBanners.filter(banner => !banner.id.startsWith("hero-banner"))
    
    const heroBanner1: Banner = {
      id: "hero-banner-1",
      name: "Banner Principal 1 (Hero)",
      description: "Primeiro banner do carrossel principal da página inicial",
      currentImage: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
      mediaType: "image",
      dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
      format: "JPG, PNG, WebP, MP4, GIF",
      position: "Background da seção hero (abaixo da faixa de aviso)"
    }
    
    const heroBanner2: Banner = {
      id: "hero-banner-2",
      name: "Banner Principal 2 (Hero)",
      description: "Segundo banner do carrossel principal da página inicial",
      currentImage: "/black-streetwear-hoodie-with-white-logo.jpg",
      mediaType: "image",
      dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
      format: "JPG, PNG, WebP, MP4, GIF",
      position: "Background da seção hero (abaixo da faixa de aviso)"
    }
    
    const newBanners = [heroBanner1, heroBanner2, ...filteredBanners]
    setBanners(newBanners)
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(newBanners))
  }

  const heroBanners = banners.filter(banner => banner.id.startsWith("hero-banner"))
  const otherBanners = banners.filter(banner => !banner.id.startsWith("hero-banner"))

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Teste - Admin Banners</h1>
          <Link href="/admin/banners/homepage">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Ir para Admin
            </Button>
          </Link>
        </div>
        
        {/* Controles */}
        <Card className="p-6 mb-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Controles</h2>
          <div className="flex gap-4">
            <Button onClick={loadBanners} className="bg-gray-600 hover:bg-gray-700">
              🔄 Recarregar
            </Button>
            <Button onClick={createHeroBanners} className="bg-red-600 hover:bg-red-700">
              ➕ Criar Banners Hero
            </Button>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-6 mb-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Status Atual</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{banners.length}</div>
              <div className="text-gray-400">Total de Banners</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{heroBanners.length}</div>
              <div className="text-gray-400">Banners Hero</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{otherBanners.length}</div>
              <div className="text-gray-400">Outros Banners</div>
            </div>
          </div>
        </Card>

        {/* Banners Hero */}
        {heroBanners.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-700/30">
            <h2 className="text-xl font-bold mb-4 text-white">Banners Hero (Carrossel)</h2>
            <div className="space-y-4">
              {heroBanners.map((banner) => (
                <div key={banner.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{banner.name}</h3>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                      CARROSSEL
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{banner.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">ID:</span> {banner.id}</div>
                    <div><span className="text-gray-500">Tipo:</span> {banner.mediaType}</div>
                    <div><span className="text-gray-500">Imagem:</span> {banner.currentImage}</div>
                    <div><span className="text-gray-500">Dimensões:</span> {banner.dimensions}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Outros Banners */}
        {otherBanners.length > 0 && (
          <Card className="p-6 mb-8 bg-gray-900 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Outros Banners</h2>
            <div className="space-y-4">
              {otherBanners.map((banner) => (
                <div key={banner.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{banner.name}</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                      OUTRO
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{banner.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">ID:</span> {banner.id}</div>
                    <div><span className="text-gray-500">Tipo:</span> {banner.mediaType}</div>
                    <div><span className="text-gray-500">Imagem:</span> {banner.currentImage}</div>
                    <div><span className="text-gray-500">Dimensões:</span> {banner.dimensions}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instruções */}
        <Card className="p-6 bg-blue-900/20 border-blue-700/30">
          <h2 className="text-xl font-bold mb-4 text-white">Instruções</h2>
          <div className="space-y-2 text-gray-300">
            <p>1. <strong>Clique em "Criar Banners Hero"</strong> para criar os dois banners do carrossel</p>
            <p>2. <strong>Vá para o Admin</strong> clicando em "Ir para Admin"</p>
            <p>3. <strong>Verifique</strong> se aparecem dois banners separados na seção de edição</p>
            <p>4. <strong>Cada banner</strong> deve ter suas próprias informações e controles</p>
          </div>
        </Card>
      </div>
    </div>
  )
}


