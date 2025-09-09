"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

interface Recommendation {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isActive: boolean
}

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { activeTheme } = useTheme()

  // Carregar recomendações do localStorage
  useEffect(() => {
    const loadRecommendations = () => {
      const savedRecommendations = localStorage.getItem("gang-boyz-recommendations")
      if (savedRecommendations) {
        const parsedRecommendations: Recommendation[] = JSON.parse(savedRecommendations)
        // Filtrar apenas produtos ativos
        const activeRecommendations = parsedRecommendations.filter(rec => rec.isActive)
        setRecommendations(activeRecommendations)
      }
    }

    loadRecommendations()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-recommendations") {
        loadRecommendations()
      }
    }

    // Escutar eventos customizados
    const handleCustomStorageChange = () => {
      loadRecommendations()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('recommendationsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('recommendationsUpdated', handleCustomStorageChange)
    }
  }, [])

  // Demonstrações quando não há recomendações configuradas
  const demoRecommendations: Recommendation[] = [
    {
      id: "CAM001",
      name: "Camiseta Oversized",
      description: "Camiseta confortável com design urbano",
      price: 89.90,
      originalPrice: 129.90,
      image: "/black-t-shirt-with-neon-graphic-design.jpg",
      category: "Camisetas",
      isActive: true
    },
    {
      id: "MOL002", 
      name: "Moletom Premium",
      description: "Moletom com capuz e bolsos laterais",
      price: 149.90,
      originalPrice: 199.90,
      image: "/black-streetwear-hoodie-with-white-logo.jpg",
      category: "Moletons",
      isActive: true
    },
    {
      id: "JAQ003",
      name: "Jaqueta Streetwear",
      description: "Jaqueta oversized com design exclusivo",
      price: 199.90,
      originalPrice: 279.90,
      image: "/black-oversized-streetwear-jacket.jpg",
      category: "Jaquetas",
      isActive: true
    },
    {
      id: "CAL004",
      name: "Calça Cargo",
      description: "Calça cargo com bolsos funcionais",
      price: 179.90,
      originalPrice: 229.90,
      image: "/black-cargo-streetwear.png",
      category: "Calças",
      isActive: true
    },
    {
      id: "BON005",
      name: "Boné Snapback",
      description: "Boné com bordado premium",
      price: 79.90,
      originalPrice: 99.90,
      image: "/black-snapback-cap-with-white-embroidery.jpg",
      category: "Acessórios",
      isActive: true
    },
    {
      id: "COL006",
      name: "Colar de Corrente",
      description: "Colar de corrente prateada",
      price: 59.90,
      originalPrice: 79.90,
      image: "/silver-chain-necklace-streetwear-accessory.jpg",
      category: "Acessórios",
      isActive: true
    },
    {
      id: "CAM007",
      name: "Camiseta Básica",
      description: "Camiseta básica com logo estampado",
      price: 69.90,
      originalPrice: 99.90,
      image: "/black-t-shirt-with-neon-graphic-design.jpg",
      category: "Camisetas",
      isActive: true
    }
  ]

  const allRecommendations = recommendations.length > 0 ? recommendations : demoRecommendations
  const displayRecommendations = allRecommendations.slice(0, 4) // Limitar a 4 imagens

  // Função para scroll infinito no mobile
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const itemWidth = container.children[0]?.clientWidth || 0
    const containerWidth = container.clientWidth
    const singleSetWidth = displayRecommendations.length * (itemWidth + 16) // 16px é o space-x-4
    
    // Se chegou ao final do terceiro conjunto, volta para o início do segundo conjunto
    if (scrollLeft >= singleSetWidth * 2 - containerWidth + 50) {
      container.style.scrollBehavior = 'auto'
      container.scrollLeft = singleSetWidth
      setTimeout(() => {
        container.style.scrollBehavior = 'smooth'
      }, 10)
    }
    
    // Se está no início do primeiro conjunto, vai para o início do segundo conjunto
    if (scrollLeft <= 50) {
      container.style.scrollBehavior = 'auto'
      container.scrollLeft = singleSetWidth
      setTimeout(() => {
        container.style.scrollBehavior = 'smooth'
      }, 10)
    }
  }

  // Posicionar o scroll inicial no mobile para o loop infinito
  useEffect(() => {
    if (scrollContainerRef.current && displayRecommendations.length > 0) {
      const container = scrollContainerRef.current
      const itemWidth = container.children[0]?.clientWidth || 0
      const singleSetWidth = displayRecommendations.length * (itemWidth + 16)
      
      // Posiciona no início do segundo conjunto (meio do carrossel)
      container.scrollTo({ left: singleSetWidth, behavior: 'instant' })
    }
  }, [displayRecommendations])

  // Funções para navegação com botões
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.children[0]?.clientWidth || 0
      const scrollAmount = itemWidth + 16 // itemWidth + gap
      const newScrollLeft = container.scrollLeft - scrollAmount
      
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.children[0]?.clientWidth || 0
      const scrollAmount = itemWidth + 16 // itemWidth + gap
      const newScrollLeft = container.scrollLeft + scrollAmount
      
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    }
  }


  return (
    <section className="py-16 bg-gradient-to-b from-neutral-900 to-black">
      <div className="container mx-auto px-4">

        {/* Desktop - Grid de produtos */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {displayRecommendations.map((recommendation, index) => (
            <div key={recommendation.id} className="relative w-full h-80 rounded-lg overflow-hidden group shadow-lg border border-gray-700/50">
              <img
                src={recommendation.image}
                alt={recommendation.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="absolute bottom-3 left-3 bg-black/95 text-white text-sm font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/30 shadow-lg">
                  {recommendation.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile - Scroll horizontal infinito */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
          >
            {/* Criar múltiplas clonagens para loop infinito */}
            {[...displayRecommendations, ...displayRecommendations, ...displayRecommendations].map((recommendation, index) => (
              <div 
                key={`${recommendation.id}-${index}`}
                className="flex-shrink-0 w-48"
              >
                <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer">
                  {/* Imagem */}
                  <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={recommendation.image}
                      alt={recommendation.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nome/Código embaixo da imagem */}
                  <div className="p-3 bg-gradient-to-b from-neutral-900/50 to-neutral-800/50">
                    <div className="text-center">
                      <h3 className="font-bold text-sm text-white mb-1">
                        {recommendation.id}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botões de Navegação Mobile */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={scrollLeft}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200 border border-neutral-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              onClick={scrollRight}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200 border border-neutral-600"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
