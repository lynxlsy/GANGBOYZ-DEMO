"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  isNew: boolean
  isPromotion: boolean
  installments: string
  brand: string
}

interface Category {
  id: string
  name: string
  icon?: string
  products: Product[]
}

export function FeaturedProducts() {
  const [likedProducts, setLikedProducts] = useState<number[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [standaloneProducts, setStandaloneProducts] = useState<Product[]>([])
  const { addItem, openCart } = useCart()

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
    
    const savedStandaloneProducts = localStorage.getItem("gang-boyz-standalone-products")
    if (savedStandaloneProducts) {
      setStandaloneProducts(JSON.parse(savedStandaloneProducts))
    }
  }, [])

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(Number(productId)) ? prev.filter((id) => id !== Number(productId)) : [...prev, Number(productId)],
    )
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
    })
    openCart()
  }


  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            OFERTAS ESPECIAIS
          </h1>
          <div className="w-32 h-1 red-bg mx-auto rounded"></div>
        </div>

        {/* Produtos Avulsos integrados na seção OFERTAS ESPECIAIS */}
        {standaloneProducts.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {standaloneProducts.map((product) => (
                <div key={product.id} className="w-4/5">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => handleAddToCart(product)}
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
        )}

        {/* Seção de Categorias */}
        {categories.length > 0 && (
          <div className="space-y-16">
            {categories.map((category) => (
            <div key={category.id} className="mb-16">
              {/* Título da Categoria */}
              <div className="text-left mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {category.name.toUpperCase()}
                  </h2>
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={`Ícone de ${category.name}`}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </div>
                <div className="w-24 h-1 red-bg rounded"></div>
              </div>

              {/* Grid de Produtos da Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.products.map((product) => (
                    <div key={product.id} className="w-4/5">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-96 object-cover cursor-pointer"
                        onClick={() => handleAddToCart(product)}
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
            ))}
          </div>
        )}

        {/* Mensagem quando não há produtos */}
        {categories.length === 0 && standaloneProducts.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">Nenhum produto disponível</h2>
            <p className="text-neutral-400 mb-8">Os produtos serão exibidos aqui quando forem criados no admin.</p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                className="red-border-dynamic red-text red-bg-hover hover:text-white"
                onClick={() => window.open('/admin', '_blank')}
              >
                Acessar Admin
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
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
                  
                  // Recarregar a página para mostrar os produtos
                  window.location.reload()
                }}
              >
                ➕ Adicionar Produtos Demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
