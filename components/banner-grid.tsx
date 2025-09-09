"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Collection {
  id: string
  brand: string
  name: string
  subtitle: string
  description: string
  icon: string
  link?: string
  image: string
  mediaType?: 'image' | 'video' | 'gif'
  color: string
}

export function BannerGrid() {
  const [collections, setCollections] = useState<Collection[]>([])

  // Carregar coleções do localStorage
  useEffect(() => {
    const loadCollections = () => {
      const savedCollections = localStorage.getItem("gang-boyz-collections")
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections))
      } else {
        // Coleções padrão de demonstração
        const defaultCollections: Collection[] = [
          {
            id: "1",
            brand: "GANG BOYZ",
            name: "NOVA COLEÇÃO",
            subtitle: "Streetwear Premium",
            description: "Descubra os lançamentos mais ousados da temporada",
            icon: "",
            link: "",
            image: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
            mediaType: "image",
            color: "from-red-600/90 to-black/70"
          },
          {
            id: "2",
            brand: "SHADOW",
            name: "MOLETONS",
            subtitle: "Conforto Urbano",
            description: "Qualidade premium para o dia a dia",
            icon: "",
            link: "",
            image: "/black-streetwear-hoodie-with-white-logo.jpg",
            mediaType: "image",
            color: "from-gray-800/90 to-black/70"
          },
          {
            id: "3",
            brand: "CHAIN",
            name: "ACESSÓRIOS",
            subtitle: "Detalhes Únicos",
            description: "Complete seu look com nossos acessórios exclusivos",
            icon: "",
            link: "",
            image: "/silver-chain-necklace-streetwear-accessory.jpg",
            mediaType: "image",
            color: "from-red-600/90 to-black/70"
          },
          {
            id: "4",
            brand: "SALE",
            name: "PROMOÇÕES",
            subtitle: "Ofertas Limitadas",
            description: "Até 50% de desconto em peças selecionadas",
            icon: "",
            link: "",
            image: "/black-t-shirt-with-neon-graphic-design.jpg",
            mediaType: "image",
            color: "from-red-500/90 to-black/70"
          }
        ]
        setCollections(defaultCollections)
        localStorage.setItem("gang-boyz-collections", JSON.stringify(defaultCollections))
      }
    }

    // Carregar inicialmente
    loadCollections()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-collections") {
        loadCollections()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadCollections()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('collectionsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('collectionsUpdated', handleCustomStorageChange)
    }
  }, [])
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Título da seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            MAIS VENDIDOS
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Descubra as peças que estão fazendo sucesso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden group cursor-pointer bg-gray-900"
              onClick={() => collection.link && (window.location.href = collection.link)}
            >
              {/* Background Media */}
              <div className="absolute inset-0">
                {collection.mediaType === 'video' ? (
                  <video
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-80`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <span className="text-xs font-bold tracking-wider text-white/90 uppercase bg-white/20 px-3 py-1 rounded-full">
                      {collection.brand}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-lg text-white/90 font-semibold mb-3">
                    {collection.subtitle}
                  </p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {collection.description}
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 w-fit rounded-full shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  {collection.link ? 'EXPLORAR' : 'VER MAIS'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
