"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RefreshCw, Package, Zap, Star } from "lucide-react"
import { initializeDemoProducts, resetAllProducts } from "@/lib/demo-products"

export default function InitDemoPage() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [stats, setStats] = useState({
    hotProducts: 0,
    standaloneProducts: 0,
    categories: 0
  })

  useEffect(() => {
    checkCurrentStatus()
  }, [])

  const checkCurrentStatus = () => {
    const hotProducts = localStorage.getItem("gang-boyz-hot-products")
    const standaloneProducts = localStorage.getItem("gang-boyz-standalone-products")
    const categories = localStorage.getItem("gang-boyz-categories")

    setStats({
      hotProducts: hotProducts ? JSON.parse(hotProducts).length : 0,
      standaloneProducts: standaloneProducts ? JSON.parse(standaloneProducts).length : 0,
      categories: categories ? JSON.parse(categories).length : 0
    })

    setIsInitialized(!!hotProducts && !!standaloneProducts && !!categories)
  }

  const handleInitialize = () => {
    const result = initializeDemoProducts()
    
    if (result.hotProductsAdded || result.standaloneProductsAdded || result.categoriesAdded) {
      checkCurrentStatus()
      
      // Disparar eventos para atualizar as seções
      window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
      window.dispatchEvent(new CustomEvent('productsUpdated'))
      
      alert("✅ Produtos demonstrativos adicionados com sucesso!\n\nAgora você pode ver os produtos na homepage.")
    } else {
      alert("ℹ️ Os produtos demonstrativos já estavam configurados!")
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
      resetAllProducts()
      checkCurrentStatus()
      alert("🔄 Produtos resetados com sucesso!")
    } catch (error) {
      alert("❌ Erro ao resetar produtos")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🚀 Inicialização de Produtos
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Configure produtos demonstrativos para testar o sistema Gang Boyz
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
              <div className="text-2xl font-bold text-white">{stats.hotProducts}</div>
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
              <div className="text-2xl font-bold text-white">{stats.standaloneProducts}</div>
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
              <div className="text-2xl font-bold text-white">{stats.categories}</div>
              <CardDescription className="text-gray-400">
                Categorias com produtos
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {isInitialized ? "✅ Sistema Configurado" : "⚙️ Configuração Necessária"}
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                {isInitialized 
                  ? "Os produtos demonstrativos já estão configurados. Você pode resetá-los se necessário."
                  : "Adicione produtos demonstrativos para testar o sistema completo."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isInitialized && (
                <Button 
                  onClick={handleInitialize}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Adicionar Produtos Demonstrativos
                </Button>
              )}

              <Button 
                onClick={handleReset}
                disabled={isResetting}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 py-3 text-lg"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Resetando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Resetar Produtos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-8 text-center">
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              💡 Após adicionar os produtos, acesse a homepage para visualizá-los
            </Badge>
          </div>
        </div>

        {/* Product Preview */}
        {isInitialized && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              📦 Produtos Demonstrativos Incluídos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Hot Products Preview */}
              <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Produtos HOT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Jaqueta Oversized Premium</li>
                    <li>• Moletom Hoodie Gang</li>
                    <li>• Camiseta Graphic Design</li>
                    <li>• Calça Cargo Street</li>
                    <li>• Boné Snapback Gang</li>
                    <li>• Colar de Corrente Prata</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Standalone Products Preview */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Ofertas Especiais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Kit Completo Streetwear</li>
                    <li>• Moletom Premium Collection</li>
                    <li>• Camiseta Limited Edition</li>
                    <li>• Calça Cargo Tactical</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Categories Preview */}
              <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Categorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• 🧥 Jaquetas (2 produtos)</li>
                    <li>• 👕 Moletons (1 produto)</li>
                    <li>• 👔 Camisetas (1 produto)</li>
                    <li>• 👖 Calças (1 produto)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



