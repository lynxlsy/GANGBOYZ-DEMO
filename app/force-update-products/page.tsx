"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RefreshCw, Package, Zap, Star, Shirt } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForceUpdateProductsPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const forceUpdateProducts = async () => {
    setIsUpdating(true)
    
    try {
      // Simular delay para mostrar o processo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Produtos HOT demonstrativos
      const demoHotProducts = [
        {
          id: "HOT001",
          name: "Jaqueta Oversized Premium",
          description: "Jaqueta streetwear com design exclusivo e tecido premium",
          price: 299.90,
          originalPrice: 399.90,
          image: "/black-oversized-streetwear-jacket.jpg",
          category: "Jaquetas",
          isActive: true
        },
        {
          id: "HOT002", 
          name: "Moletom Hoodie Gang",
          description: "Moletom com logo bordado e capuz ajustável",
          price: 199.90,
          originalPrice: 249.90,
          image: "/black-streetwear-hoodie-with-white-logo.jpg",
          category: "Moletons",
          isActive: true
        },
        {
          id: "HOT003",
          name: "Camiseta Graphic Design",
          description: "Camiseta com estampa neon e design urbano",
          price: 89.90,
          originalPrice: 129.90,
          image: "/black-t-shirt-with-neon-graphic-design.jpg",
          category: "Camisetas",
          isActive: true
        },
        {
          id: "HOT004",
          name: "Calça Cargo Street",
          description: "Calça cargo com bolsos laterais e corte moderno",
          price: 179.90,
          originalPrice: 229.90,
          image: "/black-cargo-streetwear.png",
          category: "Calças",
          isActive: true
        },
        {
          id: "HOT005",
          name: "Boné Snapback Gang",
          description: "Boné ajustável com logo bordado em branco",
          price: 79.90,
          originalPrice: 99.90,
          image: "/black-snapback-cap-with-white-embroidery.jpg",
          category: "Acessórios",
          isActive: true
        },
        {
          id: "HOT006",
          name: "Colar de Corrente Prata",
          description: "Colar de corrente prata com design minimalista",
          price: 149.90,
          originalPrice: 199.90,
          image: "/silver-chain-necklace-streetwear-accessory.jpg",
          category: "Acessórios",
          isActive: true
        }
      ]

      // Produtos para OFERTAS ESPECIAIS
      const demoStandaloneProducts = [
        {
          id: "OFFER001",
          name: "Kit Completo Streetwear",
          description: "Jaqueta + Calça + Camiseta",
          price: 499.90,
          originalPrice: 699.90,
          image: "/black-oversized-streetwear-jacket.jpg",
          isNew: true,
          isPromotion: true,
          installments: "12x de R$ 41,66",
          brand: "Gang Boyz"
        },
        {
          id: "OFFER002",
          name: "Moletom Premium Collection",
          description: "Moletom com acabamento premium",
          price: 229.90,
          originalPrice: 299.90,
          image: "/black-streetwear-hoodie-with-white-logo.jpg",
          isNew: false,
          isPromotion: true,
          installments: "6x de R$ 38,32",
          brand: "Gang Boyz"
        },
        {
          id: "OFFER003",
          name: "Camiseta Limited Edition",
          description: "Edição limitada com design exclusivo",
          price: 119.90,
          originalPrice: 159.90,
          image: "/black-t-shirt-with-neon-graphic-design.jpg",
          isNew: true,
          isPromotion: false,
          installments: "3x de R$ 39,97",
          brand: "Gang Boyz"
        },
        {
          id: "OFFER004",
          name: "Calça Cargo Tactical",
          description: "Calça cargo com tecnologia tática",
          price: 199.90,
          originalPrice: 279.90,
          image: "/black-cargo-streetwear.png",
          isNew: false,
          isPromotion: true,
          installments: "8x de R$ 24,99",
          brand: "Gang Boyz"
        }
      ]

      // Categorias com produtos
      const demoCategories = [
        {
          id: "cat001",
          name: "Jaquetas",
          icon: "🧥",
          products: [
            {
              id: "JACKET001",
              name: "Jaqueta Bomber Premium",
              price: 349.90,
              originalPrice: 449.90,
              image: "/black-oversized-streetwear-jacket.jpg",
              isNew: true,
              isPromotion: true,
              installments: "10x de R$ 34,99",
              brand: "Gang Boyz"
            },
            {
              id: "JACKET002",
              name: "Jaqueta Oversized Street",
              price: 299.90,
              originalPrice: 399.90,
              image: "/black-oversized-streetwear-jacket.jpg",
              isNew: false,
              isPromotion: true,
              installments: "8x de R$ 37,49",
              brand: "Gang Boyz"
            }
          ]
        },
        {
          id: "cat002",
          name: "Moletons",
          icon: "👕",
          products: [
            {
              id: "HOODIE001",
              name: "Moletom Hoodie Gang",
              price: 199.90,
              originalPrice: 249.90,
              image: "/black-streetwear-hoodie-with-white-logo.jpg",
              isNew: true,
              isPromotion: true,
              installments: "6x de R$ 33,32",
              brand: "Gang Boyz"
            }
          ]
        },
        {
          id: "cat003",
          name: "Camisetas",
          icon: "👔",
          products: [
            {
              id: "TSHIRT001",
              name: "Camiseta Graphic Neon",
              price: 89.90,
              originalPrice: 129.90,
              image: "/black-t-shirt-with-neon-graphic-design.jpg",
              isNew: true,
              isPromotion: true,
              installments: "3x de R$ 29,97",
              brand: "Gang Boyz"
            }
          ]
        },
        {
          id: "cat004",
          name: "Calças",
          icon: "👖",
          products: [
            {
              id: "PANTS001",
              name: "Calça Cargo Street",
              price: 179.90,
              originalPrice: 229.90,
              image: "/black-cargo-streetwear.png",
              isNew: false,
              isPromotion: true,
              installments: "5x de R$ 35,98",
              brand: "Gang Boyz"
            }
          ]
        }
      ]

      // Salvar no localStorage
      localStorage.setItem("gang-boyz-hot-products", JSON.stringify(demoHotProducts))
      localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(demoStandaloneProducts))
      localStorage.setItem("gang-boyz-categories", JSON.stringify(demoCategories))
      
      // Disparar múltiplos eventos para garantir atualização
      window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
      window.dispatchEvent(new CustomEvent('productsUpdated'))
      window.dispatchEvent(new CustomEvent('storage'))
      
      // Forçar atualização da página
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
      setIsComplete(true)
      
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    // Executar automaticamente quando a página carregar
    forceUpdateProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isComplete ? "✅ Produtos Atualizados!" : "🔄 Forçando Atualização"}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isComplete 
              ? "Produtos foram atualizados e a página será recarregada automaticamente!"
              : "Forçando atualização dos produtos no sistema..."
            }
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Zap className="h-5 w-5" />
                Produtos HOT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6</div>
              <CardDescription className="text-gray-400">
                Produtos em destaque
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Star className="h-5 w-5" />
                Ofertas Especiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4</div>
              <CardDescription className="text-gray-400">
                Produtos avulsos
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Package className="h-5 w-5" />
                Categorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4</div>
              <CardDescription className="text-gray-400">
                Categorias com produtos
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Status */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {isComplete ? "✅ Atualização Concluída" : "⚙️ Atualizando..."}
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                {isComplete 
                  ? "Produtos foram atualizados e a página será recarregada em breve!"
                  : "Forçando atualização dos produtos..."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isUpdating && (
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Atualizando produtos...</p>
                </div>
              )}

              {isComplete && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-green-400 font-semibold">
                      Produtos atualizados com sucesso!
                    </p>
                    <p className="text-gray-400 text-sm">
                      A página será recarregada automaticamente em alguns segundos...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-8 text-center">
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              💡 Esta página força a atualização dos produtos e recarrega a página
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}



