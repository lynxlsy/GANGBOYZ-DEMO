"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"

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

export function FooterBanner() {
  const [footerBanner, setFooterBanner] = useState<FooterBanner | null>(null)
  const [footerMediaType, setFooterMediaType] = useState<'image' | 'video' | 'gif'>('image')
  const [footerCropMetadata, setFooterCropMetadata] = useState<CropMetadata | undefined>(undefined)
  const { activeTheme } = useTheme()

  // Carregar banner do footer do localStorage
  const loadFooterBanner = () => {
    // Primeiro tenta carregar do localStorage específico do footer
    const savedBanner = localStorage.getItem("gang-boyz-footer-banner")
    if (savedBanner) {
      const parsedBanner: FooterBanner = JSON.parse(savedBanner)
      setFooterBanner(parsedBanner)
      setFooterMediaType(parsedBanner.mediaType || 'image')
      setFooterCropMetadata(parsedBanner.cropMetadata)
    } else {
      // Se não existir, tenta carregar dos banners da homepage
      const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
      if (savedBanners) {
        const banners: FooterBanner[] = JSON.parse(savedBanners)
        const footerBannerData = banners.find(banner => banner.id === "footer-banner")
        if (footerBannerData) {
          setFooterBanner(footerBannerData)
          setFooterMediaType(footerBannerData.mediaType || 'image')
          setFooterCropMetadata(footerBannerData.cropMetadata)
        } else {
          // Banner padrão
          const defaultBanner: FooterBanner = {
            id: "footer-banner",
            name: "Banner Footer",
            description: "Banner antes do footer",
            currentImage: "/placeholder.jpg",
            mediaType: "image",
            dimensions: "1920x400",
            format: "JPG",
            position: "footer"
          }
          setFooterBanner(defaultBanner)
          setFooterMediaType('image')
        }
      } else {
        // Banner padrão
        const defaultBanner: FooterBanner = {
          id: "footer-banner",
          name: "Banner Footer",
          description: "Banner antes do footer",
          currentImage: "/placeholder.jpg",
          mediaType: "image",
          dimensions: "1920x400",
          format: "JPG",
          position: "footer"
        }
        setFooterBanner(defaultBanner)
        setFooterMediaType('image')
      }
    }
  }

  useEffect(() => {
    loadFooterBanner()
    
    // Escutar mudanças no banner
    const handleBannerUpdate = () => {
      loadFooterBanner()
    }
    
    // Escutar mudanças nos banners da homepage também
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-homepage-banners" || e.key === "gang-boyz-footer-banner") {
        loadFooterBanner()
      }
    }
    
    window.addEventListener('footerBannerUpdated', handleBannerUpdate)
    window.addEventListener('bannerUpdated', handleBannerUpdate)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('footerBannerUpdated', handleBannerUpdate)
      window.removeEventListener('bannerUpdated', handleBannerUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Não renderizar se não há banner ou se foi excluído
  if (!footerBanner || !footerBanner.currentImage || footerBanner.currentImage === "/placeholder.jpg") {
    return null
  }

  return (
    <section className="relative w-full pt-24">
      {/* Banner com largura total do site */}
      <div className="relative w-screen h-[650px] overflow-hidden -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)]">
        {footerMediaType === 'video' ? (
          <video
            src={footerBanner.currentImage}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            style={{
              transform: footerCropMetadata ? 
                `translate3d(${footerCropMetadata.tx * 50}%, ${footerCropMetadata.ty * 50}%, 0) scale(${footerCropMetadata.scale})` : 
                'none',
              willChange: 'transform',
              transformOrigin: 'center'
            }}
          />
        ) : (
          <img
            src={footerBanner.currentImage}
            alt={footerBanner.description}
            className="w-full h-full object-contain"
            style={{
              transform: footerCropMetadata ? 
                `translate3d(${footerCropMetadata.tx * 50}%, ${footerCropMetadata.ty * 50}%, 0) scale(${footerCropMetadata.scale})` : 
                'none',
              willChange: 'transform',
              transformOrigin: 'center'
            }}
          />
        )}
        
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
      </div>
    </section>
  )
}
