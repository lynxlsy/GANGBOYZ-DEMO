"use client"

import React, { useState, useEffect, useRef } from 'react'
import { BannerConfig, BannerCropManager } from '@/lib/banner-crop'

interface BannerRendererV2Props {
  bannerId: string
  imageSrc: string
  containerWidth?: number
  containerHeight?: number
  className?: string
  alt?: string
}

export function BannerRendererV2({
  bannerId,
  imageSrc,
  containerWidth = 1920,
  containerHeight = 1080,
  className = "",
  alt = "Banner"
}: BannerRendererV2Props) {
  const [config, setConfig] = useState<BannerConfig | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const manager = BannerCropManager.getInstance()
  const imageRef = useRef<HTMLImageElement>(null)

  // Carregar configuração de crop
  useEffect(() => {
    const loadConfig = () => {
      // Primeiro tenta carregar do sistema novo
      const savedConfig = manager.loadCropConfig(bannerId)
      if (savedConfig) {
        setConfig(savedConfig)
        return
      }

      // Se não encontrar, tenta carregar do sistema antigo
      const legacyBanners = localStorage.getItem("gang-boyz-homepage-banners")
      if (legacyBanners) {
        const banners = JSON.parse(legacyBanners)
        const heroBannerData = banners.find((banner: any) => banner.id === bannerId)
        if (heroBannerData && heroBannerData.cropMetadata) {
          // Converter dados do sistema antigo para o novo
          const legacyCrop = heroBannerData.cropMetadata
          const convertedConfig: BannerConfig = {
            id: bannerId,
            src: heroBannerData.currentImage || imageSrc,
            cropData: {
              x: legacyCrop.tx, // Usar valores diretos do admin
              y: legacyCrop.ty,
              width: containerWidth,
              height: containerHeight,
              scale: legacyCrop.scale,
              rotation: 0
            },
            containerWidth,
            containerHeight,
            imageWidth: 1920, // Assumir dimensões padrão
            imageHeight: 1080
          }
          setConfig(convertedConfig)
          return
        }
      }

      // Configuração padrão se não houver crop salvo - mostrar imagem inteira
      const defaultConfig: BannerConfig = {
        id: bannerId,
        src: imageSrc,
        cropData: {
          x: 0,
          y: 0,
          width: containerWidth,
          height: containerHeight,
          scale: 1, // Será calculado quando a imagem carregar
          rotation: 0
        },
        containerWidth,
        containerHeight,
        imageWidth: 0,
        imageHeight: 0
      }
      setConfig(defaultConfig)
      
      // Salvar configuração padrão para evitar problemas futuros
      manager.saveCropConfig(bannerId, defaultConfig)
    }

    loadConfig()

    // Escutar mudanças no localStorage (sistema antigo e novo)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `banner-crop-${bannerId}` || e.key === "gang-boyz-homepage-banners") {
        loadConfig()
      }
    }

    // Escutar eventos customizados
    const handleCustomChange = () => {
      loadConfig()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerUpdated', handleCustomChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerUpdated', handleCustomChange)
    }
  }, [bannerId, imageSrc, containerWidth, containerHeight, manager])

  // Carregar dimensões da imagem
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      setImageDimensions({ width: naturalWidth, height: naturalHeight })
      setImageLoaded(true)
      
      // Calcular escala inicial para mostrar a imagem inteira
      const scaleX = containerWidth / naturalWidth
      const scaleY = containerHeight / naturalHeight
      const initialScale = Math.min(scaleX, scaleY) // Usar menor escala para mostrar imagem inteira
      
      // Atualizar configuração com dimensões reais da imagem e escala inicial
      if (config) {
        const updatedConfig = {
          ...config,
          imageWidth: naturalWidth,
          imageHeight: naturalHeight,
          cropData: {
            ...config.cropData,
            scale: initialScale
          }
        }
        setConfig(updatedConfig)
      }
    }
  }

  // Calcular transform CSS
  const getTransform = () => {
    if (!config || !imageLoaded) return 'translate3d(0%, 0%, 0) scale(1)'
    
    return manager.calculateTransform(config)
  }

  // Calcular estilo do container
  const getContainerStyle = () => {
    return {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative' as const,
      backgroundColor: '#000000' // Fundo preto para áreas não cobertas pela imagem
    }
  }

  // Calcular estilo da imagem
  const getImageStyle = () => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const, // Usar 'contain' para mostrar a imagem inteira
      transform: getTransform(),
      transformOrigin: 'center center',
      willChange: 'transform',
      transition: 'transform 0.3s ease-out'
    }
  }

  return (
    <div className={className} style={getContainerStyle()}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        style={getImageStyle()}
        onLoad={handleImageLoad}
        onError={(e) => {
          console.error(`Erro ao carregar imagem: ${imageSrc}`)
          // Fallback para placeholder se a imagem falhar
          e.currentTarget.src = "/placeholder.jpg"
        }}
      />
      
      {/* Indicador de carregamento */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
    </div>
  )
}

// Hook para usar o renderer de banner
export function useBannerRenderer(bannerId: string) {
  const manager = BannerCropManager.getInstance()
  
  const getConfig = () => {
    return manager.loadCropConfig(bannerId)
  }
  
  const clearConfig = () => {
    manager.clearCropConfig(bannerId)
  }
  
  const saveConfig = (config: BannerConfig) => {
    manager.saveCropConfig(bannerId, config)
  }
  
  return {
    getConfig,
    clearConfig,
    saveConfig
  }
}
