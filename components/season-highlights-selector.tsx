"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus } from "lucide-react"

interface SeasonHighlightProduct {
  id: string
  productId: string // ID of the original product
  name: string
  price: number
  image: string
  originalPrice?: number
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  // ... other product properties
}

export function SeasonHighlightsSelector({ product, onProductAdded }: { product: Product, onProductAdded: () => void }) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if product is already added to season highlights
  useEffect(() => {
    const checkIfAdded = () => {
      const savedProducts = localStorage.getItem("gang-boyz-season-highlight-products")
      if (savedProducts) {
        try {
          const products: SeasonHighlightProduct[] = JSON.parse(savedProducts)
          const isProductAdded = products.some(p => p.productId === product.id)
          setIsAdded(isProductAdded)
        } catch (error) {
          console.error("Error checking if product is added:", error)
        }
      }
    }

    checkIfAdded()

    // Listen for updates
    const handleSeasonHighlightProductsUpdated = () => {
      checkIfAdded()
    }

    window.addEventListener('seasonHighlightProductsUpdated', handleSeasonHighlightProductsUpdated)
    
    return () => {
      window.removeEventListener('seasonHighlightProductsUpdated', handleSeasonHighlightProductsUpdated)
    }
  }, [product.id])

  const handleAddToSeasonHighlights = async () => {
    if (isAdded) return

    setIsLoading(true)
    
    try {
      // Check if product is already added
      const savedProducts = localStorage.getItem("gang-boyz-season-highlight-products")
      let products: SeasonHighlightProduct[] = []
      
      if (savedProducts) {
        products = JSON.parse(savedProducts)
      }
      
      // Check if product is already added
      if (products.some(p => p.productId === product.id)) {
        toast.error("Produto já adicionado aos destaques!")
        setIsAdded(true)
        return
      }
      
      // Create season highlight product
      const seasonHighlightProduct: SeasonHighlightProduct = {
        id: `sh-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        originalPrice: product.originalPrice
      }
      
      // Add to season highlight products
      const updatedProducts = [...products, seasonHighlightProduct]
      localStorage.setItem("gang-boyz-season-highlight-products", JSON.stringify(updatedProducts))
      window.dispatchEvent(new CustomEvent('seasonHighlightProductsUpdated'))
      
      // ALSO add to hot products (PRODUTOS EM DESTAQUE section)
      const savedHotProducts = localStorage.getItem("gang-boyz-hot-products")
      let hotProducts: any[] = []
      
      if (savedHotProducts) {
        hotProducts = JSON.parse(savedHotProducts)
      }
      
      // Create hot product object
      const hotProduct = {
        id: product.id,
        name: product.name,
        description: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        category: "Em Alta",
        isActive: true
      }
      
      // Add to hot products if not already there
      if (!hotProducts.some(p => p.id === product.id)) {
        const updatedHotProducts = [...hotProducts, hotProduct]
        localStorage.setItem("gang-boyz-hot-products", JSON.stringify(updatedHotProducts))
        window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
      }
      
      setIsAdded(true)
      toast.success("Produto adicionado aos destaques da temporada!")
      onProductAdded()
    } catch (error) {
      console.error("Error adding product to season highlights:", error)
      toast.error("Erro ao adicionar produto aos destaques")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAdded) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full border-green-500 text-green-500"
        disabled
      >
        Adicionado ✓
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToSeasonHighlights}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
    >
      {isLoading ? (
        "Adicionando..."
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar aos Destaques
        </>
      )}
    </Button>
  )
}