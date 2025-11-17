"use client"

import React, { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingCart, Sparkles, Flame, ChevronDown, Menu, X, Home, Bell, Truck, Edit, Save, Trash2, Plus, Eye, EyeOff } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { MobileLogoSection } from "@/components/mobile-logo-section"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useProductPage } from "@/hooks/use-product-page"
import { SearchBar } from "@/components/search-bar"
import { UserDropdown } from "@/components/user-dropdown"
import { useUser } from "@/lib/user-context"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { toast, useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { eventManager } from "@/lib/event-manager"
import { useProducts } from "@/lib/products-context-simple"
import { editableContentSyncService } from "@/lib/editable-content-sync"
import { useEditMode } from "@/lib/edit-mode-context"
import { StandardProductCard } from "@/components/standard-product-card"
import { AdminProductModal } from "@/components/admin-product-modal"

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

interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export function FeaturedProducts() {
  const [categories, setCategories] = useState<Category[]>([])
  const [standaloneProducts, setStandaloneProducts] = useState<Product[]>([])
  const [highlightedProducts, setHighlightedProducts] = useState<Product[]>([])
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  const { addItem, openCart } = useCart()
  const { user, isFavorite, removeFromFavorites, addToFavorites } = useUser()
  const router = useRouter()
  const [editableTitle, setEditableTitle] = useState("OFERTAS")
  const [editingTitle, setEditingTitle] = useState("")
  const [editableDescription, setEditableDescription] = useState("Explore nossas ofertas especiais")
  const [editingDescription, setEditingDescription] = useState("Explore nossas ofertas especiais")
  const [isEditingConfig, setIsEditingConfig] = useState(false)
  const { isEditMode } = useEditMode()
  const { products } = useProducts()

  // Carregar dados do localStorage
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    const loadData = async () => {
      // Carregar título editável
      const titleContent = getContentById("offers-title")
      if (titleContent) {
        setEditableTitle(titleContent)
        setEditingTitle(titleContent)
      }

      // Fallback to localStorage
      const savedCategories = localStorage.getItem("gang-boyz-categories")
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
      
      const savedStandaloneProducts = localStorage.getItem("gang-boyz-standalone-products")
      if (savedStandaloneProducts) {
        setStandaloneProducts(JSON.parse(savedStandaloneProducts))
      } else {
        // Sem produtos padrão - aguardando configuração pelo admin
        setStandaloneProducts([])
      }

      const savedHotProducts = localStorage.getItem("gang-boyz-hot-products")
      if (savedHotProducts) {
        setHotProducts(JSON.parse(savedHotProducts))
      }
    }

    // Carregar dados inicialmente
    loadData()

    // Escutar eventos de atualização
    const handleHotProductsUpdated = () => {
      // Removido console.log para evitar loop de logs
      loadData()
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-hot-products" || e.key === "gang-boyz-categories" || e.key === "gang-boyz-standalone-products") {
        loadData()
      }
    }

    // Escutar mudanças nos conteúdos editáveis
    const handleEditableContentsChange = () => {
      const titleContent = getContentById("offers-title")
      if (titleContent) {
        setEditableTitle(titleContent)
        setEditingTitle(titleContent)
      }
    }

    // Firebase real-time listener for offers title
    const unsubscribeFirebase = editableContentSyncService.listenToContentChanges("offers-title", (content) => {
      if (content) {
        setEditableTitle(content)
        setEditingTitle(content)
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('editableContentsUpdated'))
      }
    })

    // Event listeners
    window.addEventListener('hotProductsUpdated', handleHotProductsUpdated)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('editableContentsUpdated', handleEditableContentsChange)

    return () => {
      window.removeEventListener('hotProductsUpdated', handleHotProductsUpdated)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('editableContentsUpdated', handleEditableContentsChange)
      // Clean up Firebase listener
      unsubscribeFirebase()
    }
  }, [])

  // Carregar produtos destacados para ofertas
  useEffect(() => {
    const loadHighlightedProducts = () => {
      // Filtrar produtos marcados para aparecer em ofertas
      const highlighted = products.filter(product => 
        product.destacarEmOfertas === true
      ).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        isNew: product.isNew || false,
        isPromotion: product.isPromotion || false,
        installments: product.installments || "3x sem juros",
        brand: product.brand || "Gang BoyZ"
      }));
      setHighlightedProducts(highlighted);
    };

    loadHighlightedProducts();

    // Escutar eventos de atualização de produtos
    const handleProductsUpdate = () => {
      loadHighlightedProducts();
    };

    window.addEventListener('forceProductsReload', handleProductsUpdate);
    window.addEventListener('testProductCreated', handleProductsUpdate);

    return () => {
      window.removeEventListener('forceProductsReload', handleProductsUpdate);
      window.removeEventListener('testProductCreated', handleProductsUpdate);
    };
  }, [products]);

  const toggleLike = (productId: string) => {
    if (!user) {
      toast({
        title: "Faça login para curtir produtos",
        description: "Você precisa estar logado para curtir produtos."
      })
      router.push('/auth/signin')
      return
    }

    if (isFavorite(productId)) {
      removeFromFavorites(productId)
      toast({
        title: "Removido dos favoritos",
        description: "O produto foi removido dos seus favoritos."
      })
    } else {
      addToFavorites(productId)
      toast({
        title: "Adicionado aos favoritos",
        description: "O produto foi adicionado aos seus favoritos."
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder-default.svg",
    })
    openCart()
  }

  // Add function to compress image before saving
  const compressImage = (imageData: string, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      // If it's not a data URL, return as is
      if (!imageData.startsWith('data:image')) {
        resolve(imageData)
        return
      }
      
      // For data URLs, we'll reduce quality by resizing
      try {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve(imageData); // If canvas context is not available, return original
            return;
          }
          
          // Set canvas dimensions (reduced size)
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        
        img.onerror = () => {
          // If image loading fails, return original
          resolve(imageData);
        };
        
        img.src = imageData;
      } catch (error) {
        console.warn('Error compressing image, saving original:', error)
        resolve(imageData);
      }
    });
  };

  // Add function to save a new product
  const handleSaveProduct = async (product: any) => {
    // Compress image before saving
    const compressedImage = await compressImage(product.image, 0.6)
    const productWithCompressedImage = { ...product, image: compressedImage }
    
    // Add to localStorage
    const existingProducts = localStorage.getItem("gang-boyz-standalone-products");
    let productsArray: Product[] = [];
    
    if (existingProducts) {
      productsArray = JSON.parse(existingProducts);
    }
    
    // Generate ID if needed
    const productId = product.id || `standalone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create product object with correct structure for standalone display
    const newProduct: Product = {
      id: productId,
      name: productWithCompressedImage.name,
      price: productWithCompressedImage.price,
      originalPrice: productWithCompressedImage.originalPrice,
      image: productWithCompressedImage.image,
      isNew: productWithCompressedImage.isNew === 'true' || productWithCompressedImage.isNew === true,
      isPromotion: productWithCompressedImage.isPromotion === 'true' || productWithCompressedImage.isPromotion === true,
      installments: productWithCompressedImage.installments || "3x sem juros",
      brand: productWithCompressedImage.brand || "Gang BoyZ"
    };
    
    productsArray.push(newProduct);
    
    // Save to localStorage
    try {
      localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(productsArray))
      setStandaloneProducts(productsArray)
      
      // Also add to admin products for subcategory display if category/subcategory are provided
      if (productWithCompressedImage.recommendationCategory && productWithCompressedImage.recommendationSubcategory) {
        // Calculate total stock from size quantities
        const sizeQuantities = productWithCompressedImage.sizeQuantities || {}
        const totalUnits = Object.values(sizeQuantities).reduce((sum: number, qty: unknown) => 
          sum + (typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0), 0)
        
        // Map subcategory names to keys for proper category matching
        const subcategoryNameToKeyMap: Record<string, string> = {
          "Manga Curta": "manga-curta",
          "Manga Longa": "manga-longa",
          "Básica": "basica",
          "Regata": "regata",
          "Tank Top": "tank-top",
          "Polo": "polo",
          "Com Capuz": "com-capuz",
          "Sem Capuz": "sem-capuz",
          "Ziper": "ziper",
          "Casual": "casual",
          "Esportiva": "esportiva",
          "Social": "social",
          "Jeans": "jeans",
          "Moletom": "moletom",
          "Esportivo": "esportivo",
          "Praia": "praia"
        };
        
        const subcategoryKey = subcategoryNameToKeyMap[productWithCompressedImage.recommendationSubcategory] || productWithCompressedImage.recommendationSubcategory || "ofertas";
        
        // Create admin product object
        const adminProduct = {
          id: productId,
          name: productWithCompressedImage.name,
          price: productWithCompressedImage.price,
          originalPrice: productWithCompressedImage.originalPrice,
          image: productWithCompressedImage.image,
          color: productWithCompressedImage.color || "Preto",
          category: productWithCompressedImage.recommendationCategory || "Ofertas",
          subcategory: productWithCompressedImage.recommendationSubcategory || "ofertas",
          categories: [productWithCompressedImage.recommendationCategory || "Ofertas", subcategoryKey],
          sizes: productWithCompressedImage.availableSizes || ["P", "M", "G", "GG"],
          stock: totalUnits,
          sizeStock: Object.entries(sizeQuantities).reduce((acc, [size, qty]) => {
            acc[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0
            return acc
          }, {} as Record<string, number>),
          // Adicionando campos extras necessários
          weight: "300g",
          dimensions: "70cm x 50cm",
          material: "100% Algodão",
          care: "Lavar à mão, não alvejar",
          origin: "Brasil",
          warranty: "90 dias contra defeitos",
          // Configuração de destaque para ofertas
          destacarEmOfertas: true
        }
        
        // Save to admin products
        const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
        let adminProductsArray: any[] = [];
        
        if (existingAdminProducts) {
          adminProductsArray = JSON.parse(existingAdminProducts);
        }
        
        adminProductsArray.push(adminProduct);
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(adminProductsArray));
        
        // Dispatch events to force reload products in all pages
        eventManager.emit('forceProductsReload')
        eventManager.emit('testProductCreated')
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto. A imagem pode ser muito grande.",
        variant: "destructive"
      })
      return
    }
    
    toast({
      title: "Produto adicionado",
      description: "O produto foi adicionado com sucesso."
    })
    
    // Close modal
    setIsModalOpen(false)
  }

  // Add function to edit a product
  // Function to handle adding a new product with destacar checkbox pre-checked and disabled
  const handleAddNewProduct = () => {
    // Create a default product for the modal with proper ID
    const defaultProduct = {
      id: generateID('offer'), // Generate ID using unified system
      name: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      color: "", // No default color - user must select
      category: "Ofertas", // Correct category
      subcategory: "ofertas", // Subcategory for OFERTAS
      label: "", // Default label
      labelType: undefined, // Default label type
      stock: 0, // No default stock
      sizeStock: {}, // Empty size stock
      // Recommendation fields for offers (same as recommendations)
      availableUnits: 0,
      availableSizes: [], // No default sizes - user must select
      sizeQuantities: {}, // Empty size quantities
      recommendationCategory: "", // User must select category
      recommendationSubcategory: "", // User must select subcategory
      // Automatically check the destacar checkbox for offers
      destacarEmRecomendacoes: false,
      destacarEmOfertas: true,
      destacarEmAlta: false,
      destacarLancamentos: false
    }
    
    setCurrentProduct(defaultProduct);
    setIsEditing(false);
    setIsModalOpen(true);
  }

  const handleEditProduct = (product: Product) => {
    // Convert product to the format expected by AdminProductModal (matching recommendations format)
    const productForModal = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: "Preto", // Will be updated from admin product data
      category: "Ofertas", // Default category
      subcategory: "ofertas", // Subcategory for OFERTAS
      label: "", // Default label
      labelType: undefined, // Default label type
      stock: 10, // Will be updated from admin product data
      sizeStock: {}, // Will be updated from admin product data
      // Recommendation fields (same as recommendations)
      availableUnits: 10, // Will be updated from admin product data
      availableSizes: ["P", "M", "G", "GG"], // Will be updated from admin product data
      sizeQuantities: {
        "P": 2,
        "M": 3,
        "G": 3,
        "GG": 2
      } as Record<string, number>, // Will be updated from admin product data
      recommendationCategory: "Camisetas", // Will be updated from admin product data
      recommendationSubcategory: "basica" // Will be updated from admin product data
    }
    
    // Try to get the full product data from admin products
    try {
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products")
      if (existingAdminProducts) {
        const adminProductsArray: any[] = JSON.parse(existingAdminProducts)
        const adminProduct = adminProductsArray.find((p: any) => p.id === product.id)
        
        if (adminProduct) {
          // Update with actual admin product data
          productForModal.color = adminProduct.color || "Preto"
          productForModal.stock = adminProduct.stock || 0
          productForModal.sizeStock = adminProduct.sizeStock || {}
          productForModal.availableUnits = adminProduct.stock || 0
          productForModal.availableSizes = adminProduct.sizes || ["P", "M", "G", "GG"]
          productForModal.recommendationCategory = adminProduct.category || "Camisetas"
          productForModal.recommendationSubcategory = adminProduct.subcategory || "basica"
          
          // Update size quantities from sizeStock
          const sizeQuantities: Record<string, number> = {}
          if (adminProduct.sizeStock) {
            Object.entries(adminProduct.sizeStock).forEach(([size, qty]) => {
              sizeQuantities[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0
            })
          }
          productForModal.sizeQuantities = sizeQuantities
          
          // Include product info fields if they exist
          productForModal.freeShippingText = adminProduct.freeShippingText
          productForModal.freeShippingThreshold = adminProduct.freeShippingThreshold
          productForModal.pickupText = adminProduct.pickupText
          productForModal.pickupStatus = adminProduct.pickupStatus
          productForModal.material = adminProduct.material
          productForModal.weight = adminProduct.weight
          productForModal.dimensions = adminProduct.dimensions
          productForModal.origin = adminProduct.origin
          productForModal.care = adminProduct.care
          productForModal.warranty = adminProduct.warranty
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do produto admin:', error)
    }
    
    setCurrentProduct(productForModal)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  // Add function to delete a product
  const handleDeleteProduct = async (id: string) => {
    // Remove from localStorage
    const existingProducts = localStorage.getItem("gang-boyz-standalone-products");
    let productsArray: Product[] = [];
    
    if (existingProducts) {
      productsArray = JSON.parse(existingProducts);
    }
    
    // Filter to remove the product
    const updatedProducts = productsArray.filter(product => product.id !== id);
    
    // Save to localStorage first (immediate local update)
    try {
      localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(updatedProducts));
      
      // Update state immediately
      setStandaloneProducts(updatedProducts);
      
      // Also remove from admin products
      try {
        const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
        if (existingAdminProducts) {
          let adminProductsArray: any[] = JSON.parse(existingAdminProducts);
          
          // Filter to remove the product
          const updatedAdminProducts = adminProductsArray.filter((product: any) => product.id !== id);
          
          localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedAdminProducts));
        }
      } catch (error) {
        console.error('Erro ao remover produto do admin:', error);
      }
      
      // Dispatch events to force reload products in all pages
      eventManager.emit('forceProductsReload')
      eventManager.emit('testProductCreated')
      
      // Dispatch event to notify other components
      eventManager.emit('hotProductsUpdated')
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
    
    toast({
      title: "Produto excluído",
      description: "O produto foi removido com sucesso."
    });
  }

  // Add function to update a product
  const handleUpdateProduct = async (product: any) => {
    // Compress image before saving
    const compressedImage = await compressImage(product.image, 0.6)
    const productWithCompressedImage = { ...product, image: compressedImage }
    
    // Update in localStorage
    const updatedProducts = standaloneProducts.map(p => 
      p.id === productWithCompressedImage.id 
        ? {
            id: productWithCompressedImage.id,
            name: productWithCompressedImage.name,
            price: productWithCompressedImage.price,
            originalPrice: productWithCompressedImage.originalPrice,
            image: productWithCompressedImage.image,
            isNew: productWithCompressedImage.isNew === 'true' || productWithCompressedImage.isNew === true,
            isPromotion: productWithCompressedImage.isPromotion === 'true' || productWithCompressedImage.isPromotion === true,
            installments: productWithCompressedImage.installments || "3x sem juros",
            brand: productWithCompressedImage.brand || "Gang BoyZ"
          }
        : p
    )
    
    // Save to localStorage
    try {
      localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(updatedProducts))
      setStandaloneProducts(updatedProducts)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto. A imagem pode ser muito grande.",
        variant: "destructive"
      })
      return
    }
    
    // Also update in the admin products for subcategory display
    try {
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products")
      if (existingAdminProducts) {
        let adminProductsArray: any[] = JSON.parse(existingAdminProducts)
        
        // Calculate total stock from size quantities
        const sizeQuantities = productWithCompressedImage.sizeQuantities || {}
        const totalUnits = Object.values(sizeQuantities).reduce((sum: number, qty: unknown) => 
          sum + (typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0), 0)
        
        // Find and update the product in admin products
        const adminIndex = adminProductsArray.findIndex((p: any) => p.id === productWithCompressedImage.id)
        if (adminIndex !== -1) {
          // Preserve existing product properties that aren't being updated
          const existingProduct = adminProductsArray[adminIndex];
          // Map subcategory names to keys for proper category matching
          const subcategoryNameToKeyMap: Record<string, string> = {
            "Manga Curta": "manga-curta",
            "Manga Longa": "manga-longa",
            "Básica": "basica",
            "Regata": "regata",
            "Tank Top": "tank-top",
            "Polo": "polo",
            "Com Capuz": "com-capuz",
            "Sem Capuz": "sem-capuz",
            "Ziper": "ziper",
            "Casual": "casual",
            "Esportiva": "esportiva",
            "Social": "social",
            "Jeans": "jeans",
            "Moletom": "moletom",
            "Esportivo": "esportivo",
            "Praia": "praia"
          };
          
          const subcategoryKey = subcategoryNameToKeyMap[productWithCompressedImage.recommendationSubcategory] || productWithCompressedImage.recommendationSubcategory || "ofertas";
          
          adminProductsArray[adminIndex] = {
            ...existingProduct, // Preserve existing properties
            id: productWithCompressedImage.id,
            name: productWithCompressedImage.name,
            price: productWithCompressedImage.price,
            originalPrice: productWithCompressedImage.originalPrice,
            image: productWithCompressedImage.image,
            color: productWithCompressedImage.color || "Preto",
            category: productWithCompressedImage.recommendationCategory || "Ofertas",
            subcategory: productWithCompressedImage.recommendationSubcategory || "ofertas",
            categories: [productWithCompressedImage.recommendationCategory || "Ofertas", subcategoryKey],
            sizes: productWithCompressedImage.availableSizes || ["P", "M", "G", "GG"],
            stock: totalUnits,
            sizeStock: Object.entries(sizeQuantities).reduce((acc, [size, qty]) => {
              acc[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0
              return acc
            }, {} as Record<string, number>),
            // Preserve or update existing fields
            weight: existingProduct.weight || "300g",
            dimensions: existingProduct.dimensions || "70cm x 50cm",
            material: existingProduct.material || "100% Algodão",
            care: existingProduct.care || "Lavar à mão, não alvejar",
            origin: existingProduct.origin || "Brasil",
            warranty: existingProduct.warranty || "90 dias contra defeitos",
            // Configuração de destaque - preserve existing settings
            destacarEmRecomendacoes: productWithCompressedImage.destacarEmRecomendacoes || existingProduct.destacarEmRecomendacoes || false,
            destacarEmOfertas: productWithCompressedImage.destacarEmOfertas !== undefined ? productWithCompressedImage.destacarEmOfertas : (existingProduct.destacarEmOfertas !== undefined ? existingProduct.destacarEmOfertas : true),
            destacarEmAlta: productWithCompressedImage.destacarEmAlta || existingProduct.destacarEmAlta || false,
            destacarLancamentos: productWithCompressedImage.destacarLancamentos || existingProduct.destacarLancamentos || false
          }
          
          localStorage.setItem("gang-boyz-test-products", JSON.stringify(adminProductsArray))
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar produto no admin:', error)
    }
    
    toast({
      title: "Produto atualizado",
      description: "O produto foi atualizado com sucesso."
    })
    
    // Close modal
    setIsModalOpen(false)
  }

  const handleSaveTitle = async () => {
    try {
      console.log('Saving offers title to Firebase:', editingTitle);
      await updateContentById("offers-title", editingTitle);
      setEditableTitle(editingTitle);
      toast({
        title: "Título atualizado",
        description: "O título da seção de ofertas foi atualizado com sucesso."
      });
      console.log('Offers title saved successfully');
    } catch (error) {
      console.error('Error saving offers title:', error);
      toast({
        title: "Erro ao salvar título",
        description: "Não foi possível salvar o título da seção de ofertas.",
        variant: "destructive"
      });
    }
  }

  const handleCancelEdit = () => {
    setEditingTitle(editableTitle)
  }

  const handleSaveConfig = async () => {
    try {
      // Update local storage
      updateContentById("season-highlights-title", editingTitle);
      updateContentById("season-highlights-description", editingDescription);
      setEditableTitle(editingTitle);
      setEditableDescription(editingDescription);
      
      // Reset editing state
      setIsEditingConfig(false);
      
      toast({
        title: "Configuração atualizada",
        description: "O título e descrição da seção foram atualizados com sucesso."
      });
    } catch (error) {
      console.error('Error saving config:', error);
      // Mesmo que falhe, manter a alteração local
      setEditableTitle(editingTitle);
      setEditableDescription(editingDescription);
      setIsEditingConfig(false);
      toast({
        title: "Configuração atualizada localmente",
        description: "Configuração atualizada localmente!"
      });
    }
  }

  return (
    <section className="py-8 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <div className="text-center mb-8 md:mb-12 relative">
          {isEditMode ? (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Input
                  value={editingTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                  className="text-2xl md:text-3xl font-bold text-white text-center bg-gray-800 border-gray-600"
                />
                <Edit className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <Button onClick={handleSaveTitle} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {editableTitle}
              </h1>
              <div className="w-24 md:w-32 h-1 red-bg mx-auto rounded"></div>
            </>
          )}
        </div>

        {/* Produtos Avulsos integrados na seção OFERTAS - Otimizado para Mobile */}
        <div className="mb-6 sm:mb-8 md:mb-16">
          {/* Desktop - Grid de produtos (mesmo padrão de recomendações) */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {[...standaloneProducts, ...highlightedProducts].map((product) => (
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
                          handleDeleteProduct(product.id);
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
            {/* Ocultando o botão de adicionar produto conforme solicitado */}
            {/* {isEditMode && (
              <div 
                className="w-full flex items-center justify-center cursor-pointer group"
                onClick={handleAddNewProduct}
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

          {/* Mobile - Grid layout (2 columns) */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3">
              {[...standaloneProducts, ...highlightedProducts].map((product) => (
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
                            handleDeleteProduct(product.id);
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
              {/* Ocultando o botão de adicionar produto conforme solicitado */}
              {/* {isEditMode && (
                <div 
                  className="relative group"
                  onClick={handleAddNewProduct}
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
      </div>
      
      {/* Product Modal */}
      {isModalOpen && (
        <AdminProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={currentProduct}
          onSave={handleSaveProduct}
          title="Ofertas"
          subcategory="ofertas"
          mode={isEditing ? "edit" : "create"}
        />
      )}
    </section>
  )
}