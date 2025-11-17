'use client'

import { useState, useEffect } from 'react'

export function FooterBanner() {
  const [footerBanner, setFooterBanner] = useState<any>(null)

  // Carregar banner Footer do localStorage
  useEffect(() => {
    const loadFooterBanner = () => {
      const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
      if (savedBanners) {
        try {
          const banners: any[] = JSON.parse(savedBanners)
          const footerBannerData = banners.find(banner => banner.id === "footer-banner")
          if (footerBannerData) {
            setFooterBanner(footerBannerData)
          }
        } catch (error) {
          console.error("Erro ao carregar banner Footer:", error)
        }
      }
    }

    // Carregar inicialmente
    loadFooterBanner()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-homepage-banners") {
        loadFooterBanner()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadFooterBanner()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerUpdated', handleCustomStorageChange)
    }
  }, [])

  if (!footerBanner) {
    return null // Não renderizar se não houver banner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-full">
        {footerBanner.mediaType === 'video' ? (
          <video
            src={footerBanner.currentImage}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={footerBanner.currentImage}
            alt={footerBanner.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </div>
  )
}
