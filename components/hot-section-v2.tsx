'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { BannerRenderer } from '@/components/banner-renderer'
import { useBanner, BannerBroadcastChannel } from '@/hooks/use-banners'

interface HotProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  isActive: boolean
}

export function HotSection() {
  const { banner, mutate } = useBanner('hot')
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const [broadcastChannel, setBroadcastChannel] = useState<BannerBroadcastChannel | null>(null)

  // Inicializar BroadcastChannel
  useEffect(() => {
    const channel = new BannerBroadcastChannel()
    setBroadcastChannel(channel)

    // Escutar atualizações
    const cleanup = channel.onUpdate((id, version) => {
      if (id === 'hot') {
        mutate() // Refetch do SWR
      }
    })

    return () => {
      cleanup()
      channel.close()
    }
  }, [mutate])

  // Carregar produtos HOT do localStorage
  useEffect(() => {
    const loadHotProducts = () => {
      const savedProducts = localStorage.getItem("gang-boyz-hot-products")
      if (savedProducts) {
        const products: HotProduct[] = JSON.parse(savedProducts)
        const activeProducts = products.filter(product => product.isActive)
        setHotProducts(activeProducts)
      } else {
        setHotProducts([])
      }
    }

    loadHotProducts()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-hot-products") {
        loadHotProducts()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!banner) {
    return null // Não renderizar se não houver banner
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Banner HOT */}
        <div className="relative mb-12 overflow-hidden w-full h-[650px]">
          <BannerRenderer banner={banner} className="w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  HOT
                </h2>
                <p className="text-xl md:text-2xl text-gray-200">
                  Os mais vendidos da temporada
                </p>
              </div>
            </div>
          </BannerRenderer>
        </div>

        {/* Produtos HOT */}
        {hotProducts.length > 0 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Produtos em Destaque
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                As peças mais procuradas da nossa coleção
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-10 h-10 p-0 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-10 h-10 p-0 bg-white/80 hover:bg-white"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                      {product.originalPrice && (
                        <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                      
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
