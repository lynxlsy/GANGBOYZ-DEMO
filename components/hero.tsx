"use client"

import { useState, useEffect } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { useBanner } from "@/hooks/use-banner"

interface HeroProps {
  onEditBannerImage?: (bannerId: string) => void
}

export function Hero({ onEditBannerImage }: HeroProps) {
  const [heroBanners, setHeroBanners] = useState<Array<{
    id: string
    imageSrc: string
    alt: string
  }>>([])

  // Hooks para banners locais
  const heroBanner1 = useBanner('hero-banner-1')
  const heroBanner2 = useBanner('hero-banner-2')

  // Carregar banners do localStorage
  useEffect(() => {
    const loadBanners = () => {
      const localBanners = []
      
      // Carregar banner 1
      if (heroBanner1.banner) {
        // Check if the image is a data URL (base64) - don't add cache buster
        const banner1Src = heroBanner1.banner.currentImage.startsWith('data:') 
          ? heroBanner1.banner.currentImage 
          : `${heroBanner1.banner.currentImage}?v=${Date.now()}`
        console.log('Hero banner 1 data:', heroBanner1.banner, 'Image src:', banner1Src)
        localBanners.push({
          id: "hero-banner-1",
          imageSrc: banner1Src,
          alt: heroBanner1.banner.name || "Gang BoyZ Hero Banner 1"
        })
      }
      
      // Carregar banner 2
      if (heroBanner2.banner) {
        // Check if the image is a data URL (base64) - don't add cache buster
        const banner2Src = heroBanner2.banner.currentImage.startsWith('data:') 
          ? heroBanner2.banner.currentImage 
          : `${heroBanner2.banner.currentImage}?v=${Date.now()}`
        console.log('Hero banner 2 data:', heroBanner2.banner, 'Image src:', banner2Src)
        localBanners.push({
          id: "hero-banner-2", 
          imageSrc: banner2Src,
          alt: heroBanner2.banner.name || "Gang BoyZ Hero Banner 2"
        })
      }

      console.log('Using local banners:', localBanners)
      setHeroBanners(localBanners)
    }

    // Carregar inicialmente
    loadBanners()

    // Escutar atualizações de sincronização
    const handleBannerSyncUpdate = (event: CustomEvent) => {
      console.log('🔄 Atualização de sincronização recebida:', event.detail)
      loadBanners()
    }

    // Escutar atualizações específicas da homepage
    const handleHomepageBannerUpdate = (event: CustomEvent) => {
      console.log('🏠 Atualização de banner da homepage:', event.detail)
      // Add a small delay to ensure localStorage is updated
      setTimeout(() => {
        loadBanners()
      }, 100)
    }

    // Escutar sincronização forçada
    const handleForceSync = (event: CustomEvent) => {
      console.log('🔄 Sincronização forçada recebida:', event.detail)
      loadBanners()
    }

    // Escutar eventos de sincronização
    window.addEventListener('bannerSyncUpdate', handleBannerSyncUpdate as EventListener)
    window.addEventListener('homepageBannerUpdate', handleHomepageBannerUpdate as EventListener)
    window.addEventListener('forceBannerSync', handleForceSync as EventListener)
    window.addEventListener('bannerUpdated', handleHomepageBannerUpdate as EventListener)

    return () => {
      window.removeEventListener('bannerSyncUpdate', handleBannerSyncUpdate as EventListener)
      window.removeEventListener('homepageBannerUpdate', handleHomepageBannerUpdate as EventListener)
      window.removeEventListener('forceBannerSync', handleForceSync as EventListener)
      window.removeEventListener('bannerUpdated', handleHomepageBannerUpdate as EventListener)
    }
  }, [heroBanner1.banner, heroBanner2.banner])

  return <HeroCarousel banners={heroBanners} autoPlayInterval={5000} onEditBannerImage={onEditBannerImage} />
}