"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroCarouselProps {
  banners: Array<{
    id: string
    imageSrc: string
    alt: string
  }>
  autoPlayInterval?: number
}

export function HeroCarousel({ banners, autoPlayInterval = 4000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && banners.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, banners.length, autoPlayInterval])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

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

  if (banners.length === 0) {
    return null
  }

  return (
    <section 
      className="hero-section relative h-screen w-full flex items-center justify-center overflow-hidden bg-black" 
      style={{ height: '100vh', minHeight: '100vh' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${banners.length * 100}%`
          }}
        >
          {banners.map((banner, index) => (
            <div 
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative"
              style={{ width: `${100 / banners.length}%` }}
            >
              <img
                src={banner.imageSrc}
                alt={banner.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg"
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradiente vertical sobre o banner */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent"></div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 group"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 group"
            aria-label="Próximo banner"
          >
            <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Page Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-red-500 w-8' 
                  : 'bg-white/50 hover:bg-white/70 w-6'
              }`}
              aria-label={`Ir para banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Elementos decorativos */}
      <div className="absolute top-20 right-10 w-4 h-4 bg-red-500 rounded-full animate-pulse opacity-80"></div>
      <div className="absolute top-40 left-16 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-32 right-20 w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-70"></div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-red-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}