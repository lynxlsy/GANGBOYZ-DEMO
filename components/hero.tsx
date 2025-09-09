"use client"

import { useState, useEffect } from "react"
import { HeroCarousel } from "@/components/hero-carousel"

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

export function Hero() {
  const [heroBanners, setHeroBanners] = useState<Array<{
    id: string
    imageSrc: string
    alt: string
  }>>([
    {
      id: "hero-banner-1",
      imageSrc: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
      alt: "Gang BoyZ Hero Banner 1"
    }
  ])

  // Carregar banners do localStorage
  useEffect(() => {
    const loadBanners = () => {
      const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
      if (savedBanners) {
        const banners: Banner[] = JSON.parse(savedBanners)
        
        // Procurar apenas pelo primeiro banner hero
        const heroBanner1 = banners.find(banner => banner.id === "hero-banner-1")
        
        if (heroBanner1) {
          const formattedBanners = [
            {
              id: heroBanner1.id,
              imageSrc: heroBanner1.currentImage,
              alt: heroBanner1.name || "Gang BoyZ Hero Banner 1"
            }
          ]
          setHeroBanners(formattedBanners)
        }
      }
    }

    // Carregar inicialmente
    loadBanners()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-homepage-banners") {
        loadBanners()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadBanners()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerUpdated', handleCustomStorageChange)
    }
  }, [])

  console.log('🎯 Hero component - Banners carregados:', heroBanners)
  
  return <HeroCarousel banners={heroBanners} autoPlayInterval={4000} />
}