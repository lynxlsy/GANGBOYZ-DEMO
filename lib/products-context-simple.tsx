"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { safeSetItem, safeGetItem, cleanupLocalStorage, monitorLocalStorageUsage } from "@/lib/localStorage-utils"
import { eventManager } from "@/lib/event-manager"
import { runDuringIdle } from "@/lib/idle-callback"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  color: string
  categories: string[]
  sizes: string[]
  discountPercentage?: number
  installments?: string
  brand?: string
  isNew?: boolean
  isPromotion?: boolean
  description: string
  status: "ativo" | "inativo"
  stock: number
  // Adicionando estoque por tamanho
  sizeStock?: Record<string, number>
  // Adicionando campos extras que estavam faltando
  rating?: number
  reviews?: number
  weight?: string
  dimensions?: string
  material?: string
  care?: string
  origin?: string
  warranty?: string
  // Added new fields for recommendations
  availableUnits?: number
  availableSizes?: string[]
  recommendationCategory?: string
  // Added new fields for highlighting
  destacarEmRecomendacoes?: boolean
  destacarEmOfertas?: boolean
  destacarEmAlta?: boolean
  destacarLancamentos?: boolean
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductsByCategory: (category: string) => Product[]
  getActiveProductsByCategory: (category: string) => Product[]
  saveProducts: () => Promise<void> // Added save function
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isSaving, setIsSaving] = useState(false) // Added saving state

  // Dados iniciais simplificados
  const initialProducts: Product[] = [
    // CALÇAS
  ]

  // Carregar dados na inicialização
  useEffect(() => {
    const loadProducts = () => {
      // Carregar produtos do admin (gang-boyz-test-products)
      const adminProducts = safeGetItem("gang-boyz-test-products")
      let allProducts = [...initialProducts]
      
      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts)
          const convertedProducts = parsedAdminProducts.map((adminProduct: any) => ({
            id: adminProduct.id || `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`, // Ensure ID exists
            name: adminProduct.name,
            price: adminProduct.price,
            originalPrice: adminProduct.originalPrice,
            image: adminProduct.image,
            color: adminProduct.color,
            categories: [adminProduct.category, adminProduct.subcategory].filter(Boolean),
            sizes: adminProduct.sizes || [],
            discountPercentage: adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price 
              ? Math.round(((adminProduct.originalPrice - adminProduct.price) / adminProduct.originalPrice) * 100)
              : undefined,
            installments: "3x sem juros",
            brand: "Gang BoyZ",
            isNew: adminProduct.destacarLancamentos || false,
            isPromotion: adminProduct.destacarEmAlta || !!(adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price),
            description: `${adminProduct.name} - Cor: ${adminProduct.color}`,
            status: "ativo" as const,
            stock: adminProduct.stock || 0,
            sizeStock: adminProduct.sizeStock || {},
            rating: adminProduct.rating || 4.5,
            reviews: adminProduct.reviews || Math.floor(Math.random() * 100) + 10,
            weight: adminProduct.weight || "300g",
            dimensions: adminProduct.dimensions || "70cm x 50cm",
            material: adminProduct.material || "100% Algodão",
            care: adminProduct.care || "Lavar à mão, não alvejar",
            origin: adminProduct.origin || "Brasil",
            warranty: adminProduct.warranty || "90 dias contra defeitos",
            // Highlighting fields
            destacarEmRecomendacoes: adminProduct.destacarEmRecomendacoes || false,
            destacarEmOfertas: adminProduct.destacarEmOfertas || false,
            destacarEmAlta: adminProduct.destacarEmAlta || false,
            destacarLancamentos: adminProduct.destacarLancamentos || false
          }))
          
          allProducts = [...allProducts, ...convertedProducts]
        } catch (error) {
          console.error("Erro ao fazer parse dos produtos do admin:", error)
        }
      }
      
      setProducts(allProducts)
      safeSetItem("gang-boyz-products", JSON.stringify(allProducts), 0) // No debounce for immediate save
      // Removido monitorLocalStorageUsage() para evitar loop de logs
    }
    
    loadProducts()
  }, [])

  // Salvar no localStorage com debounce para evitar operações frequentes
  useEffect(() => {
    if (products.length > 0 && !isSaving) {
      // Debounce localStorage updates to once every 3 seconds (increased from 2)
      const timer = setTimeout(() => {
        safeSetItem("gang-boyz-products", JSON.stringify(products), 0) // No debounce for immediate save
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [products, isSaving])

  // Escutar eventos de produtos criados no admin
  useEffect(() => {
    const handleAdminProductCreated = () => {
      // Removido console.log para evitar loop de logs
      // Recarregar produtos quando um novo produto for criado no admin
      const adminProducts = safeGetItem("gang-boyz-test-products")
      let allProducts = [...initialProducts]
      
      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts)
          // Limitar a 30 produtos para evitar problemas de performance (reduced from 50)
          const limitedProducts = parsedAdminProducts.slice(-30)
          
          const convertedProducts = limitedProducts.map((adminProduct: any) => ({
            id: adminProduct.id || `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`, // Ensure ID exists
            name: adminProduct.name,
            price: adminProduct.price,
            originalPrice: adminProduct.originalPrice,
            image: adminProduct.image,
            color: adminProduct.color,
            categories: [adminProduct.category, adminProduct.subcategory].filter(Boolean),
            sizes: adminProduct.sizes || [],
            discountPercentage: adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price 
              ? Math.round(((adminProduct.originalPrice - adminProduct.price) / adminProduct.originalPrice) * 100)
              : undefined,
            installments: "3x sem juros",
            brand: "Gang BoyZ",
            isNew: adminProduct.destacarLancamentos || false,
            isPromotion: adminProduct.destacarEmAlta || !!(adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price),
            description: `${adminProduct.name} - Cor: ${adminProduct.color}`,
            status: "ativo" as const,
            stock: adminProduct.stock || 0,
            sizeStock: adminProduct.sizeStock || {},
            rating: adminProduct.rating || 4.5,
            reviews: adminProduct.reviews || Math.floor(Math.random() * 100) + 10,
            weight: adminProduct.weight || "300g",
            dimensions: adminProduct.dimensions || "70cm x 50cm",
            material: adminProduct.material || "100% Algodão",
            care: adminProduct.care || "Lavar à mão, não alvejar",
            origin: adminProduct.origin || "Brasil",
            warranty: adminProduct.warranty || "90 dias contra defeitos",
            // Highlighting fields
            destacarEmRecomendacoes: adminProduct.destacarEmRecomendacoes || false,
            destacarEmOfertas: adminProduct.destacarEmOfertas || false,
            destacarEmAlta: adminProduct.destacarEmAlta || false,
            destacarLancamentos: adminProduct.destacarLancamentos || false
          }))
          
          allProducts = [...allProducts, ...convertedProducts]
        } catch (error) {
          console.error("Erro ao fazer parse dos produtos do admin:", error)
        }
      }
      
      setProducts(allProducts)
      safeSetItem("gang-boyz-products", JSON.stringify(allProducts), 0) // No debounce for immediate save
    }

    eventManager.subscribe('testProductCreated', handleAdminProductCreated)
    eventManager.subscribe('forceProductsReload', handleAdminProductCreated)
    
    return () => {
      eventManager.unsubscribe('testProductCreated', handleAdminProductCreated)
      eventManager.unsubscribe('forceProductsReload', handleAdminProductCreated)
    }
  }, [])

  const addProduct = (product: Product) => {
    // Ensure the product has an ID
    const productWithId = product.id 
      ? product 
      : { ...product, id: `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}` }
    
    setProducts(prev => [...prev, productWithId])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    )
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.categories.some(cat => {
        // Normalize both values for comparison
        const normalizedCat = cat.toLowerCase().trim();
        const normalizedCategory = category.toLowerCase().trim();
        
        // Direct match
        if (normalizedCat === normalizedCategory) return true;
        
        // Partial match
        if (normalizedCat.includes(normalizedCategory)) return true;
        
        // Match by converting spaces to hyphens (display name to key)
        if (normalizedCat.replace(/\s+/g, '-') === normalizedCategory) return true;
        
        // Match by converting hyphens to spaces (key to display name)
        if (normalizedCat === normalizedCategory.replace(/-/g, ' ')) return true;
        
        // Additional fuzzy matching for common variations
        const catWithoutSpaces = normalizedCat.replace(/\s+/g, '');
        const categoryWithoutSpaces = normalizedCategory.replace(/\s+/g, '');
        if (catWithoutSpaces === categoryWithoutSpaces) return true;
        
        return false;
      })
    )
  }

  const getActiveProductsByCategory = (category: string) => {
    // Removido console.log para evitar loop de logs
    return products.filter(product => 
      product.status === "ativo" &&
      product.categories.some(cat => {
        // Normalize both values for comparison
        const normalizedCat = cat.toLowerCase().trim();
        const normalizedCategory = category.toLowerCase().trim();
        
        // Direct match
        if (normalizedCat === normalizedCategory) return true;
        
        // Partial match
        if (normalizedCat.includes(normalizedCategory)) return true;
        
        // Match by converting spaces to hyphens (display name to key)
        if (normalizedCat.replace(/\s+/g, '-') === normalizedCategory) return true;
        
        // Match by converting hyphens to spaces (key to display name)
        if (normalizedCat === normalizedCategory.replace(/-/g, ' ')) return true;
        
        // Additional fuzzy matching for common variations
        const catWithoutSpaces = normalizedCat.replace(/\s+/g, '');
        const categoryWithoutSpaces = normalizedCategory.replace(/\s+/g, '');
        if (catWithoutSpaces === categoryWithoutSpaces) return true;
        
        return false;
      })
    )
  }

  // Added save function to properly handle saving products
  const saveProducts = async () => {
    if (isSaving) return; // Prevent multiple simultaneous saves
    
    setIsSaving(true)
    try {
      // Save to localStorage with immediate save (no debounce)
      safeSetItem("gang-boyz-test-products", JSON.stringify(products), 0)
      
      // Emit event to notify other components
      eventManager.emitThrottled('forceProductsReload')
      
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error("Error saving products:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategory,
      getActiveProductsByCategory,
      saveProducts // Export the save function
    }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}