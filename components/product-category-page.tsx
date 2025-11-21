"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductTemplate } from "@/components/product-template"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { StandardProductCard } from "@/components/standard-product-card"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"
import { useEditMode } from "@/lib/edit-mode-context"
import { ArrowLeft, Edit, Filter, Trash2, X, Plus, Check, ChevronDown } from "lucide-react"
import Link from "next/link"
import { CategoryConfig } from "@/lib/category-config"
import { SeasonHighlightsProductSelector } from "@/components/season-highlights-product-selector"
import { AdminProductModal } from "@/components/admin-product-modal"
import { eventManager } from "@/lib/event-manager"
import { CustomMobileHeader } from "@/components/em-alta-mobile-header"

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
  isMainCategory?: boolean // New prop to indicate if this is a main category page
  subcategoryKeys?: string[] // New prop for main category pages to specify which subcategories to include
  customMobileHeader?: React.ReactNode // Custom mobile header for special cases like /em-alta
}

export function ProductCategoryPage({ config, subcategoryKey, isMainCategory = false, subcategoryKeys = [], customMobileHeader }: ProductCategoryPageProps) {
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

  // Get products for this category or categories
  const categoryProducts = useMemo(() => {
    if (subcategoryKey === 'em-alta') {
      // For "em-alta" category, get products with destacarEmAlta flag set to true
      return products.filter((product: any) => product.destacarEmAlta === true && product.status !== 'inativo')
    } else if (isMainCategory && subcategoryKeys.length > 0) {
      // For main category pages, get products from all specified subcategories
      let allProducts: any[] = []
      subcategoryKeys.forEach(key => {
        const subcategoryProducts = getActiveProductsByCategory(key)
        allProducts = [...allProducts, ...subcategoryProducts]
      })
      
      // Remove duplicates by ID
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      )
      
      return uniqueProducts
    } else {
      // For subcategory pages, get products from the specific subcategory
      return getActiveProductsByCategory(subcategoryKey)
    }
  }, [getActiveProductsByCategory, subcategoryKey, isMainCategory, subcategoryKeys, products])

  // Apply filters to products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...categoryProducts]

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter(product => {
        // Handle both single colors and comma-separated colors
        const productColors = product.color ? product.color.split(',').map((c: string) => c.trim().toLowerCase()) : [];
        return filters.colors.some(selectedColor => 
          productColors.includes(selectedColor.toLowerCase())
        );
      });
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter(product => 
        product.sizes.some((size: string) => filters.sizes.includes(size))
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
          p.id === product.id ? { 
            ...product, 
            categories: [product.category, product.subcategory].filter(Boolean),
            // Ensure the product has the correct sizes array
            sizes: product.availableSizes && product.availableSizes.length > 0 
              ? product.availableSizes 
              : []
          } : p
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
          categories: [product.category, product.subcategory].filter(Boolean),
          // Ensure the product has the correct sizes array
          sizes: product.availableSizes && product.availableSizes.length > 0 
            ? product.availableSizes 
            : []
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
      {/* Conditionally render custom mobile header for /em-alta page */}
      {subcategoryKey === 'em-alta' ? (
        <CustomMobileHeader />
      ) : (
        <Header />
      )}
      
      {/* Black background separator between header and content */}
      <div className="hidden md:block w-full h-[5cm] bg-black"></div>
      
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
          <div className="flex-1 py-4 pl-0 md:pl-8 pt-24">
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
              {typeof window !== 'undefined' && (
                <SeasonHighlightsProductSelector subcategoryKey={subcategoryKey} />
              )}
              
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
                    {/* Botão de adicionar quando em modo de edição */}
                    {/* Ocultando o botão de adicionar produto conforme solicitado */}
                    {/* {isEditMode && (
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
                            subcategory: subcategoryKey,
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
                    )} */}
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
                      {/* Botão de adicionar quando em modo de edição (Mobile) */}
                      {/* Ocultando o botão de adicionar produto conforme solicitado */}
                      {/* {isEditMode && (
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
                              subcategory: subcategoryKey,
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
                      )} */}
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
                            subcategory: subcategoryKey,
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
                              subcategory: subcategoryKey,
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
      
      {/* Modal de Filtros Mobile - Moderno */}
      {isMobileFiltersOpen && (
        <>
          {/* Overlay moderno */}
          <div 
            className="fixed inset-0 bg-black/80 z-[90] md:hidden flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            {/* Modal moderno */}
            <div 
              className="bg-black border border-gray-800 rounded-xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header moderno */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-white font-medium text-sm uppercase tracking-wider">Filtros</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Conteúdo moderno com scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Ordenar por */}
                <div>
                  <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Ordenar por</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'mais-vendidos', label: 'Mais Vendidos' },
                      { value: 'menor-preco', label: 'Menor Preço' },
                      { value: 'maior-preco', label: 'Maior Preço' },
                      { value: 'mais-recentes', label: 'Mais Recentes' },
                      { value: 'melhor-avaliados', label: 'Melhor Avaliados' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilters(prev => ({ ...prev, sortOption: option.value }))}
                        className="flex items-center gap-3 py-2 w-full text-left"
                      >
                        <div className="relative flex items-center justify-center w-5 h-5 border border-gray-600 rounded-full flex-shrink-0">
                          {filters.sortOption === option.value && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-white text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div>
                  <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Preço</h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-gray-400 text-xs mb-1.5">De</label>
                      <input 
                        type="number" 
                        value={filters.priceRange.min}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: { ...prev.priceRange, min: Number(e.target.value) } 
                        }))}
                        className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-red-500 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-400 text-xs mb-1.5">Até</label>
                      <input 
                        type="number" 
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) } 
                        }))}
                        className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-red-500 rounded-lg"
                        placeholder="500"
                      />
                    </div>
                  </div>
                </div>

                {/* Cores */}
                <div>
                  <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Cores</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Preto', color: 'bg-black', value: 'preto' },
                      { name: 'Branco', color: 'bg-white', value: 'branco' },
                      { name: 'Azul', color: 'bg-blue-500', value: 'azul' },
                      { name: 'Vermelho', color: 'bg-red-500', value: 'vermelho' },
                      { name: 'Verde', color: 'bg-green-500', value: 'verde' },
                      { name: 'Amarelo', color: 'bg-yellow-500', value: 'amarelo' }
                    ].map((colorOption) => (
                      <button
                        key={colorOption.value}
                        onClick={() => {
                          if (filters.colors.includes(colorOption.value)) {
                            setFilters(prev => ({
                              ...prev,
                              colors: prev.colors.filter(c => c !== colorOption.value)
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              colors: [...prev.colors, colorOption.value]
                            }));
                          }
                        }}
                        className={`w-8 h-8 rounded-full ${colorOption.color} border-2 ${filters.colors.includes(colorOption.value) ? 'border-red-500' : 'border-gray-700'} flex items-center justify-center`}
                        title={colorOption.name}
                      >
                        {filters.colors.includes(colorOption.value) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tamanhos */}
                <div>
                  <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Tamanhos</h4>
                  <div className="flex flex-wrap gap-2">
                    {['P', 'M', 'G', 'GG', 'XG', 'XXG'].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          if (filters.sizes.includes(size)) {
                            setFilters(prev => ({
                              ...prev,
                              sizes: prev.sizes.filter(s => s !== size)
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              sizes: [...prev.sizes, size]
                            }));
                          }
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg border ${filters.sizes.includes(size) ? 'bg-red-500 border-red-500 text-white' : 'bg-gray-900 border-gray-700 text-white'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Etiquetas */}
                <div>
                  <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Promoção', value: 'promocao', color: 'bg-red-500' },
                      { name: 'Esgotado', value: 'esgotado', color: 'bg-gray-500' },
                      { name: 'Novo', value: 'novo', color: 'bg-blue-500' },
                      { name: 'Lançamento', value: 'lancamento', color: 'bg-green-500' }
                    ].map((label) => (
                      <button
                        key={label.value}
                        onClick={() => {
                          if (filters.labels.includes(label.value)) {
                            setFilters(prev => ({
                              ...prev,
                              labels: prev.labels.filter(l => l !== label.value)
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              labels: [...prev.labels, label.value]
                            }));
                          }
                        }}
                        className={`px-3 py-1.5 text-xs rounded-full ${label.color} ${filters.labels.includes(label.value) ? 'text-white' : 'text-white/70'}`}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Botões modernos */}
              <div className="p-4 border-t border-gray-800 flex gap-2">
                <button 
                  onClick={() => setFilters({
                    sortOption: "mais-vendidos",
                    colors: [],
                    sizes: [],
                    labels: [],
                    priceRange: { min: 0, max: 500 }
                  })}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 text-sm font-medium rounded-lg border border-gray-700 transition-colors"
                >
                  Limpar
                </button>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm font-medium rounded-lg transition-colors"
                >
                  Aplicar
                </button>
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