"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { StandardProductCard } from "@/components/standard-product-card"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"
import { useEditMode } from "@/lib/edit-mode-context"
import { ArrowLeft, Edit, Filter, Trash2, X, Plus } from "lucide-react"
import Link from "next/link"
import { CategoryConfig } from "@/lib/category-config"
import { SeasonHighlightsProductSelector } from "@/components/season-highlights-product-selector"
import { AdminProductModal } from "@/components/admin-product-modal"
import { eventManager } from "@/lib/event-manager"

interface ProductFiltersState {
  sortOption: string
  colors: string[]
  sizes: string[]
  labels: string[]
  priceRange: { min: number; max: number }
}

interface ProductCategoryPageProps {
  config: CategoryConfig
  subcategoryKey: string
}

export function TestProductCategoryPage({ config, subcategoryKey }: ProductCategoryPageProps) {
  const router = useRouter()
  const { products, getActiveProductsByCategory } = useProducts()
  const { addItem } = useCart()
  const { isEditMode } = useEditMode()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<ProductFiltersState>({
    sortOption: "mais-vendidos",
    colors: [],
    sizes: [],
    labels: [],
    priceRange: { min: 0, max: 500 }
  })
  const [seasonHighlightProducts, setSeasonHighlightProducts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)

  // Get products for this category
  const categoryProducts = useMemo(() => {
    return getActiveProductsByCategory(subcategoryKey)
  }, [getActiveProductsByCategory, subcategoryKey])

  // Apply filters to products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...categoryProducts]

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter(product => 
        filters.colors.includes(product.color)
      )
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter(product => 
        product.sizes.some(size => filters.sizes.includes(size))
      )
    }

    // Apply label filter
    if (filters.labels.length > 0) {
      result = result.filter(product => {
        if (filters.labels.includes("Promoção") && product.isPromotion) return true
        if (filters.labels.includes("Esgotado") && product.stock === 0) return true
        if (filters.labels.includes("Personalizada") && product.isNew) return true
        if (filters.labels.includes("Sem Etiqueta") && !product.isPromotion && !product.isNew && product.stock > 0) return true
        return false
      })
    }

    // Apply price filter
    result = result.filter(product => 
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    )

    // Apply sorting
    switch (filters.sortOption) {
      case "menor-preco":
        result.sort((a, b) => a.price - b.price)
        break
      case "maior-preco":
        result.sort((a, b) => b.price - a.price)
        break
      case "mais-recentes":
        // Sort by ID in descending order (newer products have higher IDs)
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case "melhor-avaliados":
        // Sort by original price (as a proxy for quality/reviews)
        result.sort((a, b) => {
          const priceA = a.originalPrice || a.price
          const priceB = b.originalPrice || b.price
          return priceB - priceA
        })
        break
      case "mais-vendidos":
      default:
        // Default sorting by name
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [categoryProducts, filters])

  // Handle filter changes
  const handleFiltersChange = (newFilters: ProductFiltersState) => {
    setFilters(newFilters)
  }

  // Escutar eventos de produtos criados e carregar automaticamente
  useEffect(() => {
    const handleProductCreated = () => {
      console.log("🔄 Produto criado detectado na página padrão")
      // Forçar atualização do contexto
      eventManager.emit('forceProductsReload')
    }

    // Carregar produtos automaticamente quando a página carregar
    const loadProductsOnMount = () => {
      console.log("🔄 Carregando produtos automaticamente na página padrão")
      eventManager.emit('forceProductsReload')
    }

    // Load Season Highlights products
    const loadSeasonHighlightProducts = () => {
      const savedProducts = localStorage.getItem(`gang-boyz-season-highlight-${subcategoryKey}-products`)
      if (savedProducts) {
        try {
          const products = JSON.parse(savedProducts)
          setSeasonHighlightProducts(products)
        } catch (error) {
          console.error("Error loading season highlight products:", error)
        }
      }
    }

    // Event listeners
    eventManager.subscribe('testProductCreated', handleProductCreated)
    eventManager.subscribe('seasonHighlightProductsUpdated', loadSeasonHighlightProducts)
    
    // Carregar produtos no mount
    loadProductsOnMount()
    loadSeasonHighlightProducts()

    // Cleanup
    return () => {
      eventManager.unsubscribe('testProductCreated', handleProductCreated)
      eventManager.unsubscribe('seasonHighlightProductsUpdated', loadSeasonHighlightProducts)
    }
  }, [subcategoryKey])

  const handleAddToCart = (product: any) => {
    // Convert product ID to number for cart compatibility
    const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
    
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  // Function to handle product editing
  const handleEditProduct = (product: any) => {
    console.log("🖱️ Botão de editar clicado para produto:", product)
    
    // Try to get the full product data from admin products to include product info fields
    let adminProduct: any = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: product.color,
      image: product.image,
      category: product.categories?.[0] || config.category,
      subcategory: product.categories?.[1] || config.subcategory,
      label: product.label || "",
      labelType: product.labelType || "promocao",
      description: product.description || "",
      sizes: product.sizes || [],
      stock: product.stock || 0
    };
    
    try {
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
      if (existingAdminProducts) {
        const adminProductsArray = JSON.parse(existingAdminProducts);
        const fullAdminProduct = adminProductsArray.find((p: any) => p.id === product.id);
        
        if (fullAdminProduct) {
          // Merge the full admin product data
          adminProduct = {
            ...adminProduct,
            ...fullAdminProduct,
            // Ensure category info is preserved
            category: product.categories?.[0] || config.category,
            subcategory: product.categories?.[1] || config.subcategory
          };
        }
      }
    } catch (error) {
      console.error("Error fetching full product data for edit:", error);
      // Fall back to the basic product data
    }
    
    console.log("🔄 Produto convertido para formato admin:", adminProduct)
    
    setCurrentProduct(adminProduct)
    setIsEditing(true)
    setIsModalOpen(true)
    console.log("📱 Modal de edição aberto")
  }

  // Function to save a product
  const handleSaveProduct = (product: any) => {
    if (isEditing) {
      // For editing, we need to update an existing product
      try {
        // Get existing products
        const existingProducts = localStorage.getItem("gang-boyz-test-products")
        let productsArray: any[] = []
        
        if (existingProducts) {
          productsArray = JSON.parse(existingProducts)
        }
        
        // Find the existing product and update it
        const updatedProductsArray = productsArray.map((p: any) => 
          p.id === product.id ? { ...product, categories: [product.category, product.subcategory].filter(Boolean) } : p
        )
        
        // Save back to localStorage
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProductsArray))
        
        // Dispatch event to force reload
        eventManager.emit('testProductCreated')
        eventManager.emit('forceProductsReload')
        
        // Check if the destacarEmAlta flag has changed
        const oldProduct = productsArray.find((p: any) => p.id === product.id)
        const oldDestacarEmAlta = oldProduct ? oldProduct.destacarEmAlta : false
        const newDestacarEmAlta = product.destacarEmAlta || false
        
        // If the destacarEmAlta flag has changed, update the hot products
        if (oldDestacarEmAlta !== newDestacarEmAlta) {
          eventManager.emit('hotProductsUpdated')
        }
        
        console.log("Product updated:", product)
      } catch (error) {
        console.error("Error updating product:", error)
      }
    } else {
      // Add new product to localStorage
      try {
        // Get existing products
        const existingProducts = localStorage.getItem("gang-boyz-test-products")
        let productsArray: any[] = []
        
        if (existingProducts) {
          productsArray = JSON.parse(existingProducts)
        }
        
        // Ensure the product has the correct categories array for proper filtering
        const productWithCategories = {
          ...product,
          categories: [product.category, product.subcategory].filter(Boolean)
        }
        
        // Add the new product
        productsArray.push(productWithCategories)
        
        // Save back to localStorage
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(productsArray))
        
        // Dispatch event to force reload
        eventManager.emit('testProductCreated')
        eventManager.emit('forceProductsReload')
        
        // If this product is marked to be highlighted in "Em Alta", also update the hot products
        if (product.destacarEmAlta) {
          eventManager.emit('hotProductsUpdated')
        }
        
        console.log("Product saved:", productWithCategories)
      } catch (error) {
        console.error("Error saving product:", error)
      }
    }
    
    // Close modal
    setIsModalOpen(false)
    setIsEditing(false)
    setCurrentProduct(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Espaçamento para o header */}
      <div className="h-[180px]"></div>
      
      <main className="pt-0">
        <div className="flex">
          {/* Sidebar de Filtros - Escondida no Mobile */}
          <div className="hidden md:block w-80 bg-black pt-0 ml-[40px]">
            <ProductFilters 
              category={config.category} 
              subcategory={subcategoryKey} 
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 py-4 pl-0 md:pl-8">
            {/* Header da Categoria */}
            <div className="px-4 md:px-8 py-8">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{config.displayName}</h1>
                <p className="text-gray-400">{config.description}: {filteredAndSortedProducts.length}</p>
              </div>
              
              {/* Botão de Filtros Mobile - Fixo abaixo do título */}
              <div className="md:hidden mb-6">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filtros</span>
                </button>
              </div>
              
              {/* Season Highlights Product Selector - Only for Season Highlights pages */}
              <SeasonHighlightsProductSelector subcategoryKey={subcategoryKey} />
              
              {/* Add Product Cards Button - Only visible in edit mode */}
              {isEditMode && (
                <div className="mb-6">
                  <Button
                    onClick={() => {
                      setCurrentProduct(null);
                      setIsEditing(false);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Produto
                  </Button>
                </div>
              )}
            </div>

            {/* Grid de Cards */}
            <div className="px-4 md:px-8">
              {/* Season Highlights Products */}
              {seasonHighlightProducts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Produtos em Destaque</h2>
                  <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {seasonHighlightProducts.map((product) => {
                      // Find the full product data from the main products list
                      const fullProduct = products.find(p => p.id === product.productId) || product
                      return (
                        <div key={product.id} className="relative group w-full">
                          <StandardProductCard
                            product={fullProduct}
                            onClick={() => isEditMode ? handleEditProduct(fullProduct) : router.push(`/produto/${fullProduct.id}`)}
                          />
                          {isEditMode && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <button
                                className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProduct(fullProduct);
                                }}
                                title="Editar produto"
                              >
                                <Edit className="h-4 w-4 text-gray-700" />
                              </button>
                              <button
                                className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Remove product from season highlights
                                  const updatedProducts = seasonHighlightProducts.filter(p => p.id !== product.id)
                                  setSeasonHighlightProducts(updatedProducts)
                                  localStorage.setItem(`gang-boyz-season-highlight-${subcategoryKey}-products`, JSON.stringify(updatedProducts))
                                  window.dispatchEvent(new CustomEvent('seasonHighlightProductsUpdated'))
                                }}
                                title="Excluir produto"
                              >
                                <Trash2 className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {/* Mobile - Grid otimizado (2 cards por linha) */}
                  <div className="md:hidden">
                    <div className="grid grid-cols-2 gap-3">
                      {seasonHighlightProducts.map((product) => {
                        // Find the full product data from the main products list
                        const fullProduct = products.find(p => p.id === product.productId) || product
                        return (
                          <div key={product.id} className="relative group w-full">
                            <StandardProductCard
                              product={fullProduct}
                              onClick={() => isEditMode ? handleEditProduct(fullProduct) : router.push(`/produto/${fullProduct.id}`)}
                            />
                            {isEditMode && (
                              <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity">
                                <button
                                  className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditProduct(fullProduct);
                                  }}
                                  title="Editar produto"
                                >
                                  <Edit className="h-4 w-4 text-gray-700" />
                                </button>
                                <button
                                  className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Remove product from season highlights
                                    const updatedProducts = seasonHighlightProducts.filter(p => p.id !== product.id)
                                    setSeasonHighlightProducts(updatedProducts)
                                    localStorage.setItem(`gang-boyz-season-highlight-${subcategoryKey}-products`, JSON.stringify(updatedProducts))
                                    window.dispatchEvent(new CustomEvent('seasonHighlightProductsUpdated'))
                                  }}
                                  title="Excluir produto"
                                >
                                  <Trash2 className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Category Products */}
              {filteredAndSortedProducts.length > 0 ? (
                <>
                  <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredAndSortedProducts.map((product) => (
                      <div key={product.id} className="relative group">
                        <StandardProductCard
                          product={product}
                          onClick={() => isEditMode ? handleEditProduct(product) : router.push(`/produto/${product.id}`)}
                        />
                        {isEditMode && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                              className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProduct(product);
                              }}
                              title="Editar produto"
                            >
                              <Edit className="h-4 w-4 text-gray-700" />
                            </button>
                            <button
                              className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                                  // Remove from localStorage
                                  const existingProducts = localStorage.getItem("gang-boyz-test-products");
                                  if (existingProducts) {
                                    const productsArray = JSON.parse(existingProducts);
                                    const updatedProducts = productsArray.filter((p: any) => p.id !== product.id);
                                    localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProducts));
                                    
                                    // Dispatch event to force reload
                                    eventManager.emit('testProductCreated');
                                    eventManager.emit('forceProductsReload');
                                  }
                                }
                              }}
                              title="Excluir produto"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Botão de adicionar quando em modo de edição */}
                    {isEditMode && (
                      <div 
                        className="w-full flex items-center justify-center cursor-pointer group"
                        onClick={() => {
                          // Create a default product for the modal
                          const defaultProduct = {
                            id: Date.now().toString(),
                            name: "",
                            price: 0,
                            originalPrice: 0,
                            image: "/placeholder-default.svg",
                            category: config.category,
                            subcategory: config.subcategory,
                            description: "",
                            sizes: [],
                            stock: 0,
                            color: "",
                            label: "",
                            labelType: undefined
                          }
                          
                          setCurrentProduct(defaultProduct);
                          setIsEditing(false);
                          setIsModalOpen(true);
                        }}
                      >
                        <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
                          <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 cursor-pointer">
                            <div className="text-center text-gray-400">
                              <div className="text-2xl mb-1">➕</div>
                              <div className="text-xs font-medium">ADICIONAR PRODUTO</div>
                              <div className="text-xs">Clique para adicionar</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Mobile - Grid otimizado (2 cards por linha) */}
                  <div className="md:hidden">
                    <div className="grid grid-cols-2 gap-3">
                      {filteredAndSortedProducts.map((product) => (
                        <div key={product.id} className="relative group">
                          <StandardProductCard
                            product={product}
                            onClick={() => isEditMode ? handleEditProduct(product) : router.push(`/produto/${product.id}`)}
                          />
                          {isEditMode && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity">
                              <button
                                className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProduct(product);
                                }}
                                title="Editar produto"
                              >
                                <Edit className="h-4 w-4 text-gray-700" />
                              </button>
                              <button
                                className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                                    // Remove from localStorage
                                    const existingProducts = localStorage.getItem("gang-boyz-test-products");
                                    if (existingProducts) {
                                      const productsArray = JSON.parse(existingProducts);
                                      const updatedProducts = productsArray.filter((p: any) => p.id !== product.id);
                                      localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProducts));
                                      
                                      // Dispatch event to force reload
                                      eventManager.emit('testProductCreated');
                                      eventManager.emit('forceProductsReload');
                                    }
                                  }
                                }}
                                title="Excluir produto"
                              >
                                <Trash2 className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Botão de adicionar quando em modo de edição (Mobile) */}
                      {isEditMode && (
                        <div 
                          className="relative group"
                          onClick={() => {
                            // Create a default product for the modal
                            const defaultProduct = {
                              id: Date.now().toString(),
                              name: "",
                              price: 0,
                              originalPrice: 0,
                              image: "/placeholder-default.svg",
                              category: config.category,
                              subcategory: config.subcategory,
                              description: "",
                              sizes: [],
                              stock: 0,
                              color: "",
                              label: "",
                              labelType: undefined
                            }
                            
                            setCurrentProduct(defaultProduct);
                            setIsEditing(false);
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 h-full min-h-[200px] cursor-pointer">
                            <div className="text-center text-gray-400">
                              <div className="text-2xl mb-1">➕</div>
                              <div className="text-xs font-medium">ADICIONAR PRODUTO</div>
                              <div className="text-xs">Clique para adicionar</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-lg">
                    Nenhum produto encontrado com os filtros aplicados.
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    Tente ajustar seus filtros ou limpar todas as seleções.
                  </div>
                  <button 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => setFilters({
                      sortOption: "mais-vendidos",
                      colors: [],
                      sizes: [],
                      labels: [],
                      priceRange: { min: 0, max: 500 }
                    })}
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Sidebar de Filtros Mobile */}
      {isMobileFiltersOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[80] md:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Sidebar - Direita */}
          <div className="md:hidden fixed right-0 top-0 h-full w-full max-w-sm bg-black/95 backdrop-blur-md border-l border-white/20 z-[90] transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-white hover:text-gray-300 transition-colors duration-200 group"
                >
                  <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-white" />
                  <h2 className="text-white font-bold text-lg">Filtros</h2>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <ProductFilters 
                  category={config.category} 
                  subcategory={subcategoryKey} 
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Admin Product Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
          setCurrentProduct(null);
        }}
        product={currentProduct}
        onSave={handleSaveProduct}
        title={config.subcategory}
        subcategory={subcategoryKey}
        mode={isEditing ? "edit" : "create"}
      />
      
      <Footer />
    </div>
  )
}