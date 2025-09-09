"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Eye, Save, RefreshCw, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { InlineCropViewport } from "@/components/inline-crop-viewport"

interface CropMetadata {
  src: string
  ratio: string  // "1920x650"
  scale: number
  tx: number     // translateX relativo (-1..1)
  ty: number     // translateY relativo (-1..1)
}

interface Banner {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: CropMetadata
}

export default function HomepageBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bannerText, setBannerText] = useState("SITE DEMONSTRATIVO")
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [bannerEmoji, setBannerEmoji] = useState("")
  const [bannerBgColor, setBannerBgColor] = useState("black")

  // Carregar banners do localStorage
  useEffect(() => {
    loadBanners()
    loadBannerSettings()
  }, [])

  const loadBannerSettings = () => {
    const savedText = localStorage.getItem("gang-boyz-banner-text")
    const savedActive = localStorage.getItem("gang-boyz-banner-active")
    const savedEmoji = localStorage.getItem("gang-boyz-banner-emoji")
    const savedBgColor = localStorage.getItem("gang-boyz-banner-bg-color")
    
    if (savedText) setBannerText(savedText)
    if (savedActive !== null) setIsBannerActive(savedActive === 'true')
    if (savedEmoji) setBannerEmoji(savedEmoji)
    if (savedBgColor) setBannerBgColor(savedBgColor)
  }

  const loadBanners = () => {
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    if (savedBanners) {
      const banners: Banner[] = JSON.parse(savedBanners)
      
      // Verificar se precisa migrar do sistema antigo (hero-banner único para hero-banner-1 e hero-banner-2)
      const hasOldHeroBanner = banners.some(banner => banner.id === "hero-banner")
      const hasNewHeroBanners = banners.some(banner => banner.id.startsWith("hero-banner"))
      
      if (hasOldHeroBanner && !hasNewHeroBanners) {
        // Migrar banner antigo para o novo sistema
        const oldHeroBanner = banners.find(banner => banner.id === "hero-banner")
        if (oldHeroBanner) {
          // Criar dois banners hero baseados no antigo
          const heroBanner1: Banner = {
            ...oldHeroBanner,
            id: "hero-banner-1",
            name: "Banner Principal 1 (Hero)",
            description: "Primeiro banner do carrossel principal da página inicial"
          }
          
          const heroBanner2: Banner = {
            ...oldHeroBanner,
            id: "hero-banner-2", 
            name: "Banner Principal 2 (Hero)",
            description: "Segundo banner do carrossel principal da página inicial",
            currentImage: "/black-streetwear-hoodie-with-white-logo.jpg" // Imagem diferente para o segundo
          }
          
          // Remover banner antigo e adicionar os novos
          const otherBanners = banners.filter(banner => banner.id !== "hero-banner")
          const migratedBanners = [heroBanner1, heroBanner2, ...otherBanners]
          
          setBanners(migratedBanners)
          localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(migratedBanners))
          return
        }
      }
      
      // Verificar se tem apenas um banner hero e criar o segundo se necessário
      const heroBanners = banners.filter(banner => banner.id.startsWith("hero-banner"))
      if (heroBanners.length === 1) {
        const existingHero = heroBanners[0]
        const isFirstBanner = existingHero.id === "hero-banner-1"
        
        const newHeroBanner: Banner = {
          id: isFirstBanner ? "hero-banner-2" : "hero-banner-1",
          name: isFirstBanner ? "Banner Principal 2 (Hero)" : "Banner Principal 1 (Hero)",
          description: isFirstBanner ? "Segundo banner do carrossel principal da página inicial" : "Primeiro banner do carrossel principal da página inicial",
          currentImage: isFirstBanner ? "/black-streetwear-hoodie-with-white-logo.jpg" : "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
          mediaType: "image",
          dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Background da seção hero (abaixo da faixa de aviso)"
        }
        
        const updatedBanners = [...banners, newHeroBanner]
        setBanners(updatedBanners)
        localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(updatedBanners))
        return
      }
      
      setBanners(banners)
    } else {
      // Banners padrão
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
      setBanners(defaultBanners)
      localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(defaultBanners))
    }
  }

  const handleMediaChange = async (bannerId: string, file: File) => {
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato de arquivo não suportado. Use JPG, PNG, WebP, GIF, MP4, WebM ou OGG.")
      return
    }

    // Validar tamanho (máximo 10MB para vídeos, 5MB para imagens)
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '10MB' : '5MB'
      toast.error(`Arquivo muito grande. Máximo ${maxSizeMB}.`)
      return
    }

    try {
      console.log("📁 Iniciando upload do arquivo:", file.name, file.size, "bytes")
      
      // Fazer upload via API
      const formData = new FormData()
      formData.append('file', file)
      
      console.log("📤 Enviando para API /api/uploads...")
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      console.log("📡 Resposta da API:", response.status, response.statusText)

      if (!response.ok) {
        const error = await response.json()
        console.error("❌ Erro na API:", error)
        throw new Error(error.error || 'Erro no upload')
      }

      const uploadResult = await response.json()
      console.log("✅ Resultado do upload:", uploadResult)
      
      // Determinar tipo de mídia
      let mediaType: 'image' | 'video' | 'gif' = 'image'
      if (uploadResult.mime.startsWith('video/')) {
        mediaType = 'video'
      } else if (uploadResult.mime === 'image/gif') {
        mediaType = 'gif'
      }

      // Atualizar banner com nova mídia (apenas URL, não base64)
      console.log("🔄 Atualizando banner:", bannerId)
      const updatedBanners = banners.map(banner => 
        banner.id === bannerId 
          ? { 
              ...banner, 
              currentImage: uploadResult.url, 
              mediaType, 
              cropMetadata: undefined // Resetar metadados de recorte
            }
          : banner
      )
      
      console.log("📝 Banners atualizados:", updatedBanners)
      setBanners(updatedBanners)
      
      // Salvar apenas metadados no localStorage (sem imagens grandes)
      console.log("💾 Salvando no localStorage...")
      const bannersMetadata = updatedBanners.map(banner => ({
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage, // URL apenas
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        cropMetadata: banner.cropMetadata
      }))
      
      console.log("📦 Metadados para salvar:", bannersMetadata)
      localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
      console.log("✅ Salvo no localStorage com sucesso!")
      
      // Sincronizar banner do footer se existir
      const footerBanner = updatedBanners.find(banner => banner.id === "footer-banner")
      if (footerBanner) {
        const footerMetadata = {
          id: footerBanner.id,
          name: footerBanner.name,
          description: footerBanner.description,
          currentImage: footerBanner.currentImage,
          mediaType: footerBanner.mediaType,
          dimensions: footerBanner.dimensions,
          format: footerBanner.format,
          position: footerBanner.position,
          cropMetadata: footerBanner.cropMetadata
        }
        localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(footerMetadata))
      }
      
      // Disparar eventos customizados para atualizar outras abas
      console.log("📡 Disparando eventos de sincronização...")
      window.dispatchEvent(new CustomEvent('bannerUpdated'))
      window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
      console.log("✅ Eventos disparados!")
      
      const mediaTypeText = mediaType === 'video' ? 'Vídeo' : mediaType === 'gif' ? 'GIF' : 'Imagem'
      toast.success(`${mediaTypeText} carregado e salvo com sucesso!`)
      console.log("🎉 Upload concluído com sucesso!")
      
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error("Erro ao carregar arquivo")
    }
  }

  const saveBanners = () => {
    setSaving(true)
    try {
      // Salvar apenas metadados no localStorage (sem imagens grandes)
      const bannersMetadata = banners.map(banner => ({
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage, // URL apenas
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        cropMetadata: banner.cropMetadata
      }))
      
      localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
      
      // Sincronizar banner do footer se existir
      const footerBanner = banners.find(banner => banner.id === "footer-banner")
      if (footerBanner) {
        const footerMetadata = {
          id: footerBanner.id,
          name: footerBanner.name,
          description: footerBanner.description,
          currentImage: footerBanner.currentImage,
          mediaType: footerBanner.mediaType,
          dimensions: footerBanner.dimensions,
          format: footerBanner.format,
          position: footerBanner.position,
          cropMetadata: footerBanner.cropMetadata
        }
        localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(footerMetadata))
      }
      
      // Disparar eventos customizados para atualizar outras abas
      window.dispatchEvent(new CustomEvent('bannerUpdated'))
      window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
      
      toast.success("Banners salvos com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar banners.")
    } finally {
      setSaving(false)
    }
  }

  const deleteBanner = (bannerId: string) => {
    if (bannerId.startsWith("hero-banner")) {
      toast.error("Os banners principais não podem ser excluídos!")
      return
    }

    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    setBanners(updatedBanners)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannersMetadata = updatedBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage, // URL apenas
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
    
    // Se for o banner do footer, também remover do localStorage específico
    if (bannerId === "footer-banner") {
      localStorage.removeItem("gang-boyz-footer-banner")
    }
    
    // Disparar eventos para atualizar componentes
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
    window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
    
    toast.success("Banner excluído com sucesso!")
  }

  const resetBanners = () => {
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
    setBanners(defaultBanners)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannersMetadata = defaultBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage, // URL apenas
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
    
    // Sincronizar banner do footer
    const footerBanner = defaultBanners.find(banner => banner.id === "footer-banner")
    if (footerBanner) {
      const footerMetadata = {
        id: footerBanner.id,
        name: footerBanner.name,
        description: footerBanner.description,
        currentImage: footerBanner.currentImage,
        mediaType: footerBanner.mediaType,
        dimensions: footerBanner.dimensions,
        format: footerBanner.format,
        position: footerBanner.position,
        cropMetadata: footerBanner.cropMetadata
      }
      localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(footerMetadata))
    }
    
    toast.success("Banners resetados para o padrão!")
  }

  // Funções para recorte inline
  const handleCropSave = (bannerId: string, metadata: CropMetadata) => {
    const updatedBanners = banners.map(banner => 
      banner.id === bannerId 
        ? { ...banner, cropMetadata: metadata }
        : banner
    )
    
    setBanners(updatedBanners)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannersMetadata = updatedBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage, // URL apenas
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
    
    // Disparar eventos para atualizar componentes
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
    window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
    
    toast.success("Recorte salvo com sucesso!")
  }

  const handleCropCancel = (bannerId: string) => {
    // Não precisa fazer nada, o componente já gerencia o cancelamento
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Link href="/admin/banners">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Banners
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Image 
                  src="/logo-gang-boyz-new.svg" 
                  alt="Gang BoyZ" 
                  width={80} 
                  height={32} 
                  className="h-8 w-auto filter brightness-110"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Banners da Homepage
                </h1>
                <p className="text-gray-400 text-sm md:text-lg">Gerencie os banners da página inicial com suporte a vídeos e GIFs</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={resetBanners}
              disabled={saving}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
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
                toast.success("Banners Hero criados com sucesso!")
              }}
              disabled={saving}
              className="border-red-600 text-red-300 hover:bg-red-900 hover:text-white text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Criar Banners Hero
            </Button>
            <Button 
              onClick={saveBanners}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {/* Faixa de Aviso */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-700/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-8 bg-red-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Faixa de Aviso</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Label className="font-semibold text-gray-300 mb-2 block">
                Texto do Aviso
              </Label>
              <Input
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Digite o texto do aviso..."
                className="bg-gray-700 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Texto que aparecerá na faixa superior do site
              </p>
            </div>
            
            <div>
              <Label className="font-semibold text-gray-300 mb-2 block">
                Emoji (opcional)
              </Label>
              <div className="flex gap-2">
                <Input
                  value={bannerEmoji}
                  onChange={(e) => setBannerEmoji(e.target.value)}
                  placeholder="🔥"
                  className="bg-gray-700 border-gray-600 text-white w-20"
                />
                <div className="flex gap-1">
                  {["🔥", "⭐", "💥", "🚀", "✨", "🎯", "💎", "⚡"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setBannerEmoji(emoji)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Emoji que aparecerá antes e depois do texto
              </p>
            </div>
            
            <div>
              <Label className="font-semibold text-gray-300 mb-2 block">
                Cor de Fundo
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Preto", value: "black", class: "bg-black" },
                  { name: "Vermelho", value: "red", class: "bg-red-600" },
                  { name: "Sincronizado", value: "sync", class: "bg-gradient-to-r from-red-600 to-blue-600" },
                  { name: "Azul", value: "blue", class: "bg-blue-600" },
                  { name: "Amarelo", value: "yellow", class: "bg-yellow-500" },
                  { name: "Verde", value: "green", class: "bg-green-600" }
                ].map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBannerBgColor(color.value)}
                    className={`h-8 rounded border-2 ${
                      bannerBgColor === color.value ? 'border-white' : 'border-gray-600'
                    } ${color.class} flex items-center justify-center text-xs text-white font-medium`}
                    title={color.name}
                  >
                    {color.name === "Sincronizado" ? "SYNC" : color.name.charAt(0)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Cor de fundo da faixa de aviso
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="banner-active"
                checked={isBannerActive}
                onChange={(e) => setIsBannerActive(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
              />
              <Label htmlFor="banner-active" className="text-gray-300 font-medium">
                Ativar Faixa de Aviso
              </Label>
            </div>
            
            <Button
              onClick={() => {
                localStorage.setItem("gang-boyz-banner-text", bannerText)
                localStorage.setItem("gang-boyz-banner-active", isBannerActive.toString())
                localStorage.setItem("gang-boyz-banner-emoji", bannerEmoji)
                localStorage.setItem("gang-boyz-banner-bg-color", bannerBgColor)
                window.dispatchEvent(new CustomEvent('bannerSettingsUpdated'))
                toast.success("Configurações da faixa salvas!")
              }}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Faixa
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 mb-2">Preview:</p>
            <div className={`h-8 flex items-center overflow-hidden rounded ${
              bannerBgColor === 'black' ? 'bg-black' :
              bannerBgColor === 'red' ? 'bg-red-600' :
              bannerBgColor === 'blue' ? 'bg-blue-600' :
              bannerBgColor === 'yellow' ? 'bg-yellow-500' :
              bannerBgColor === 'green' ? 'bg-green-600' :
              bannerBgColor === 'sync' ? 'bg-gradient-to-r from-red-600 to-blue-600' :
              'bg-black'
            }`}>
              {isBannerActive ? (
                <div className="flex animate-scroll text-white font-bold text-sm tracking-wider whitespace-nowrap">
                  <span className="mr-8">{bannerEmoji} {bannerText} {bannerEmoji}</span>
                  <span className="mr-8">{bannerEmoji} {bannerText} {bannerEmoji}</span>
                  <span className="mr-8">{bannerEmoji} {bannerText} {bannerEmoji}</span>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Faixa desativada</div>
              )}
            </div>
          </div>
        </Card>

        {/* Carrossel Hero Section */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-700/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-8 bg-red-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Carrossel Hero - Banners Principais</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Estes banners aparecem no carrossel principal da homepage com alternância automática a cada 4 segundos.
            Use as setas laterais ou os indicadores para navegar manualmente.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.filter(banner => banner.id.startsWith("hero-banner")).map((banner) => (
              <div key={banner.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{banner.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                      CARROSSEL
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{banner.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold text-gray-300 text-sm">Tipo:</Label>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      banner.mediaType === 'video' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      banner.mediaType === 'gif' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {banner.mediaType === 'video' ? '🎥 Vídeo' : 
                       banner.mediaType === 'gif' ? '🎞️ GIF' : '🖼️ Imagem'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold text-gray-300 text-sm">Dimensões:</Label>
                    <span className="text-xs text-gray-400">{banner.dimensions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Banners List */}
        <div className="space-y-6 md:space-y-8">
          {banners.map((banner) => (
            <Card key={banner.id} className="p-4 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Banner Info */}
                <div>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{banner.name}</h3>
                    {!banner.id.startsWith("hero-banner") && (
                      <Button
                        onClick={() => deleteBanner(banner.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-900 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{banner.description}</p>
                  
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Tipo de Mídia:</Label>
                      <span className={`text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-medium ${
                        banner.mediaType === 'video' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        banner.mediaType === 'gif' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {banner.mediaType === 'video' ? '🎥 Vídeo' : 
                         banner.mediaType === 'gif' ? '🎞️ GIF' : '🖼️ Imagem'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Dimensões:</Label>
                      <span className="text-xs md:text-sm text-gray-400">{banner.dimensions}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Formato:</Label>
                      <span className="text-xs md:text-sm text-gray-400">{banner.format}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Posição:</Label>
                      <span className="text-xs md:text-sm text-gray-400">{banner.position}</span>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label htmlFor={`file-${banner.id}`} className="font-semibold text-gray-300">
                      Nova Mídia
                    </Label>
                    <Input
                      id={`file-${banner.id}`}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleMediaChange(banner.id, file)
                      }}
                      className="cursor-pointer bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    />
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="text-green-400">Imagens:</span> máximo 5MB (JPG, PNG, WebP, GIF)<br/>
                      <span className="text-blue-400">Vídeos:</span> máximo 10MB (MP4, WebM, OGG)
                    </p>
                  </div>
                </div>

                {/* Banner Preview */}
                <div>
                  <Label className="font-semibold text-gray-300 text-sm md:text-base mb-3 md:mb-4 block">
                    Preview:
                  </Label>
                  
                  {banner.mediaType === 'image' ? (
                    <InlineCropViewport
                      imageUrl={banner.currentImage}
                      cropMetadata={banner.cropMetadata}
                      onSave={(metadata) => handleCropSave(banner.id, metadata)}
                      onCancel={() => handleCropCancel(banner.id)}
                      bannerName={banner.name}
                      bannerType={banner.id.startsWith('hero-banner') ? 'hero' : 'other'}
                    />
                  ) : (
                    <div 
                      className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <video
                        src={banner.currentImage}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        loop
                      />
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/70 backdrop-blur-sm text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium border border-white/20">
                      <Eye className="h-3 w-3 inline mr-1" />
                        {banner.mediaType === 'video' ? 'Vídeo' : 'GIF'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Instruções de Uso</h3>
          <div className="space-y-3 text-blue-800">
            <div>
              <h4 className="font-semibold">Dimensões Recomendadas:</h4>
              <p className="text-sm">Use imagens com proporção 16:9 (1920x1080px) para melhor qualidade.</p>
            </div>
            <div>
              <h4 className="font-semibold">Formatos Suportados:</h4>
              <p className="text-sm">JPG, PNG e WebP. WebP oferece melhor compressão mantendo a qualidade.</p>
            </div>
            <div>
              <h4 className="font-semibold">Tamanho do Arquivo:</h4>
              <p className="text-sm">Máximo 5MB por imagem para garantir carregamento rápido.</p>
            </div>
            <div>
              <h4 className="font-semibold">Dica:</h4>
              <p className="text-sm">Use imagens com boa resolução mas otimizadas para web para melhor performance.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
