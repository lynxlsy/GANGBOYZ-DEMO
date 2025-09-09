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

export default function DebugBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [localStorageData, setLocalStorageData] = useState<string>("")

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = () => {
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    if (savedBanners) {
      const bannersData = JSON.parse(savedBanners)
      setBanners(bannersData)
      setLocalStorageData(savedBanners)
    } else {
      setBanners([])
      setLocalStorageData("Nenhum dado encontrado")
    }
  }

  const resetBanners = () => {
    localStorage.removeItem("gang-boyz-homepage-banners")
    setBanners([])
    setLocalStorageData("Nenhum dado encontrado")
  }

  const createDefaultBanners = () => {
    const defaultBanners: Banner[] = [
      {
        id: "hero-banner-1",
        name: "Banner Principal 1 (Hero)",
        description: "Primeiro banner do carrossel principal da página inicial",
        currentImage: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
        mediaType: "image",
        dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Background da seção hero (abaixo da faixa de aviso)"
      },
      {
        id: "hero-banner-2",
        name: "Banner Principal 2 (Hero)",
        description: "Segundo banner do carrossel principal da página inicial",
        currentImage: "/black-streetwear-hoodie-with-white-logo.jpg",
        mediaType: "image",
        dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Background da seção hero (abaixo da faixa de aviso)"
      },
      {
        id: "hot-banner",
        name: "Banner HOT",
        description: "Banner da seção HOT, exibido acima dos produtos mais vendidos",
        currentImage: "/black-oversized-streetwear-jacket.jpg",
        mediaType: "image",
        dimensions: "1920x650px (≈2.95:1) - Otimizado para seção HOT",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Seção HOT (abaixo do header)"
      },
      {
        id: "footer-banner",
        name: "Banner Footer",
        description: "Banner que aparece antes do footer em todas as páginas",
        currentImage: "/placeholder.jpg",
        mediaType: "image",
        dimensions: "1920x650px (≈2.95:1) - Padrão para banners de seção",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Antes do Footer (em todas as páginas)"
      }
    ]
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(defaultBanners))
    loadBanners()
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug - Banners</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controles */}
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Controles</h2>
            <div className="space-y-4">
              <Button onClick={loadBanners} className="w-full">
                🔄 Recarregar Banners
              </Button>
              <Button onClick={createDefaultBanners} className="w-full bg-green-600 hover:bg-green-700">
                ➕ Criar Banners Padrão
              </Button>
              <Button onClick={resetBanners} className="w-full bg-red-600 hover:bg-red-700">
                🗑️ Limpar Todos os Banners
              </Button>
            </div>
          </Card>

          {/* Estatísticas */}
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total de Banners:</span>
                <span className="font-bold">{banners.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Banners Hero:</span>
                <span className="font-bold">{banners.filter(b => b.id.startsWith("hero-banner")).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Outros Banners:</span>
                <span className="font-bold">{banners.filter(b => !b.id.startsWith("hero-banner")).length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Banners */}
        <Card className="p-6 mt-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Banners Atuais</h2>
          {banners.length === 0 ? (
            <p className="text-gray-400">Nenhum banner encontrado</p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{banner.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      banner.id.startsWith("hero-banner") 
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {banner.id.startsWith("hero-banner") ? "HERO" : "OUTRO"}
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
          )}
        </Card>

        {/* Dados Raw do localStorage */}
        <Card className="p-6 mt-8 bg-gray-900 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Dados Raw (localStorage)</h2>
          <pre className="bg-black p-4 rounded-lg text-xs overflow-auto max-h-96">
            {localStorageData}
          </pre>
        </Card>
      </div>
    </div>
  )
}



