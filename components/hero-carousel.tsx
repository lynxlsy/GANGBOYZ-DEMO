"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBanner } from '@/hooks/use-banner'

interface HeroCarouselProps {
  banners: Array<{
    id: string
    imageSrc: string
    alt: string
  }>
  autoPlayInterval?: number
  onEditBannerImage?: (bannerId: string) => void
}

export function HeroCarousel({ banners, autoPlayInterval = 1000, onEditBannerImage }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [desktopHeight, setDesktopHeight] = useState(750)
  const [mobileHeight, setMobileHeight] = useState(650)
  const [isHovering, setIsHovering] = useState(false)
  
  // Auto-play effect
  useEffect(() => {
    if (banners.length <= 1 || isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, autoPlayInterval)
    
    return () => clearInterval(interval)
  }, [banners.length, autoPlayInterval, isHovering])
  
  // Load saved heights from localStorage
  useEffect(() => {
    const savedDesktopHeight = localStorage.getItem("gang-boyz-banner-desktop-height")
    const savedMobileHeight = localStorage.getItem("gang-boyz-banner-mobile-height")
    
    if (savedDesktopHeight) {
      setDesktopHeight(parseInt(savedDesktopHeight))
    }
    
    if (savedMobileHeight) {
      setMobileHeight(parseInt(savedMobileHeight))
    }
    
    // Listen for height changes
    const handleHeightChange = (event: CustomEvent) => {
      const { desktopHeight: newDesktopHeight, mobileHeight: newMobileHeight } = event.detail
      setDesktopHeight(newDesktopHeight)
      setMobileHeight(newMobileHeight)
    }
    
    window.addEventListener('bannerHeightChanged', handleHeightChange as EventListener)
    
    return () => {
      window.removeEventListener('bannerHeightChanged', handleHeightChange as EventListener)
    }
  }, [])
  
  // Buscar dados dos banners com crop
  const heroBanner1 = useBanner('hero-banner-1')
  const heroBanner2 = useBanner('hero-banner-2')

  // Reset index if banners change
  useEffect(() => {
    setCurrentIndex(0)
  }, [banners])

  // Manual navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Se não há banners, não renderiza nada
  if (banners.length === 0) {
    return null
  }

  // Se só tem 1 banner, renderiza sem navegação
  if (banners.length === 1) {
    return (
      <section 
        className="hero-section relative w-full flex items-center justify-center overflow-hidden bg-black" 
        style={{ 
          height: `${desktopHeight}px`,
          minHeight: `${desktopHeight}px`
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .hero-section {
              height: ${mobileHeight}px !important;
              min-height: ${mobileHeight}px !important;
            }
          }
        `}</style>
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <img
            src={banners[0].imageSrc}
            alt={banners[0].alt}
            className="w-full h-full object-cover"
            style={{
              transform: banners[0].id === "hero-banner-1" && heroBanner1.banner?.cropMetadata ? 
                `translate(${heroBanner1.banner.cropMetadata.tx || 0}px, ${heroBanner1.banner.cropMetadata.ty || 0}px) scale(${heroBanner1.banner.cropMetadata.scale || 1})` :
                banners[0].id === "hero-banner-2" && heroBanner2.banner?.cropMetadata ?
                `translate(${heroBanner2.banner.cropMetadata.tx || 0}px, ${heroBanner2.banner.cropMetadata.ty || 0}px) scale(${heroBanner2.banner.cropMetadata.scale || 1})` :
                undefined
            }}
            onError={(e) => {
              console.log(`❌ Erro ao carregar imagem: ${banners[0].imageSrc}`)
              // Fallback to default image but don't override the actual banner data
              // This is just a visual fallback, not a data update
              e.currentTarget.src = "/placeholder-default.svg"
            }}
            onLoad={() => {
              console.log(`✅ Imagem carregada com sucesso: ${banners[0].imageSrc}`)
            }}
            onClick={() => onEditBannerImage && onEditBannerImage(banners[0].id)}
          />
          
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradiente vertical sobre o banner */}
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent"></div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 right-10 w-4 h-4 red-bg rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-40 left-16 w-2 h-2 red-bg rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-20 w-3 h-3 red-bg rounded-full animate-pulse opacity-70"></div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <div className="w-1 h-3 red-bg rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  // Carrossel com múltiplos banners
  return (
        <section
          className="hero-section relative w-full flex items-center justify-center overflow-hidden bg-black"
          style={{ 
            height: `${desktopHeight}px`,
            minHeight: `${desktopHeight}px`
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            height: ${mobileHeight}px !important;
            min-height: ${mobileHeight}px !important;
          }
        }
      `}</style>
      {/* Carousel Container */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 transform translateX(0)' 
                : index < currentIndex 
                  ? 'opacity-0 transform -translateX(100%)' 
                  : 'opacity-0 transform translateX(100%)'
            }`}
          >
            <img
              src={banner.imageSrc}
              alt={banner.alt}
              className="w-full h-full object-cover"
              style={{
                transform: banner.id === "hero-banner-1" && heroBanner1.banner?.cropMetadata ? 
                  `translate(${heroBanner1.banner.cropMetadata.tx || 0}px, ${heroBanner1.banner.cropMetadata.ty || 0}px) scale(${heroBanner1.banner.cropMetadata.scale || 1})` :
                  banner.id === "hero-banner-2" && heroBanner2.banner?.cropMetadata ?
                  `translate(${heroBanner2.banner.cropMetadata.tx || 0}px, ${heroBanner2.banner.cropMetadata.ty || 0}px) scale(${heroBanner2.banner.cropMetadata.scale || 1})` :
                  undefined
              }}
              onError={(e) => {
                console.log(`❌ Erro ao carregar imagem: ${banner.imageSrc}`)
                // Fallback to default image but don't override the actual banner data
                // This is just a visual fallback, not a data update
                e.currentTarget.src = "/placeholder-default.svg"
              }}
              onLoad={() => {
                console.log(`✅ Imagem carregada com sucesso: ${banner.imageSrc}`)
              }}
              onClick={() => onEditBannerImage && onEditBannerImage(banner.id)}
            />
          </div>
        ))}
        
        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Gradiente vertical sobre o banner */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent"></div>
      </div>

      {/* Navigation Arrows - Otimizado para Mobile */}
      <button
        onClick={goToPrevious}
        className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-300 group cursor-pointer touch-manipulation"
        aria-label="Banner anterior"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-300 group cursor-pointer touch-manipulation"
        aria-label="Próximo banner"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Page Indicators - Otimizado para Mobile */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 md:h-1 transition-all duration-300 rounded-full touch-manipulation ${
              index === currentIndex 
                ? 'red-bg w-8 md:w-8' 
                : 'bg-white/50 hover:bg-white/70 w-6 md:w-6'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
            style={{ minWidth: '24px', minHeight: '6px' }}
          />
        ))}
      </div>

      {/* Elementos decorativos - Responsivos */}
      <div className="absolute top-10 md:top-20 right-4 md:right-10 w-2 h-2 md:w-4 md:h-4 red-bg rounded-full animate-pulse opacity-80"></div>
      <div className="absolute top-20 md:top-40 left-8 md:left-16 w-1 h-1 md:w-2 md:h-2 red-bg rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-16 md:bottom-32 right-8 md:right-20 w-1.5 h-1.5 md:w-3 md:h-3 red-bg rounded-full animate-pulse opacity-70"></div>

      {/* Scroll Indicator - Otimizado para Mobile */}
      <div className="absolute bottom-6 md:bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-red-500 rounded-full flex justify-center touch-manipulation">
          <div className="w-1 h-2 md:w-1 md:h-3 red-bg rounded-full mt-1.5 md:mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}