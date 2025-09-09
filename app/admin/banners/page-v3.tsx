"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { BannerCropEditor } from "@/components/banner-crop-editor"
import { BannerRendererV2 } from "@/components/banner-renderer-v2"
import { BannerConfig, BannerCropManager } from '@/lib/banner-crop'
import { Upload, Save, Eye, Crop } from 'lucide-react'

export default function BannerAdminV3() {
  const [selectedImage, setSelectedImage] = useState<string>("/urban-streetwear-model-in-black-hoodie-against-dar.jpg")
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit')
  const [cropData, setCropData] = useState<any>(null)
  const [savedConfig, setSavedConfig] = useState<BannerConfig | null>(null)
  
  const manager = BannerCropManager.getInstance()
  const bannerId = "hero-banner"
  const containerWidth = 1920
  const containerHeight = 1080

  // Carregar configuração existente
  useEffect(() => {
    const config = manager.loadCropConfig(bannerId)
    if (config) {
      setSavedConfig(config)
      setCropData(config.cropData)
    }
  }, [bannerId, manager])

  const handleCropChange = (newCropData: any) => {
    setCropData(newCropData)
  }

  const handleSave = (config: BannerConfig) => {
    setSavedConfig(config)
    
    // Salvar no localStorage do sistema antigo para compatibilidade
    const legacyBanner = {
      id: bannerId,
      name: "Banner Principal",
      description: "Banner principal da homepage",
      currentImage: selectedImage,
      mediaType: "image",
      dimensions: "1920x1080",
      format: "JPG",
      position: "hero",
      cropMetadata: {
        src: selectedImage,
        ratio: "1920x1080",
        scale: config.cropData.scale,
        tx: config.cropData.x / config.imageWidth,
        ty: config.cropData.y / config.imageHeight
      }
    }
    
    const existingBanners = JSON.parse(localStorage.getItem("gang-boyz-homepage-banners") || "[]")
    const updatedBanners = existingBanners.filter((b: any) => b.id !== bannerId)
    updatedBanners.push(legacyBanner)
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(updatedBanners))
    
    // Disparar evento para atualizar a homepage
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
    
    alert('Banner salvo com sucesso!')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string
        setSelectedImage(imageSrc)
        setCropData(null) // Reset crop data for new image
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Banner Principal (Hero) - V3</h1>
          <p className="text-gray-400">
            Sistema completo de crop com preview em tempo real
          </p>
        </div>

        {/* Upload de Imagem */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Nova Imagem</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Escolher Imagem
            </label>
            <span className="text-sm text-gray-400">
              JPG, PNG, WebP - Máximo 5MB
            </span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setPreviewMode('edit')}
            variant={previewMode === 'edit' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Crop className="w-4 h-4" />
            Editar Crop
          </Button>
          <Button
            onClick={() => setPreviewMode('preview')}
            variant={previewMode === 'preview' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview Final
          </Button>
        </div>

        {/* Área Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor/Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {previewMode === 'edit' ? 'Editor de Crop' : 'Preview Final'}
            </h2>
            
            {previewMode === 'edit' ? (
              <BannerCropEditor
                bannerId={bannerId}
                imageSrc={selectedImage}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                onCropChange={handleCropChange}
                onSave={handleSave}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Preview da Homepage</h3>
                  <p className="text-sm text-gray-400">
                    Como o banner aparecerá na homepage
                  </p>
                </div>
                
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <BannerRendererV2
                    bannerId={bannerId}
                    imageSrc={selectedImage}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    className="w-full h-full"
                    alt="Preview Banner"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Informações e Controles */}
          <div className="space-y-6">
            {/* Informações do Crop */}
            {cropData && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-3">Informações do Crop</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posição X:</span>
                    <span className="text-white">{cropData.x?.toFixed(0) || 0}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posição Y:</span>
                    <span className="text-white">{cropData.y?.toFixed(0) || 0}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Largura:</span>
                    <span className="text-white">{cropData.width?.toFixed(0) || 0}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Altura:</span>
                    <span className="text-white">{cropData.height?.toFixed(0) || 0}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Escala:</span>
                    <span className="text-white">{cropData.scale?.toFixed(2) || 1}×</span>
                  </div>
                </div>
              </div>
            )}

            {/* Configuração Salva */}
            {savedConfig && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-green-400">✓ Configuração Salva</h3>
                <p className="text-sm text-gray-300">
                  O banner foi salvo e será aplicado na homepage.
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  Última atualização: {new Date().toLocaleString()}
                </div>
              </div>
            )}

            {/* Instruções */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-blue-400">Como Usar</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Arraste a imagem para reposicionar</li>
                <li>• Use o slider de zoom para ajustar o tamanho</li>
                <li>• Clique em "Salvar Crop" para aplicar</li>
                <li>• Use "Preview Final" para ver o resultado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



