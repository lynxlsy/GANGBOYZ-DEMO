"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface CategoriesMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function CategoriesMenu({ isOpen, onClose }: CategoriesMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const router = useRouter()

  const productCategories = [
    "Camisas",
    "Calças", 
    "Jaquetas",
    "Moletons",
    "Shorts",
    "Acessórios"
  ]

  const styleCategories = [
    "Streetwear",
    "Trapstar", 
    "Y2K",
    "Vintage",
    "Minimalist"
  ]

  const allProductsCategories = [
    {
      title: "Roupas",
      items: ["Camisetas", "Jaquetas/Moletons", "Bermudas", "Calças", "Inverno"]
    },
    {
      title: "Acessórios", 
      items: ["Meias", "Luvas", "Óculos", "Bags", "Bonés", "Cuecas", "Bolsas/Mochilas"]
    },
    {
      title: "Conjuntos",
      items: ["Conjuntos Completos", "Looks Coordenados"]
    },
    {
      title: "Mais Vendidos",
      items: ["Burj", "Produtos em Alta"]
    }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div className="fixed left-0 top-0 h-full w-full max-w-sm bg-neutral-900 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-xl font-semibold text-white">Categorias</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* All Products Categories */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-lg">Todos os nossos produtos</h3>
              <div className="space-y-3">
                {allProductsCategories.map((category) => (
                  <div key={category.title} className="space-y-2">
                    <button
                      onClick={() => setActiveCategory(activeCategory === category.title ? null : category.title)}
                      className="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left"
                    >
                      <span className="text-white font-medium">{category.title}</span>
                      <ChevronDown 
                        className={`h-4 w-4 text-neutral-400 transition-transform ${
                          activeCategory === category.title ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Subcategories */}
                    {activeCategory === category.title && (
                      <div className="ml-4 space-y-1">
                        {category.items.map((item) => (
                          <button
                            key={item}
                            className="w-full text-left p-2 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors text-sm"
                            onClick={() => {
                              // Navegação para páginas específicas
                              if (item === "Camisetas") {
                                router.push("/camisetas")
                              } else if (item === "Burj") {
                                router.push("/mais-vendidos")
                              } else {
                                console.log(`Navegar para ${item}`)
                              }
                              onClose()
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Product Categories */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-lg">Produtos</h3>
              <div className="space-y-2">
                {productCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                    className="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left"
                  >
                    <span className="text-white font-medium">{category}</span>
                    <ChevronDown 
                      className={`h-4 w-4 text-neutral-400 transition-transform ${
                        activeCategory === category ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Style Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Estilos</h3>
              <div className="space-y-2">
                {styleCategories.map((style) => (
                  <button
                    key={style}
                    onClick={() => setActiveCategory(activeCategory === style ? null : style)}
                    className="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left"
                  >
                    <span className="text-white font-medium">{style}</span>
                    <ChevronDown 
                      className={`h-4 w-4 text-neutral-400 transition-transform ${
                        activeCategory === style ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-800 p-6">
            <Button
              onClick={() => {
                router.push("/roupas")
                onClose()
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              Ver Todas as Roupas
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
