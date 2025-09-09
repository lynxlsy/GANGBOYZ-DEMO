"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DebugProductsPage() {
  const [hotProducts, setHotProducts] = useState<any[]>([])
  const [standaloneProducts, setStandaloneProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([])

  useEffect(() => {
    checkLocalStorage()
  }, [])

  const checkLocalStorage = () => {
    // Verificar produtos HOT
    const hotProductsData = localStorage.getItem("gang-boyz-hot-products")
    if (hotProductsData) {
      setHotProducts(JSON.parse(hotProductsData))
    }

    // Verificar produtos avulsos
    const standaloneProductsData = localStorage.getItem("gang-boyz-standalone-products")
    if (standaloneProductsData) {
      setStandaloneProducts(JSON.parse(standaloneProductsData))
    }

    // Verificar categorias
    const categoriesData = localStorage.getItem("gang-boyz-categories")
    if (categoriesData) {
      setCategories(JSON.parse(categoriesData))
    }

    // Listar todas as chaves do localStorage
    const keys = Object.keys(localStorage).filter(key => key.includes('gang-boyz'))
    setLocalStorageKeys(keys)
  }

  const addProductsManually = () => {
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
    
    // Disparar eventos para atualizar as seções
    window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
    window.dispatchEvent(new CustomEvent('productsUpdated'))
    
    // Atualizar estado
    checkLocalStorage()
    
    alert("✅ Produtos adicionados com sucesso!")
  }

  const clearAllProducts = () => {
    localStorage.removeItem("gang-boyz-hot-products")
    localStorage.removeItem("gang-boyz-standalone-products")
    localStorage.removeItem("gang-boyz-categories")
    
    setHotProducts([])
    setStandaloneProducts([])
    setCategories([])
    
    alert("🗑️ Todos os produtos foram removidos!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔍 Debug de Produtos</h1>
        
        {/* Ações */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={addProductsManually} className="bg-green-600 hover:bg-green-700">
            ➕ Adicionar Produtos
          </Button>
          <Button onClick={clearAllProducts} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
            🗑️ Limpar Todos
          </Button>
          <Button onClick={checkLocalStorage} variant="outline">
            🔄 Atualizar
          </Button>
        </div>

        {/* Status do localStorage */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>📊 Status do LocalStorage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant={hotProducts.length > 0 ? "default" : "destructive"}>
                  Produtos HOT: {hotProducts.length}
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={standaloneProducts.length > 0 ? "default" : "destructive"}>
                  Ofertas Especiais: {standaloneProducts.length}
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={categories.length > 0 ? "default" : "destructive"}>
                  Categorias: {categories.length}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Chaves do LocalStorage:</h3>
              <div className="flex flex-wrap gap-2">
                {localStorageKeys.map(key => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos HOT */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>🔥 Produtos HOT ({hotProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {hotProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotProducts.map(product => (
                  <div key={product.id} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-400">{product.name}</h3>
                    <p className="text-sm text-gray-300">{product.description}</p>
                    <p className="text-red-400 font-bold">R$ {product.price}</p>
                    <p className="text-xs text-gray-400">Categoria: {product.category}</p>
                    <Badge variant={product.isActive ? "default" : "destructive"} className="mt-2">
                      {product.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Nenhum produto HOT encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* Ofertas Especiais */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>⭐ Ofertas Especiais ({standaloneProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {standaloneProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standaloneProducts.map(product => (
                  <div key={product.id} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-400">{product.name}</h3>
                    <p className="text-sm text-gray-300">{product.description}</p>
                    <p className="text-red-400 font-bold">R$ {product.price}</p>
                    <p className="text-xs text-gray-400">Marca: {product.brand}</p>
                    <div className="flex gap-2 mt-2">
                      {product.isNew && <Badge variant="default" className="text-xs">Novo</Badge>}
                      {product.isPromotion && <Badge variant="secondary" className="text-xs">Promoção</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Nenhuma oferta especial encontrada</p>
            )}
          </CardContent>
        </Card>

        {/* Categorias */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>📁 Categorias ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                      {category.icon} {category.name}
                    </h3>
                    <p className="text-sm text-gray-300 mt-2">
                      Produtos: {category.products.length}
                    </p>
                    <div className="mt-2">
                      {category.products.map(product => (
                        <div key={product.id} className="text-xs text-gray-400 ml-4">
                          • {product.name} - R$ {product.price}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Nenhuma categoria encontrada</p>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>📋 Instruções</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Clique em "Adicionar Produtos" para adicionar produtos demonstrativos</li>
              <li>Verifique se os produtos aparecem nas seções acima</li>
              <li>Vá para a homepage para ver se os produtos são exibidos</li>
              <li>Se não aparecerem, use "Limpar Todos" e tente novamente</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



