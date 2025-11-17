"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Plus, X } from "lucide-react"
import { useProducts } from "@/lib/products-context-simple"
import { ProductTemplate } from "@/components/product-template"
import { useEditMode } from "@/lib/edit-mode-context"
import { toast } from "sonner"
import { Product as ProductType } from "@/lib/products-context-simple"

interface SeasonHighlightProduct {
  id: string
  productId: string // ID of the original product
  name: string
  price: number
  image: string
  originalPrice?: number
}

interface Product extends ProductType {
  // Additional properties for display
  availableUnits?: number
  availableSizes?: string[]
  recommendationCategory?: string
  recommendationSubcategory?: string
}

export function SeasonHighlightsProductSelector({ subcategoryKey }: { subcategoryKey: string }) {
  const { isEditMode } = useEditMode()
  const { products } = useProducts()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SeasonHighlightProduct[]>([])
  const [isSeasonHighlightsPage, setIsSeasonHighlightsPage] = useState(false)

  // Check if this is a Season Highlights page by checking if it exists in showcase banners
  useEffect(() => {
    const checkIfSeasonHighlightsPage = () => {
      const savedBanners = localStorage.getItem("gang-boyz-showcase-banners")
      if (savedBanners) {
        try {
          const banners = JSON.parse(savedBanners)
          // Check if any banner links to this subcategory
          const isSeasonHighlight = banners.some((banner: any) => 
            banner.link === `/explore/${subcategoryKey}`
          )
          setIsSeasonHighlightsPage(isSeasonHighlight)
        } catch (error) {
          console.error("Error checking if season highlights page:", error)
        }
      }
    }

    checkIfSeasonHighlightsPage()

    // Listen for banner updates
    const handleShowcaseBannersUpdated = () => {
      checkIfSeasonHighlightsPage()
    }

    window.addEventListener('showcaseBannersUpdated', handleShowcaseBannersUpdated)
    
    return () => {
      window.removeEventListener('showcaseBannersUpdated', handleShowcaseBannersUpdated)
    }
  }, [subcategoryKey])

  // Load existing products for this season highlight page
  useEffect(() => {
    const loadSelectedProducts = () => {
      // Get products for this specific season highlight page
      // We'll use the subcategoryKey to identify products for this page
      const savedProducts = localStorage.getItem(`gang-boyz-season-highlight-${subcategoryKey}-products`)
      if (savedProducts) {
        try {
          const products: SeasonHighlightProduct[] = JSON.parse(savedProducts)
          setSelectedProducts(products)
        } catch (error) {
          console.error("Error loading season highlight products:", error)
        }
      }
    }

    loadSelectedProducts()

    // Listen for updates
    const handleSeasonHighlightProductsUpdated = () => {
      loadSelectedProducts()
    }

    window.addEventListener('seasonHighlightProductsUpdated', handleSeasonHighlightProductsUpdated)
    
    return () => {
      window.removeEventListener('seasonHighlightProductsUpdated', handleSeasonHighlightProductsUpdated)
    }
  }, [subcategoryKey])

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.slice(0, 50)) // Limit to first 50 products to avoid performance issues
      return
    }

    const query = searchQuery.toLowerCase()
    const results = products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.id.toLowerCase().includes(query) ||
      (product as any).color?.toLowerCase().includes(query)
    )
    
    setFilteredProducts(results.slice(0, 50)) // Limit to first 50 results
  }, [searchQuery, products])

  // Check if a product is already added to this season highlight page
  const isProductAdded = (productId: string) => {
    return selectedProducts.some(p => p.productId === productId)
  }

  // Add a product to this season highlight page
  const handleAddProduct = (product: Product) => {
    // Check if product is already added
    if (isProductAdded(product.id)) {
      toast.error("Produto já adicionado a esta página!")
      return
    }

    try {
      // Create season highlight product
      const seasonHighlightProduct: SeasonHighlightProduct = {
        id: `sh-${subcategoryKey}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        originalPrice: product.originalPrice
      }
      
      // Add to season highlight products for this specific page
      const updatedProducts = [...selectedProducts, seasonHighlightProduct]
      setSelectedProducts(updatedProducts)
      localStorage.setItem(`gang-boyz-season-highlight-${subcategoryKey}-products`, JSON.stringify(updatedProducts))
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
      
      toast.success("Produto adicionado com sucesso!")
    } catch (error) {
      console.error("Error adding product to season highlights:", error)
      toast.error("Erro ao adicionar produto")
    }
  }

  // Remove a product from this season highlight page
  const handleRemoveProduct = (productId: string) => {
    try {
      const updatedProducts = selectedProducts.filter(p => p.id !== productId)
      setSelectedProducts(updatedProducts)
      localStorage.setItem(`gang-boyz-season-highlight-${subcategoryKey}-products`, JSON.stringify(updatedProducts))
      window.dispatchEvent(new CustomEvent('seasonHighlightProductsUpdated'))
      
      toast.success("Produto removido com sucesso!")
    } catch (error) {
      console.error("Error removing product from season highlights:", error)
      toast.error("Erro ao remover produto")
    }
  }

  // Only show this component on Season Highlights pages when in edit mode
  if (!isEditMode || !isSeasonHighlightsPage) {
    return null
  }

  return (
    <div className="mb-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Produto
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Adicionar Produto aos Destaques</DialogTitle>
            <p className="text-gray-400">Selecione produtos existentes para adicionar a esta página</p>
          </DialogHeader>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar por nome, ID ou cor do produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          {/* Selected Products Preview */}
          {selectedProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Produtos Selecionados ({selectedProducts.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="relative bg-gray-800 rounded-lg p-2">
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">ID: {product.productId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {searchQuery ? "Resultados da Pesquisa" : "Todos os Produtos"} ({filteredProducts.length})
            </h3>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductTemplate 
                      product={product} 
                      className="h-full"
                      disableSeasonHighlightsSelector={true}
                    />
                    {!isProductAdded(product.id) && (
                      <Button
                        onClick={() => handleAddProduct(product)}
                        className="absolute bottom-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-8 px-3 text-xs font-bold"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
                    )}
                    {isProductAdded(product.id) && (
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white h-8 px-3 text-xs font-bold rounded flex items-center">
                        Adicionado ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                {searchQuery ? "Nenhum produto encontrado." : "Nenhum produto disponível."}
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}