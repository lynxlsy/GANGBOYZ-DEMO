"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

interface CropMetadata {
  src: string
  ratio: string  // "1920x650"
  scale: number
  tx: number     // translateX relativo (-1..1)
  ty: number     // translateY relativo (-1..1)
}

interface Banner {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType?: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: CropMetadata
}

interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export function HotSection() {
  const [hotBanner, setHotBanner] = useState<string>("/placeholder.jpg")
  const [hotMediaType, setHotMediaType] = useState<'image' | 'video' | 'gif'>('image')
  const [hotCropMetadata, setHotCropMetadata] = useState<CropMetadata | undefined>(undefined)
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const { activeTheme } = useTheme()

  // Carregar banner e produtos HOT do localStorage
  useEffect(() => {
    const loadBanner = () => {
      const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
      if (savedBanners) {
        const banners: Banner[] = JSON.parse(savedBanners)
        const hotBannerData = banners.find(banner => banner.id === "hot-banner")
        if (hotBannerData) {
          setHotBanner(hotBannerData.currentImage)
          setHotMediaType(hotBannerData.mediaType || 'image')
          setHotCropMetadata(hotBannerData.cropMetadata)
        } else {
          // Banner foi excluído, não renderizar a seção
          setHotBanner("")
        }
      }
    }

    const loadHotProducts = () => {
      const savedProducts = localStorage.getItem("gang-boyz-hot-products")
      if (savedProducts) {
        const products: HotProduct[] = JSON.parse(savedProducts)
        const activeProducts = products.filter(product => product.isActive)
        setHotProducts(activeProducts)
      } else {
        // Não carregar produtos padrão automaticamente
        setHotProducts([])
      }
    }

    // Carregar inicialmente
    loadBanner()
    loadHotProducts()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-homepage-banners") {
        loadBanner()
      }
      if (e.key === "gang-boyz-hot-products") {
        loadHotProducts()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadBanner()
      loadHotProducts()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerUpdated', handleCustomStorageChange)
    window.addEventListener('hotProductsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerUpdated', handleCustomStorageChange)
      window.removeEventListener('hotProductsUpdated', handleCustomStorageChange)
    }
  }, [])

  // Não renderizar se não há banner
  if (!hotBanner) {
    return null
  }

  return (
    <section className="pt-24 pb-16 bg-black">
      {/* Banner Hot - Largura total do site */}
      <div className="relative mb-12 overflow-hidden w-screen h-[650px] -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)]">
        {hotMediaType === 'video' ? (
          <video
            src={hotBanner}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            style={{
              transform: hotCropMetadata ? 
                `translate3d(${hotCropMetadata.tx * 50}%, ${hotCropMetadata.ty * 50}%, 0) scale(${hotCropMetadata.scale})` : 
                'none',
              willChange: 'transform',
              transformOrigin: 'center'
            }}
          />
        ) : (
          <img
            src={hotBanner}
            alt="Hot Banner"
            className="w-full h-full object-contain"
            style={{
              transform: hotCropMetadata ? 
                `translate3d(${hotCropMetadata.tx * 50}%, ${hotCropMetadata.ty * 50}%, 0) scale(${hotCropMetadata.scale})` : 
                'none',
              willChange: 'transform',
              transformOrigin: 'center'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </div>

      <div className="container mx-auto px-4">

        {/* Título Hot */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PRODUTOS EM DESTAQUE
          </h2>
          <div 
            className="w-32 h-1 mx-auto rounded"
            style={{ backgroundColor: `var(--primary-color)` }}
          ></div>
          <p className="text-neutral-400 mt-4 text-lg">
            Os produtos mais vendidos e em alta
          </p>
        </div>


        {/* Produtos em Destaque */}
        {hotProducts.length > 0 ? (
          <div className="py-16">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {hotProducts.map((product, index) => (
                <div key={product.id} className="w-4/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover cursor-pointer"
                  />
                  <div className="mt-2 text-white">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="text-red-500 font-bold text-xl">R$ {product.price.toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">ID: {product.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
