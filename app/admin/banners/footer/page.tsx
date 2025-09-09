"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react"
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

interface FooterBanner {
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

export default function FooterBannerPage() {
  const [footerBanner, setFooterBanner] = useState<FooterBanner>({
    id: "footer-banner",
    name: "Banner Footer",
    description: "Banner antes do footer",
    currentImage: "/placeholder.jpg",
    mediaType: "image",
    dimensions: "1920x650px (≈2.95:1)",
    format: "JPG",
    position: "footer"
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Carregar banner do footer do localStorage
  useEffect(() => {
    const savedBanner = localStorage.getItem("gang-boyz-footer-banner")
    if (savedBanner) {
      setFooterBanner(JSON.parse(savedBanner))
    }
  }, [])

  // Salvar banner do footer no localStorage
  const saveFooterBanner = () => {
    setSaving(true)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannerMetadata = {
      id: footerBanner.id,
      name: footerBanner.name,
      description: footerBanner.description,
      currentImage: footerBanner.currentImage, // URL apenas
      mediaType: footerBanner.mediaType,
      dimensions: footerBanner.dimensions,
      format: footerBanner.format,
      position: footerBanner.position,
      cropMetadata: footerBanner.cropMetadata
    }
    
    localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(bannerMetadata))
    
    // Disparar evento customizado para atualizar a homepage
    window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
    
    setTimeout(() => {
      setSaving(false)
      toast.success("Banner do footer salvo com sucesso!")
    }, 1000)
  }

  // Upload de imagem
  const handleMediaChange = async (file: File) => {
    if (!file) return

    // Validar tipo de arquivo
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use JPG, PNG, WebP, GIF, MP4, WebM ou OGG.")
      return
    }

    // Validar tamanho do arquivo
    const maxSizeImage = 5 * 1024 * 1024 // 5MB para imagens/GIFs
    const maxSizeVideo = 10 * 1024 * 1024 // 10MB para vídeos
    
    if (validImageTypes.includes(file.type) && file.size > maxSizeImage) {
      toast.error("Arquivo muito grande. Máximo 5MB para imagens/GIFs.")
      return
    }
    
    if (validVideoTypes.includes(file.type) && file.size > maxSizeVideo) {
      toast.error("Arquivo muito grande. Máximo 10MB para vídeos.")
      return
    }

    setUploadingImage(true)
    
    try {
      // Fazer upload via API
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro no upload')
      }

      const uploadResult = await response.json()
      const mediaType = validImageTypes.includes(file.type) ? 'image' : 'video'
      
      // Atualizar banner com nova mídia (apenas URL, não base64)
      const updatedBanner = {
        ...footerBanner,
        currentImage: uploadResult.url,
        mediaType: mediaType as 'image' | 'video' | 'gif',
        cropMetadata: undefined // Resetar metadados de recorte
      }
      
      setFooterBanner(updatedBanner)
      
      // Salvar apenas metadados no localStorage (sem imagens grandes)
      const bannerMetadata = {
        id: updatedBanner.id,
        name: updatedBanner.name,
        description: updatedBanner.description,
        currentImage: updatedBanner.currentImage, // URL apenas
        mediaType: updatedBanner.mediaType,
        dimensions: updatedBanner.dimensions,
        format: updatedBanner.format,
        position: updatedBanner.position,
        cropMetadata: updatedBanner.cropMetadata
      }
      
      localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(bannerMetadata))
      
      // Disparar evento customizado para atualizar a homepage
      window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
      
      setUploadingImage(false)
      const mediaTypeText = mediaType === 'video' ? 'Vídeo' : mediaType === 'gif' ? 'GIF' : 'Imagem'
      toast.success(`${mediaTypeText} carregado e salvo com sucesso!`)
      
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error("Erro ao carregar arquivo")
      setUploadingImage(false)
    }
  }

  // Funções para recorte inline
  const handleCropSave = (metadata: CropMetadata) => {
    const updatedBanner = {
      ...footerBanner,
      cropMetadata: metadata
    }
    
    setFooterBanner(updatedBanner)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannerMetadata = {
      id: updatedBanner.id,
      name: updatedBanner.name,
      description: updatedBanner.description,
      currentImage: updatedBanner.currentImage, // URL apenas
      mediaType: updatedBanner.mediaType,
      dimensions: updatedBanner.dimensions,
      format: updatedBanner.format,
      position: updatedBanner.position,
      cropMetadata: updatedBanner.cropMetadata
    }
    
    localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(bannerMetadata))
    
    // Disparar evento customizado para atualizar a homepage
    window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
    
    toast.success("Recorte salvo com sucesso!")
  }

  const handleCropCancel = () => {
    // Não precisa fazer nada, o componente já gerencia o cancelamento
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
                  Banner do Footer
                </h1>
                <p className="text-gray-400 text-sm md:text-lg">Gerencie o banner que aparece antes do footer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-red-500" />
              Configurações do Banner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300 font-semibold">Nome do Banner</Label>
                <Input
                  value={footerBanner.name}
                  onChange={(e) => setFooterBanner(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 font-semibold">Descrição</Label>
                <Input
                  value={footerBanner.description}
                  onChange={(e) => setFooterBanner(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                />
              </div>
            </div>

            {/* Upload de Mídia */}
            <div className="space-y-4">
              <Label className="text-gray-300 font-semibold">Nova Mídia</Label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-20 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600">
                  {footerBanner.currentImage ? (
                    footerBanner.mediaType === 'video' ? (
                      <video
                        src={footerBanner.currentImage}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={footerBanner.currentImage}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleMediaChange(file)
                    }}
                    className="cursor-pointer bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="text-green-400">Imagens:</span> máximo 5MB (JPG, PNG, WebP, GIF)<br/>
                    <span className="text-blue-400">Vídeos:</span> máximo 10MB (MP4, WebM, OGG)
                  </p>
                </div>
              </div>
            </div>

            {/* URL da Mídia */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-semibold">URL da Mídia</Label>
              <Input
                placeholder="Ou cole a URL da imagem/vídeo"
                value={footerBanner.currentImage}
                onChange={(e) => setFooterBanner(prev => ({ ...prev, currentImage: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              />
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <Label className="text-gray-300 font-semibold">Preview do Banner</Label>
              
              {footerBanner.mediaType === 'image' ? (
                <InlineCropViewport
                  imageUrl={footerBanner.currentImage}
                  cropMetadata={footerBanner.cropMetadata}
                  onSave={handleCropSave}
                  onCancel={handleCropCancel}
                  bannerName="Banner Footer"
                  bannerType="other"
                />
              ) : (
                <div 
                  className="relative w-full overflow-hidden rounded-lg border border-gray-600"
                  style={{ aspectRatio: '16/9' }}
                >
                  <video
                    src={footerBanner.currentImage}
                    alt={footerBanner.description}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        ÚLTIMA CHANCE
                      </h3>
                      <div className="w-16 h-1 mx-auto rounded mb-2 bg-red-500"></div>
                      <p className="text-white/90 text-sm md:text-base mb-4 max-w-md">
                        Não perca as últimas peças da coleção. Descontos especiais por tempo limitado!
                      </p>
                      <button className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors text-sm">
                        COMPRAR AGORA
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <Button
                onClick={saveFooterBanner}
                disabled={saving || uploadingImage}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Banner"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações */}
        <Card className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                O banner aparece antes do footer em todas as páginas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Suporta imagens, vídeos e GIFs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                Largura total do site (edge to edge)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Altura responsiva: 384px (mobile) / 448px (desktop)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
