"use client"

import { useState } from "react"

interface StandardProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images?: string[]
    [key: string]: any
  }
  onClick?: () => void
  className?: string
}

export function StandardProductCard({ product, onClick, className = "" }: StandardProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Get all images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])].filter(img => img)

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  const calculateDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return 0
  }

  const discountPercentage = calculateDiscountPercentage()

  // Navigation functions for image carousel
  const nextImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }
  }

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }
  }

  return (
    <div 
      className={`bg-black text-white cursor-pointer hover:opacity-90 transition-opacity duration-300 w-full ${className}`}
      onClick={onClick}
    >
      {/* Imagem do produto */}
      <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
        <img
          src={allImages[currentImageIndex] || product.image || "/placeholder-default.svg"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
        
        {/* Badge de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Thumbnail Previews */}
      {allImages.length > 1 && (
        <div className="flex gap-1 px-2 py-1 overflow-x-auto">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              className={`flex-shrink-0 w-8 h-8 rounded border ${currentImageIndex === index ? 'border-white' : 'border-gray-600'}`}
              aria-label={`Ver imagem ${index + 1}`}
            >
              <img
                src={img || "/placeholder-default.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Informações do produto */}
      <div className="p-2 flex-1 flex flex-col">
        {/* Nome do produto */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Preço */}
        <div className="mb-1">
          <div className="flex items-center gap-2">
            <span className="red-text font-bold text-lg">
              R$ {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">
                R$ {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        {/* ID do produto */}
        <div className="text-gray-400 text-xs">
          ID: {product.id}
        </div>
      </div>
    </div>
  )
}