"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Package, 
  SquarePen, 
  X, 
  Heart, 
  ShoppingCart,
  Plus,
  Download,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  Flame,
  Tag,
  TrendingUp,
  Check,
  Grid,
  Layout,
  Home,
  Shirt,
  Users,
  Star
} from "lucide-react"
import { AdminProductModal } from "@/components/admin-product-modal"
import { ProductTemplate } from "@/components/product-template"
import { StandardProductCard } from "@/components/standard-product-card"
import { useEditMode } from "@/lib/edit-mode-context"
import { toast } from "@/hooks/use-toast"
import { eventManager } from '@/lib/event-manager'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  color: string
  image: string
  category: string
  subcategory?: string
  label?: string
  labelType?: 'promocao' | 'esgotado' | 'personalizada'
  // Adicionando campos de estoque
  stock?: number
  sizeStock?: Record<string, number>
  // Adicionando campos para recomendações
  availableUnits?: number
  availableSizes?: string[]
  sizeQuantities?: Record<string, number>
  recommendationCategory?: string
  recommendationSubcategory?: string
  // Adicionando campos para destacar em diferentes seções
  destacarEmRecomendacoes?: boolean
  destacarEmOfertas?: boolean
  destacarEmAlta?: boolean
  destacarLancamentos?: boolean
  // Adicionando campo de descrição
  description?: string
  // Adicionando campos de informações do produto
  freeShippingText?: string
  freeShippingThreshold?: string
  pickupText?: string
  pickupStatus?: string
  material?: string
  weight?: string
  dimensions?: string
  origin?: string
  care?: string
  warranty?: string
}

interface DeletionReport {
  id: string
  name: string
  category: string
  subcategory: string
  reason: string
  timestamp: string
}

interface ModalType {
  id: string
  title: string
  subcategory: string
  description: string
  icon: React.ReactNode
  color: string
  type: 'subcategory' | 'homepage' | 'special' | 'other'
}

export default function DevPage() {
  const { isEditMode } = useEditMode()
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deletionReports, setDeletionReports] = useState<DeletionReport[]>([])
  const [deletionReason, setDeletionReason] = useState("")
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null)
  const [showDeletionModal, setShowDeletionModal] = useState(false)
  const [activeModalType, setActiveModalType] = useState<string | null>(null)
  // States for bulk selection
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [bulkDeletionReason, setBulkDeletionReason] = useState("")
  // State for card types view
  const [showCardTypes, setShowCardTypes] = useState(false)
  // State for product info configuration
  const [productInfo, setProductInfo] = useState({
    freeShippingText: "Frete Grátis",
    freeShippingThreshold: "Acima de R$ 100",
    pickupText: "Retire na Loja",
    pickupStatus: "Disponível",
    material: "100% Algodão",
    weight: "300g",
    dimensions: "70cm x 50cm",
    origin: "Brasil",
    care: "Lavar à mão, não alvejar",
    warranty: "90 dias contra defeitos"
  })

  // Load product info from localStorage on component mount
  useEffect(() => {
    const loadProductInfo = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedInfo = localStorage.getItem('gang-boyz-product-info')
          if (savedInfo) {
            setProductInfo(JSON.parse(savedInfo))
          }
        } catch (error) {
          console.error('Error loading product info:', error)
        }
      }
    }

    loadProductInfo()
  }, [])

  // Save product info to localStorage
  const saveProductInfo = () => {
    try {
      localStorage.setItem('gang-boyz-product-info', JSON.stringify(productInfo))
      toast({
        title: "Informações salvas",
        description: "As informações do produto foram salvas com sucesso."
      })
      
      // Also update test products localStorage for consistency
      const existingTestProducts = localStorage.getItem("gang-boyz-test-products")
      if (existingTestProducts) {
        const testProducts = JSON.parse(existingTestProducts)
        // Update all existing products with the new default values only if they don't have custom values
        const updatedTestProducts = testProducts.map((product: any) => {
          // Load current default values to compare against
          let currentDefaults = {
            freeShippingText: "Frete Grátis",
            freeShippingThreshold: "Acima de R$ 200",
            pickupText: "Retire na Loja",
            pickupStatus: "Disponível",
            material: "100% Algodão",
            weight: "300g",
            dimensions: "70cm x 50cm",
            origin: "Brasil",
            care: "Lavar à mão, não alvejar",
            warranty: "90 dias contra defeitos"
          }
          
          try {
            const savedDefaults = localStorage.getItem('gang-boyz-product-info')
            if (savedDefaults) {
              currentDefaults = { ...currentDefaults, ...JSON.parse(savedDefaults) }
            }
          } catch (error) {
            console.error("Failed to parse product info config:", error)
          }
          
          return {
            ...product,
            // Only update with new defaults if the product has the old default values
            freeShippingText: product.freeShippingText === currentDefaults.freeShippingText ? productInfo.freeShippingText : product.freeShippingText,
            freeShippingThreshold: product.freeShippingThreshold === currentDefaults.freeShippingThreshold ? productInfo.freeShippingThreshold : product.freeShippingThreshold,
            pickupText: product.pickupText === currentDefaults.pickupText ? productInfo.pickupText : product.pickupText,
            pickupStatus: product.pickupStatus === currentDefaults.pickupStatus ? productInfo.pickupStatus : product.pickupStatus,
            material: product.material === currentDefaults.material ? productInfo.material : product.material,
            weight: product.weight === currentDefaults.weight ? productInfo.weight : product.weight,
            dimensions: product.dimensions === currentDefaults.dimensions ? productInfo.dimensions : product.dimensions,
            origin: product.origin === currentDefaults.origin ? productInfo.origin : product.origin,
            care: product.care === currentDefaults.care ? productInfo.care : product.care,
            warranty: product.warranty === currentDefaults.warranty ? productInfo.warranty : product.warranty
          }
        })
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedTestProducts))
      }
    } catch (error) {
      console.error('Error saving product info:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as informações do produto.",
        variant: "destructive"
      })
    }
  }

  // Handle product info input changes
  const handleProductInfoChange = (field: string, value: string) => {
    setProductInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Different modal types used in the project organized by function
  const modalTypes: ModalType[] = [
    // Subcategory modals
    {
      id: "camisetas",
      title: "Camisetas",
      subcategory: "camisetas",
      description: "Modal para adicionar produtos na categoria de camisetas",
      icon: <Shirt className="h-5 w-5" />,
      color: "from-green-500 to-emerald-600",
      type: "subcategory"
    },
    {
      id: "moletons",
      title: "Moletons",
      subcategory: "moletons",
      description: "Modal para adicionar produtos na categoria de moletons",
      icon: <Shirt className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-600",
      type: "subcategory"
    },
    {
      id: "jaquetas",
      title: "Jaquetas",
      subcategory: "jaquetas",
      description: "Modal para adicionar produtos na categoria de jaquetas",
      icon: <Shirt className="h-5 w-5" />,
      color: "from-purple-500 to-indigo-600",
      type: "subcategory"
    },
    {
      id: "calcas",
      title: "Calças",
      subcategory: "calcas",
      description: "Modal para adicionar produtos na categoria de calças",
      icon: <Shirt className="h-5 w-5" />,
      color: "from-yellow-500 to-amber-600",
      type: "subcategory"
    },
    {
      id: "shorts-bermudas",
      title: "Shorts/Bermudas",
      subcategory: "shorts-bermudas",
      description: "Modal para adicionar produtos na categoria de shorts/bermudas",
      icon: <Shirt className="h-5 w-5" />,
      color: "from-orange-500 to-red-600",
      type: "subcategory"
    },
    
    // Homepage modals
    {
      id: "recomendacoes",
      title: "Recomendações (Homepage)",
      subcategory: "recomendacoes",
      description: "Modal exclusivo para a seção de recomendações na homepage",
      icon: <Home className="h-5 w-5" />,
      color: "from-pink-500 to-rose-600",
      type: "homepage"
    },
    {
      id: "ofertas",
      title: "Ofertas (Homepage)",
      subcategory: "ofertas",
      description: "Modal exclusivo para a seção de ofertas na homepage",
      icon: <Tag className="h-5 w-5" />,
      color: "from-red-500 to-orange-600",
      type: "homepage"
    },
    
    // Special pages modals
    {
      id: "lancamentos",
      title: "Lançamentos",
      subcategory: "lancamentos",
      description: "Modal para a página de lançamentos",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-600",
      type: "special"
    },
    {
      id: "em-alta",
      title: "Em Alta",
      subcategory: "em-alta",
      description: "Modal para a página em alta",
      icon: <Flame className="h-5 w-5" />,
      color: "from-orange-500 to-red-600",
      type: "special"
    },
    
    // Other modals
    {
      id: "outros",
      title: "Outros Produtos",
      subcategory: "outros",
      description: "Modal para outros tipos de produtos",
      icon: <Package className="h-5 w-5" />,
      color: "from-gray-500 to-gray-600",
      type: "other"
    }
  ]

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      if (typeof window !== 'undefined') {
        const savedProducts = localStorage.getItem("gang-boyz-dev-products")
        if (savedProducts) {
          try {
            setProducts(JSON.parse(savedProducts))
          } catch (error) {
            console.error('Error loading products:', error)
          }
        }
        
        const savedReports = localStorage.getItem("gang-boyz-deletion-reports")
        if (savedReports) {
          try {
            setDeletionReports(JSON.parse(savedReports))
          } catch (error) {
            console.error('Error loading deletion reports:', error)
          }
        }
      }
    }

    loadProducts()
  }, [])

  // Save products to localStorage
  const saveProducts = (productsToSave: Product[]) => {
    // Save to dev products (for /dev page)
    localStorage.setItem("gang-boyz-dev-products", JSON.stringify(productsToSave))
    
    // Also save to test products (for main system)
    localStorage.setItem("gang-boyz-test-products", JSON.stringify(productsToSave))
    
    setProducts(productsToSave)
    
    // Emit event to notify other components that products have been updated
    eventManager.emit('testProductCreated')
  }

  // Save deletion reports to localStorage
  const saveDeletionReports = (reports: DeletionReport[]) => {
    localStorage.setItem("gang-boyz-deletion-reports", JSON.stringify(reports))
    setDeletionReports(reports)
  }

  const handleAddProduct = (modalType: ModalType) => {
    setActiveModalType(modalType.id)
    setCurrentProduct(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    // Try to get the full product data from admin products to include product info fields
    let fullProduct = { ...product };
    
    try {
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
      if (existingAdminProducts) {
        const adminProductsArray = JSON.parse(existingAdminProducts);
        const adminProduct = adminProductsArray.find((p: any) => p.id === product.id);
        
        if (adminProduct) {
          // Merge the admin product data
          fullProduct = {
            ...product,
            ...adminProduct
          };
        }
      }
    } catch (error) {
      console.error("Error fetching full product data for edit:", error);
      // Fall back to the basic product data
    }
    
    // Find the correct modal type based on the product's category and subcategory
    let modalType;
    if (fullProduct.category === "Recomendações (Homepage)" || fullProduct.subcategory === "recomendacoes") {
      modalType = modalTypes.find(m => m.id === "recomendacoes") || modalTypes[0];
    } else if (fullProduct.category === "Ofertas (Homepage)" || fullProduct.subcategory === "ofertas") {
      modalType = modalTypes.find(m => m.id === "ofertas") || modalTypes[0];
    } else if (fullProduct.category === "Lançamentos" || fullProduct.subcategory === "lancamentos") {
      modalType = modalTypes.find(m => m.id === "lancamentos") || modalTypes[0];
    } else if (fullProduct.category === "Em Alta" || fullProduct.subcategory === "em-alta") {
      modalType = modalTypes.find(m => m.id === "em-alta") || modalTypes[0];
    } else if (fullProduct.category === "Outros Produtos" || fullProduct.subcategory === "outros") {
      modalType = modalTypes.find(m => m.id === "outros") || modalTypes[0];
    } else {
      // For subcategory products, find by subcategory name
      const subcategoryName = fullProduct.subcategory || "";
      modalType = modalTypes.find(m => m.subcategory === subcategoryName) || modalTypes[0];
    }
    
    setActiveModalType(modalType.id)
    setCurrentProduct(fullProduct)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    // Find the correct modal type based on the product's category and subcategory
    let modalType;
    if (product.category === "Recomendações (Homepage)" || product.subcategory === "recomendacoes") {
      modalType = modalTypes.find(m => m.id === "recomendacoes") || modalTypes[0];
    } else if (product.category === "Ofertas (Homepage)" || product.subcategory === "ofertas") {
      modalType = modalTypes.find(m => m.id === "ofertas") || modalTypes[0];
    } else if (product.category === "Lançamentos" || product.subcategory === "lancamentos") {
      modalType = modalTypes.find(m => m.id === "lancamentos") || modalTypes[0];
    } else if (product.category === "Em Alta" || product.subcategory === "em-alta") {
      modalType = modalTypes.find(m => m.id === "em-alta") || modalTypes[0];
    } else if (product.category === "Outros Produtos" || product.subcategory === "outros") {
      modalType = modalTypes.find(m => m.id === "outros") || modalTypes[0];
    } else {
      // For subcategory products, find by subcategory name
      const subcategoryName = product.subcategory || "";
      modalType = modalTypes.find(m => m.subcategory === subcategoryName) || modalTypes[0];
    }
    
    setActiveModalType(modalType.id)
    setCurrentProduct(product)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (productData: any) => {
    const modalType = modalTypes.find(m => m.id === activeModalType) || modalTypes[0]
    
    if (isEditing && currentProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === currentProduct.id ? { 
          ...p, 
          ...productData,
          // Preserve category and subcategory from the existing product for regular subcategory products
          ...(modalType.type === "subcategory" && {
            category: p.category || modalType.title,
            subcategory: p.subcategory || modalType.subcategory
          })
        } : p
      )
      saveProducts(updatedProducts)
    } else {
      // Add new product or update existing product with same ID
      const productId = productData.id || `PROD${Math.floor(1000000 + Math.random() * 9000000)}`
      
      // Check if a product with this ID already exists
      const existingProductIndex = products.findIndex(p => p.id === productId)
      
      let updatedProducts;
      if (existingProductIndex !== -1) {
        // Update existing product with same ID
        updatedProducts = products.map((p, index) => 
          index === existingProductIndex ? { 
            ...p, 
            ...productData,
            category: modalType.title,
            subcategory: modalType.subcategory
          } : p
        )
      } else {
        // Add new product
        const newProduct: Product = {
          id: productId,
          name: productData.name,
          price: productData.price,
          originalPrice: productData.originalPrice,
          color: productData.color,
          image: productData.image || "/placeholder-default.svg",
          category: modalType.title,
          subcategory: modalType.subcategory,
          label: productData.label,
          labelType: productData.labelType,
          stock: productData.stock,
          sizeStock: productData.sizeStock,
          availableUnits: productData.availableUnits,
          availableSizes: productData.availableSizes,
          sizeQuantities: productData.sizeQuantities,
          recommendationCategory: productData.recommendationCategory,
          recommendationSubcategory: productData.recommendationSubcategory,
          // Configuração de destaque baseada no tipo de modal
          destacarEmRecomendacoes: modalType.id === "recomendacoes",
          destacarEmOfertas: modalType.id === "ofertas",
          destacarEmAlta: modalType.id === "em-alta",
          destacarLancamentos: modalType.id === "lancamentos",
          // Adicionando descrição
          description: productData.description,
          // Adicionando campos de informações do produto
          freeShippingText: productData.freeShippingText,
          freeShippingThreshold: productData.freeShippingThreshold,
          pickupText: productData.pickupText,
          pickupStatus: productData.pickupStatus,
          material: productData.material,
          weight: productData.weight,
          dimensions: productData.dimensions,
          origin: productData.origin,
          care: productData.care,
          warranty: productData.warranty
        }
        updatedProducts = [...products, newProduct]
      }
      saveProducts(updatedProducts)
    }
    
    setIsModalOpen(false)
    toast({
      title: "Produto salvo",
      description: "O produto foi salvo com sucesso."
    })
  }

  const handleDeleteProduct = (product: Product) => {
    setItemToDelete(product)
    setShowDeletionModal(true)
  }

  const confirmDelete = () => {
    if (itemToDelete && deletionReason.trim()) {
      // Create deletion report
      const report: DeletionReport = {
        id: itemToDelete.id,
        name: itemToDelete.name,
        category: itemToDelete.category,
        subcategory: itemToDelete.subcategory || "",
        reason: deletionReason,
        timestamp: new Date().toISOString()
      }
      
      // Add to deletion reports
      const updatedReports = [...deletionReports, report]
      saveDeletionReports(updatedReports)
      
      // Remove product
      const updatedProducts = products.filter(p => p.id !== itemToDelete.id)
      saveProducts(updatedProducts)
      
      // Reset state
      setShowDeletionModal(false)
      setItemToDelete(null)
      setDeletionReason("")
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído e adicionado ao relatório de exclusão."
      })
    }
  }

  // Bulk selection functions
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    )
  }

  const selectAllProducts = () => {
    setSelectedProducts(products.map(p => p.id))
  }

  const deselectAllProducts = () => {
    setSelectedProducts([])
  }

  const handleBulkDelete = () => {
    if (selectedProducts.length > 0 && bulkDeletionReason.trim()) {
      // Create deletion reports for all selected products
      const newReports: DeletionReport[] = selectedProducts
        .map(id => {
          const product = products.find(p => p.id === id)
          if (product) {
            return {
              id: product.id,
              name: product.name,
              category: product.category,
              subcategory: product.subcategory || "",
              reason: bulkDeletionReason,
              timestamp: new Date().toISOString()
            }
          }
          return null
        })
        .filter((report): report is DeletionReport => report !== null)

      // Add to deletion reports
      const updatedReports = [...deletionReports, ...newReports]
      saveDeletionReports(updatedReports)
      
      // Remove selected products
      const updatedProducts = products.filter(p => !selectedProducts.includes(p.id))
      saveProducts(updatedProducts)
      
      // Reset selection and reason
      setSelectedProducts([])
      setBulkDeletionReason("")
      setIsSelecting(false)
      
      toast({
        title: "Produtos excluídos",
        description: `${selectedProducts.length} produtos foram excluídos e adicionados ao relatório de exclusão.`
      })
    }
  }

  const downloadDeletionReport = () => {
    if (deletionReports.length === 0) {
      toast({
        title: "Nenhum relatório",
        description: "Não há relatórios de exclusão para baixar.",
        variant: "destructive"
      })
      return
    }
    
    const reportContent = deletionReports.map(report => 
      `ID: ${report.id}\n` +
      `Nome: ${report.name}\n` +
      `Categoria: ${report.category}\n` +
      `Subcategoria: ${report.subcategory}\n` +
      `Motivo: ${report.reason}\n` +
      `Data: ${new Date(report.timestamp).toLocaleString('pt-BR')}\n` +
      `---\n`
    ).join('\n')
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-exclusao-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Relatório baixado",
      description: "O relatório de exclusão foi baixado com sucesso."
    })
  }

  // Group modal types by category
  const subcategoryModals = modalTypes.filter(m => m.type === "subcategory")
  const homepageModals = modalTypes.filter(m => m.type === "homepage")
  const specialModals = modalTypes.filter(m => m.type === "special")
  const otherModals = modalTypes.filter(m => m.type === "other")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Modais de Produto</h1>
              <p className="text-gray-600 mt-2">Organização por origem e função dos modais e cards</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={downloadDeletionReport}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Relatório
              </Button>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações de Envio</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Texto do Frete Grátis</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.freeShippingText}
                        onChange={(e) => handleProductInfoChange('freeShippingText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Valor Mínimo para Frete Grátis</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.freeShippingThreshold}
                        onChange={(e) => handleProductInfoChange('freeShippingThreshold', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Texto de Retirada na Loja</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.pickupText}
                        onChange={(e) => handleProductInfoChange('pickupText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status da Retirada</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.pickupStatus}
                        onChange={(e) => handleProductInfoChange('pickupStatus', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações Técnicas</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Material</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.material}
                        onChange={(e) => handleProductInfoChange('material', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Peso</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.weight}
                        onChange={(e) => handleProductInfoChange('weight', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Dimensões</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.dimensions}
                        onChange={(e) => handleProductInfoChange('dimensions', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Origem</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.origin}
                        onChange={(e) => handleProductInfoChange('origin', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Cuidados</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.care}
                        onChange={(e) => handleProductInfoChange('care', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Garantia</label>
                      <input 
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" 
                        type="text" 
                        value={productInfo.warranty}
                        onChange={(e) => handleProductInfoChange('warranty', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={saveProductInfo}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Salvar Informações
                </Button>
              </div>
            </div>
          </div>

          {/* Subcategory Modals */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shirt className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Modais de Subcategorias</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Modais exclusivos para categorias: Camisetas, Moletons, Jaquetas, Calças, Shorts/Bermuda.
              <br />
              Cards com função de destaque: "Recomendações", "Ofertas", "Em alta" ou "Lançamento".
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subcategoryModals.map((modalType) => (
                <div 
                  key={modalType.id}
                  className="bg-gradient-to-br border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleAddProduct(modalType)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${modalType.color} rounded-lg flex items-center justify-center text-white`}>
                      {modalType.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{modalType.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{modalType.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="sm"
                      className={`bg-gradient-to-r ${modalType.color} hover:opacity-90 text-white`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Produto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homepage Modals */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Modais da Homepage</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Modais exclusivos para as seções da homepage: "Recomendações" e "Ofertas".
              <br />
              Cards sem função de destaque, pois o contexto já define a categoria.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homepageModals.map((modalType) => (
                <div 
                  key={modalType.id}
                  className="bg-gradient-to-br border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleAddProduct(modalType)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${modalType.color} rounded-lg flex items-center justify-center text-white`}>
                      {modalType.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{modalType.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{modalType.description}</p>
                    </div>
                  </div>
                  {/* Ocultar botão de adicionar produto para ofertas e recomendações */}
                  {modalType.id !== "ofertas" && modalType.id !== "recomendacoes" && (
                    <div className="mt-4">
                      <Button 
                        size="sm"
                        className={`bg-gradient-to-r ${modalType.color} hover:opacity-90 text-white`}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Produto
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Pages Modals */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Modais de Páginas Especiais</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Modais para páginas "Lançamentos" e "Em Alta".
              <br />
              Cards com função de destaque: "Em alta" ou "Lançamento" para vincular corretamente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialModals.map((modalType) => (
                <div 
                  key={modalType.id}
                  className="bg-gradient-to-br border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleAddProduct(modalType)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${modalType.color} rounded-lg flex items-center justify-center text-white`}>
                      {modalType.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{modalType.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{modalType.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="sm"
                      className={`bg-gradient-to-r ${modalType.color} hover:opacity-90 text-white`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Produto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Modals */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Outros Modais</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Modais para outros tipos de produtos.
              <br />
              Sem função de destaque, apenas design padronizado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherModals.map((modalType) => (
                <div 
                  key={modalType.id}
                  className="bg-gradient-to-br border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleAddProduct(modalType)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${modalType.color} rounded-lg flex items-center justify-center text-white`}>
                      {modalType.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{modalType.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{modalType.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="sm"
                      className={`bg-gradient-to-r ${modalType.color} hover:opacity-90 text-white`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Produto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">{products.length}</div>
              <div className="text-blue-600">Produtos Cadastrados</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-800">{modalTypes.length}</div>
              <div className="text-green-600">Tipos de Modal</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <div className="text-2xl font-bold text-purple-800">{deletionReports.length}</div>
              <div className="text-purple-600">Itens Excluídos</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">
                {products.filter(p => p.label).length}
              </div>
              <div className="text-orange-600">Produtos com Label</div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Todos os Produtos</h2>
              <div className="flex items-center gap-3">
                {isSelecting ? (
                  <>
                    <span className="text-sm text-gray-600">
                      {selectedProducts.length} selecionado(s)
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={deselectAllProducts}
                      className="border-slate-300 text-slate-700"
                    >
                      Limpar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => selectedProducts.length > 0 && setIsSelecting(false)}
                      disabled={selectedProducts.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Confirmar Seleção
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => setIsSelecting(true)}
                    variant="outline"
                    className="border-slate-300 text-slate-700"
                  >
                    Selecionar Produtos
                  </Button>
                )}
                <div className="text-sm text-gray-500">
                  {products.length} produtos cadastrados
                </div>
              </div>
            </div>
            
            {/* Bulk deletion panel */}
            {isSelecting && selectedProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-red-800">Excluir Produtos Selecionados</h3>
                  <span className="text-sm text-red-600">{selectedProducts.length} produtos selecionados</span>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Motivo da exclusão em massa *
                  </label>
                  <Textarea
                    value={bulkDeletionReason}
                    onChange={(e) => setBulkDeletionReason(e.target.value)}
                    placeholder="Descreva o motivo da exclusão em massa..."
                    className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSelecting(false)
                      setSelectedProducts([])
                      setBulkDeletionReason("")
                    }}
                    className="border-slate-300 text-slate-700"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleBulkDelete}
                    disabled={!bulkDeletionReason.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Selecionados
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div 
                    key={product.id} 
                    className={`bg-white border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative ${
                      isSelecting ? 'border-2 border-dashed border-slate-300 cursor-pointer' : 'border-slate-200'
                    } ${selectedProducts.includes(product.id) ? 'border-2 border-blue-500 bg-blue-50' : ''}`}
                    onClick={isSelecting ? () => toggleProductSelection(product.id) : undefined}
                  >
                    {isSelecting && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedProducts.includes(product.id) 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'bg-white border-slate-300'
                        }`}>
                          {selectedProducts.includes(product.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category} / {product.subcategory}</p>
                          {product.label && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {product.label}
                            </span>
                          )}
                          {/* Mostrar destaque do produto */}
                          {(product.destacarEmRecomendacoes || product.destacarEmOfertas || product.destacarEmAlta || product.destacarLancamentos) && (
                            <div className="mt-1">
                              {product.destacarEmRecomendacoes && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full mr-1">
                                  Recomendações
                                </span>
                              )}
                              {product.destacarEmOfertas && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full mr-1">
                                  Ofertas
                                </span>
                              )}
                              {product.destacarEmAlta && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full mr-1">
                                  Em Alta
                                </span>
                              )}
                              {product.destacarLancamentos && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  Lançamento
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {!isSelecting && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0 border-slate-300"
                              onClick={() => handleViewProduct(product)}
                            >
                              <Eye className="h-4 w-4 text-slate-600" />
                            </Button>
                            {isEditMode && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0 border-slate-300"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit3 className="h-4 w-4 text-slate-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteProduct(product)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-[200px] h-[240px] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center text-gray-400">
                                <div className="text-2xl mb-1">🖼️</div>
                                <div className="text-xs font-medium">SEM IMAGEM</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Cor:</span> {product.color}
                        </div>
                        {product.availableSizes && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Tamanhos:</span> {product.availableSizes.join(", ")}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
                  <p className="text-gray-500 mb-6">Adicione produtos para visualizar os modais de edição</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deletion Reports */}
        {deletionReports.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatórios de Exclusão</h2>
            <div className="space-y-4">
              {deletionReports.map((report, index) => (
                <div key={index} className="border border-red-200 rounded-xl p-4 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600">{report.category} / {report.subcategory}</p>
                      <p className="text-sm text-gray-700 mt-2"><span className="font-medium">Motivo:</span> {report.reason}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Excluído em: {new Date(report.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">ID: {report.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {activeModalType && (
        <AdminProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={currentProduct}
          onSave={handleSaveProduct}
          title={modalTypes.find(m => m.id === activeModalType)?.title || "Produto"}
          subcategory={modalTypes.find(m => m.id === activeModalType)?.subcategory || "produto"}
          mode={isEditing ? "edit" : "create"}
        />
      )}

      {/* Deletion Modal */}
      {showDeletionModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirmar Exclusão</h3>
              <button 
                onClick={() => setShowDeletionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Tem certeza que deseja excluir o produto <span className="font-bold">"{itemToDelete.name}"</span>?
              </p>
              <p className="text-sm text-gray-500">
                Esta ação adicionará um relatório de exclusão e não poderá ser desfeita.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Motivo da exclusão *
              </label>
              <Textarea
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                placeholder="Descreva o motivo da exclusão..."
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeletionModal(false)}
                className="border-slate-300 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmDelete}
                disabled={!deletionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}