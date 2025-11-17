"use client"

import { useBanner } from "@/hooks/use-banner"
import { getBannerConfig } from "@/lib/banner-config"
import { useState, useEffect } from "react"

interface BannerRendererProps {
  bannerId: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  showOverlay?: boolean
  overlayContent?: React.ReactNode
  fallbackContent?: React.ReactNode
}

export function BannerRenderer({ 
  bannerId, 
  className = "", 
  style = {}, 
  onClick,
  showOverlay = false,
  overlayContent,
  fallbackContent
}: BannerRendererProps) {
  const { banner, loading, error } = useBanner(bannerId)
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Get banner config for default image
  const config = getBannerConfig(bannerId)
  const defaultImage = config?.defaultImage || "/placeholder-default.svg"

  // Reset error state when bannerId changes
  useEffect(() => {
    setImageError(false)
    setRetryCount(0)
  }, [bannerId])

  // Handle image error with retry logic
  const handleImageError = () => {
    if (retryCount < 2) {
      // Retry with cache-busted URL
      setRetryCount(prev => prev + 1)
      setImageError(false)
    } else {
      setImageError(true)
    }
  }

  // Construct image URL with cache busting
  const getImageUrl = () => {
    if (!banner?.currentImage) return defaultImage
    
    // Don't add cache buster to data URLs
    if (banner.currentImage.startsWith('data:')) {
      return banner.currentImage
    }
    
    // Add cache buster for regular URLs
    const separator = banner.currentImage.includes('?') ? '&' : '?'
    return `${banner.currentImage}${separator}v=${Date.now()}-${retryCount}`
  }

  if (loading) {
    return (
      <div 
        className={`banner-renderer bg-gray-200 animate-pulse ${className}`}
        style={style}
      />
    )
  }

  if (error || imageError) {
    return (
      <div 
        className={`banner-renderer bg-gray-100 flex items-center justify-center ${className}`}
        style={style}
        onClick={onClick}
      >
        {fallbackContent || (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm">Banner não disponível</div>
          </div>
        )}
      </div>
    )
  }

  const imageUrl = getImageUrl()

  return (
    <div 
      className={`banner-renderer relative overflow-hidden ${className}`}
      style={style}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={banner?.name || "Banner"}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
      
      {showOverlay && (
        <div className="absolute inset-0 bg-black/40">
          {overlayContent}
        </div>
      )}
    </div>
  )
}

// Specific banner components
export function OffersBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer 
      bannerId="offers-banner"
      className={`w-full ${className}`}
      style={{ aspectRatio: '2/1' }} // 1248x624px = 2:1 ratio
    />
  )
}

export function FooterBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer 
      bannerId="footer-banner"
      className={`w-full ${className}`}
      style={{ aspectRatio: '2/1' }} // 1248x624px = 2:1 ratio (same as offers banner)
    />
  )
}

export function HeroBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer 
      bannerId="hero-banner-1"
      className={`w-full ${className}`}
      style={{ aspectRatio: '16/9' }} // 1920x1080px = 16:9 ratio
    />
  )
}