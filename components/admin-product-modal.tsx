"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductTemplate } from "@/components/product-template"
import { X, Edit, Package, Star, Home, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { generateID } from "@/lib/unified-id-system"

interface AdminProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  color: string
  image: string
  images?: string[] // Additional images for the product
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
  sizeQuantities?: Record<string, number> // Add size quantities
  recommendationCategory?: string
  recommendationSubcategory?: string
  // Adicionando campos para destacar em diferentes seções
  destacarEmRecomendacoes?: boolean
  destacarEmOfertas?: boolean
  destacarEmAlta?: boolean
  destacarLancamentos?: boolean
  // Adicionando campo de descrição opcional
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

interface AdminProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: AdminProduct | null
  onSave: (product: AdminProduct) => void
  title: string
  subcategory: string
  mode: 'create' | 'edit'
}

export function AdminProductModal({ 
  isOpen, 
  onClose, 
  product, 
  onSave, 
  title, 
  subcategory,
  mode 
}: AdminProductModalProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // State to track if we're creating a new product
  const [isNewProduct, setIsNewProduct] = useState(true)

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Available sizes for recommendations
  const availableSizes = ["P", "M", "G", "GG", "XG", "XXG"]
  
  // Available categories for recommendations
  const recommendationCategories = [
    "Camisetas",
    "Calças",
    "Jaquetas",
    "Moletons",
    "Shorts/Bermudas"
  ]
  
  // Available subcategories based on selected category
  const getSubcategories = (category: string) => {
    switch (category) {
      case "Camisetas":
        return ["Regata", "Manga Curta", "Manga Longa", "Polo", "Tank Top", "Básica"]
      case "Calças":
        return ["Jeans", "Moletom", "Social"]
      case "Jaquetas":
        return ["Casual", "Esportiva", "Social"]
      case "Moletons":
        return ["Com Capuz", "Sem Capuz", "Ziper"]
      case "Shorts/Bermudas":
        return ["Casual", "Esportivo", "Praia"]
      default:
        return []
    }
  }

  const [formData, setFormData] = useState<AdminProduct>({
    id: "",
    name: "",
    price: 0,
    originalPrice: 0,
    color: "",
    image: "/placeholder-default.svg",
    images: [],
    category: "Camisetas",
    subcategory: subcategory,
    label: "",
    labelType: undefined,
    stock: 0,
    sizeStock: {},
    // Recommendation fields
    availableUnits: 0,
    availableSizes: [],
    sizeQuantities: {}, // Initialize empty
    recommendationCategory: "",
    recommendationSubcategory: "",
    // Highlighting fields
    destacarEmRecomendacoes: false,
    destacarEmOfertas: false,
    destacarEmAlta: false,
    destacarLancamentos: false,
    // Description field
    description: "",
    // Product info fields with default values
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
  })

  // Initialize form data with size quantities for recommendations
  useEffect(() => {
    console.log("AdminProductModal useEffect called with product:", product);
    console.log("AdminProductModal title:", title);
    console.log("AdminProductModal subcategory:", subcategory);
    console.log("AdminProductModal mode:", mode);
    console.log("AdminProductModal isNewProduct:", isNewProduct);
    
    // Load default product info config from localStorage
    let defaultProductInfo = {
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
    };
    
    try {
      const savedInfo = localStorage.getItem('gang-boyz-product-info');
      if (savedInfo) {
        defaultProductInfo = { ...defaultProductInfo, ...JSON.parse(savedInfo) };
      }
    } catch (error) {
      console.error("Failed to parse product info config:", error);
    }
    
    // Always reset form when creating a new product or when modal opens for creation
    if (mode === 'create' && isNewProduct) {
      // Reset form for new product and generate ID automatically
      const newId = generateID('product')
      const formDataToSet = {
        id: newId,
        name: "",
        price: 0,
        originalPrice: 0,
        color: "",
        image: "/placeholder-default.svg",
        images: [],
        category: "Camisetas",
        subcategory: subcategory || "",
        label: "",
        labelType: undefined,
        stock: 0,
        sizeStock: {},
        // Recommendation fields
        availableUnits: 0,
        availableSizes: [],
        sizeQuantities: {}, // Initialize empty
        recommendationCategory: "",
        recommendationSubcategory: "",
        // Highlighting fields
        destacarEmRecomendacoes: false,
        destacarEmOfertas: false,
        destacarEmAlta: false,
        destacarLancamentos: false,
        // Product info fields with default values
        freeShippingText: defaultProductInfo.freeShippingText,
        freeShippingThreshold: defaultProductInfo.freeShippingThreshold,
        pickupText: defaultProductInfo.pickupText,
        pickupStatus: defaultProductInfo.pickupStatus,
        material: defaultProductInfo.material,
        weight: defaultProductInfo.weight,
        dimensions: defaultProductInfo.dimensions,
        origin: defaultProductInfo.origin,
        care: defaultProductInfo.care,
        warranty: defaultProductInfo.warranty,
        // Description field
        description: ""
      };
      
      console.log("Setting empty form data for new product:", formDataToSet);
      setFormData(formDataToSet);
      setCurrentStep(1); // Reset to first step when creating new product
      setIsNewProduct(false); // Mark that we've initialized for this new product
    } else if (product) {
      // Calculate size quantities from sizeStock if available
      const sizeQuantities: Record<string, number> = {}
      if (product.sizeStock) {
        Object.entries(product.sizeStock).forEach(([size, qty]) => {
          sizeQuantities[size] = qty
        })
      }
      
      const formDataToSet = {
        id: product.id || "",
        name: product.name || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        color: product.color || "",
        image: product.image || "/placeholder-default.svg",
        images: product.images || [],
        category: product.category || "",
        subcategory: product.subcategory || "",
        label: product.label || "",
        labelType: product.labelType,
        stock: product.stock || 0,
        sizeStock: product.sizeStock || {},
        // Recommendation fields
        availableUnits: product.availableUnits || 0,
        availableSizes: product.availableSizes || [],
        sizeQuantities: sizeQuantities, // Initialize with calculated values
        recommendationCategory: product.recommendationCategory || "",
        recommendationSubcategory: product.recommendationSubcategory || "",
        // Highlighting fields
        destacarEmRecomendacoes: product.destacarEmRecomendacoes || false,
        destacarEmOfertas: product.destacarEmOfertas || false,
        destacarEmAlta: product.destacarEmAlta || false,
        destacarLancamentos: product.destacarLancamentos || false,
        // Product info fields - use product values or defaults
        freeShippingText: product.freeShippingText || defaultProductInfo.freeShippingText,
        freeShippingThreshold: product.freeShippingThreshold || defaultProductInfo.freeShippingThreshold,
        pickupText: product.pickupText || defaultProductInfo.pickupText,
        pickupStatus: product.pickupStatus || defaultProductInfo.pickupStatus,
        material: product.material || defaultProductInfo.material,
        weight: product.weight || defaultProductInfo.weight,
        dimensions: product.dimensions || defaultProductInfo.dimensions,
        origin: product.origin || defaultProductInfo.origin,
        care: product.care || defaultProductInfo.care,
        warranty: product.warranty || defaultProductInfo.warranty,
        // Description field
        description: product.description || ""
      };
      
      console.log("Setting form data for existing product:", formDataToSet);
      setFormData(formDataToSet);
      setCurrentStep(1); // Reset to first step when editing
    }
  }, [product, subcategory, title, mode, isNewProduct, isOpen])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Handle number inputs
    if (type === 'number') {
      const numValue = value === '' ? 0 : Number(value)
      setFormData(prev => ({ ...prev, [name]: numValue }))
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle product info changes
  const handleProductInfoChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Handle multiple file uploads
      const fileArray = Array.from(files)
      
      if (index === undefined) {
        // Add new images (up to 2 additional images)
        const maxAdditionalImages = 2
        const currentAdditionalImages = formData.images?.length || 0
        const imagesToAdd = Math.min(fileArray.length, maxAdditionalImages - currentAdditionalImages)
        
        if (imagesToAdd <= 0) {
          alert('Você pode adicionar no máximo 2 imagens adicionais.')
          return
        }
        
        const newImages = [...(formData.images || [])]
        let processedCount = 0
        
        for (let i = 0; i < imagesToAdd; i++) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newImages.push(e.target?.result as string)
            processedCount++
            if (processedCount === imagesToAdd) {
              setFormData(prev => ({ ...prev, images: newImages }))
            }
          }
          reader.readAsDataURL(fileArray[i])
        }
      } else if (index === 0) {
        // Update main image
        const reader = new FileReader()
        reader.onload = (e) => {
          setFormData(prev => ({ ...prev, image: e.target?.result as string }))
        }
        reader.readAsDataURL(fileArray[0])
      } else {
        // Update additional image at specific index
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImages = [...(formData.images || [])]
          // Ensure the index is valid
          if (index - 1 < newImages.length) {
            newImages[index - 1] = e.target?.result as string
            setFormData(prev => ({ ...prev, images: newImages }))
          }
        }
        reader.readAsDataURL(fileArray[0])
      }
    }
  }

  // Handle size selection for recommendations
  const handleSizeSelection = (size: string) => {
    setFormData(prev => {
      const currentSizes = prev.availableSizes || []
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter(s => s !== size)
        : [...currentSizes, size]
      
      // If we're removing a size, also remove its quantity
      const newSizeQuantities = { ...prev.sizeQuantities }
      if (currentSizes.includes(size)) {
        delete newSizeQuantities[size]
      }
      
      return { 
        ...prev, 
        availableSizes: newSizes,
        sizeQuantities: newSizeQuantities
      }
    })
  }

  // Handle size quantity change for recommendations
  const handleSizeQuantityChange = (size: string, quantity: string) => {
    setFormData(prev => ({
      ...prev,
      sizeQuantities: {
        ...prev.sizeQuantities,
        [size]: quantity ? parseInt(quantity) : 0
      }
    }))
  }

  // Step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    // Reset form state when closing
    setCurrentStep(1);
    setIsNewProduct(true);
    onClose();
  };

  // Helper functions to determine context
  const isRecommendationOrOffer = title === "Recomendações" || title === "Ofertas"
  const isHomepageContext = title === "Recomendações (Homepage)" || title === "Ofertas (Homepage)"
  const isSpecialContext = title === "Lançamentos" || title === "Em Alta" || isHomepageContext
  const isNormalProduct = !isRecommendationOrOffer && !isSpecialContext

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Instead of saving immediately, show confirmation dialog
    setShowConfirmation(true)
  }

  const handleConfirmSave = () => {
    // Validation for recommendations and offers
    if (title === "Recomendações" || title === "Ofertas") {
      if (!formData.availableSizes || formData.availableSizes.length === 0) {
        alert("Por favor, selecione pelo menos um tamanho disponível.")
        setShowConfirmation(false)
        return
      }
      
      // Check if all selected sizes have quantities
      const missingQuantities = formData.availableSizes.filter(size => 
        !formData.sizeQuantities?.[size] && formData.sizeQuantities?.[size] !== 0
      )
      
      if (missingQuantities.length > 0) {
        alert(`Por favor, informe a quantidade para os tamanhos: ${missingQuantities.join(', ')}`)
        setShowConfirmation(false)
        return
      }
      
      if (!formData.recommendationCategory) {
        alert("Por favor, selecione a categoria do produto.")
        setShowConfirmation(false)
        return
      }
      
      if (!formData.recommendationSubcategory) {
        alert("Por favor, selecione a subcategoria do produto.")
        setShowConfirmation(false)
        return
      }
      
      if (!formData.color) {
        alert("Por favor, selecione a cor do produto.")
        setShowConfirmation(false)
        return
      }
    }
    
    // Validation for subcategories (camisetas, moletons, etc.)
    if (title !== "Recomendações" && title !== "Ofertas" && title !== "Recomendações (Homepage)" && title !== "Ofertas (Homepage)") {
      // Check if any sizes are selected, and if so, validate quantities
      if (formData.availableSizes && formData.availableSizes.length > 0) {
        const missingQuantities = formData.availableSizes.filter(size => 
          !formData.sizeQuantities?.[size] && formData.sizeQuantities?.[size] !== 0
        )
        
        if (missingQuantities.length > 0) {
          alert(`Por favor, informe a quantidade para os tamanhos: ${missingQuantities.join(', ')}`)
          setShowConfirmation(false)
          return
        }
      }
      
      if (!formData.color) {
        alert("Por favor, selecione a cor do produto.")
        setShowConfirmation(false)
        return
      }
    }
    
    // Validation for all products - at least one color is required
    if (!formData.color || formData.color.split(',').filter(c => c).length === 0) {
      alert("Por favor, selecione pelo menos uma cor para o produto.");
      setShowConfirmation(false)
      return;
    }
    
    // Calculate total stock from size quantities for recommendations, offers and subcategories
    let totalStock = formData.stock || 0
    let sizeStock = formData.sizeStock || {}
    
    if ((title === "Recomendações" || title === "Ofertas" || 
         (title !== "Recomendações (Homepage)" && title !== "Ofertas (Homepage)")) && 
        formData.sizeQuantities) {
      totalStock = Object.values(formData.sizeQuantities).reduce((sum, qty) => sum + (qty || 0), 0)
      sizeStock = { ...formData.sizeQuantities }
    }
    
    // Ensure we have a valid stock value
    totalStock = Math.max(0, totalStock)
    
    const productData = {
      ...formData,
      stock: totalStock,
      sizeStock: sizeStock,
      // Include size quantities for recommendations, offers and subcategories
      ...((title === "Recomendações" || title === "Ofertas" || 
           (title !== "Recomendações (Homepage)" && title !== "Ofertas (Homepage)")) && {
        sizeQuantities: formData.sizeQuantities
      }),
      // Include highlighting fields - preserve disabled state values
      destacarEmRecomendacoes: title === "Recomendações" ? true : (formData.destacarEmRecomendacoes || false),
      destacarEmOfertas: title === "Ofertas" ? true : (formData.destacarEmOfertas || false),
      destacarEmAlta: formData.destacarEmAlta || false,
      destacarLancamentos: formData.destacarLancamentos || false,
      // Include product info fields
      freeShippingText: formData.freeShippingText,
      freeShippingThreshold: formData.freeShippingThreshold,
      pickupText: formData.pickupText,
      pickupStatus: formData.pickupStatus,
      material: formData.material,
      weight: formData.weight,
      dimensions: formData.dimensions,
      origin: formData.origin,
      care: formData.care,
      warranty: formData.warranty,
      // Ensure category and subcategory are properly set for all product types
      category: formData.category || "Camisetas",
      subcategory: formData.subcategory || subcategory
    }
    
    // Save the product
    onSave(productData)
    
    // Reset form for next product if we're in create mode
    if (mode === 'create') {
      setIsNewProduct(true); // This will trigger the useEffect to reset the form
    }
    
    // Dispatch events to notify other components that products have been updated
    window.dispatchEvent(new Event('forceProductsReload'))
    window.dispatchEvent(new Event('testProductCreated'))
    
    // Close confirmation dialog
    setShowConfirmation(false)
    
    // Close modal
    handleClose()
  }

  if (!isOpen) return null

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID do Produto */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            ID do Produto {mode === 'create' && '*'}
          </label>
          {mode === 'create' ? (
            <div className="relative">
              <Input
                value={formData.id}
                readOnly
                className="bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-400 rounded-xl h-11"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-500">Gerado automaticamente</span>
              </div>
            </div>
          ) : (
            <Input
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              placeholder={`Ex: ${subcategory.charAt(0).toUpperCase()}${subcategory.charAt(1).toUpperCase()}001`}
              className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
            />
          )}
        </div>

        {/* Nome do Produto */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Nome do Produto *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={`Ex: ${title} Gang BoyZ Classic`}
            className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
          />
        </div>
        
        {/* Preço */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Preço Atual *
          </label>
          <Input
            name="price"
            type="number" 
            step="0.01"
            value={formData.price > 0 ? formData.price : ""}
            onChange={handleInputChange}
            placeholder="Ex: 39.90"
            className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
          />
        </div>
        
        {/* Preço Original */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Preço Original (opcional)
          </label>
          <Input
            name="originalPrice"
            type="number" 
            step="0.01"
            value={formData.originalPrice && formData.originalPrice > 0 ? formData.originalPrice : ""}
            onChange={handleInputChange}
            placeholder="Ex: 59.90"
            className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
          />
        </div>
        
        {/* Cor */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-900 mb-2 block flex items-center justify-between">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              Cores
            </span>
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">Obrigatório</span>
          </label>
          <div className="space-y-4">
            {/* Visual color selection */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {[
                { name: 'Preto', value: 'Preto', color: '#000000' },
                { name: 'Branco', value: 'Branco', color: '#FFFFFF' },
                { name: 'Azul', value: 'Azul', color: '#0000FF' },
                { name: 'Rosa', value: 'Rosa', color: '#FFC0CB' },
                { name: 'Bege', value: 'Bege', color: '#F5F5DC' },
                { name: 'Cinza', value: 'Cinza', color: '#808080' },
                { name: 'Vermelho', value: 'Vermelho', color: '#FF0000' },
                { name: 'Verde', value: 'Verde', color: '#008000' },
                { name: 'Amarelo', value: 'Amarelo', color: '#FFFF00' },
                { name: 'Roxo', value: 'Roxo', color: '#800080' },
                { name: 'Laranja', value: 'Laranja', color: '#FFA500' },
                { name: 'Marrom', value: 'Marrom', color: '#8B4513' }
              ].map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => {
                    const currentColors = formData.color ? formData.color.split(',').filter(c => c) : [];
                    let newColors;
                    
                    if (currentColors.includes(colorOption.value)) {
                      // Remove color if already selected
                      newColors = currentColors.filter(c => c !== colorOption.value);
                    } else {
                      // Add color if not selected
                      newColors = [...currentColors, colorOption.value];
                    }
                    
                    setFormData(prev => ({ ...prev, color: newColors.join(',') }));
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                    formData.color && formData.color.split(',').filter(c => c).includes(colorOption.value)
                      ? 'ring-2 ring-gray-500 border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: colorOption.color }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-700 truncate w-full text-center">{colorOption.name}</span>
                </button>
              ))}
              
              {/* Outro option */}
              <button
                type="button"
                onClick={() => {
                  const currentColors = formData.color ? formData.color.split(',').filter(c => c) : [];
                  let newColors;
                  
                  if (currentColors.includes('Outro')) {
                    // Remove "Outro" if already selected
                    newColors = currentColors.filter(c => c !== 'Outro');
                  } else {
                    // Add "Outro" if not selected
                    newColors = [...currentColors, 'Outro'];
                  }
                  
                  setFormData(prev => ({ ...prev, color: newColors.join(',') }));
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                  formData.color && formData.color.split(',').filter(c => c).includes('Outro')
                    ? 'ring-2 ring-gray-500 border-gray-500 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-gray-300 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+</span>
                </div>
                <span className="text-xs mt-1 text-gray-700 truncate w-full text-center">Outro</span>
              </button>
            </div>
            
            {/* Display selected colors */}
            {formData.color && formData.color.split(',').filter(c => c).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.color.split(',').filter(c => c).map((color, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {color}
                    <button
                      type="button"
                      onClick={() => {
                        const colors = formData.color.split(',').filter(c => c);
                        const newColors = colors.filter(c => c !== color);
                        setFormData(prev => ({ ...prev, color: newColors.join(',') }));
                      }}
                      className="ml-2 inline-flex text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Custom color input */}
            {formData.color && formData.color.includes('Outro') && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cores Personalizadas</label>
                <Input
                  value={formData.color.split(',').filter(c => c && c !== 'Outro').join(',')}
                  onChange={(e) => {
                    const otherColors = e.target.value;
                    const currentColors = formData.color.split(',').filter(c => c && c !== 'Outro');
                    const newColors = [...currentColors, 'Outro', ...otherColors.split(',')].filter(c => c);
                    setFormData(prev => ({ ...prev, color: newColors.join(',') }));
                  }}
                  placeholder="Digite as cores separadas por vírgula"
                  className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                />
                <p className="text-xs text-gray-500 mt-1">Ex: Turquesa, Coral, Salmão</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upload de Imagem */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Imagens do Produto (até 3)
          </label>
          <div className="space-y-4">
            {/* Main Image */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Imagem Principal</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 0)}
                className="bg-white border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
              {formData.image && (
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Imagens Adicionais (até 2)</label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e)}
                className="bg-white border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images && formData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images || []]
                        newImages.splice(idx, 1)
                        setFormData(prev => ({ ...prev, images: newImages }))
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {formData.images && formData.images.length >= 2 && (
                <p className="text-xs text-gray-500">Limite máximo de 2 imagens adicionais atingido.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Sizes and Stock
  const renderStep2 = () => (
    <div className="space-y-6">
      {(isRecommendationOrOffer || isNormalProduct) && (
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-900 mb-2 block">
            Tamanhos Disponíveis {isRecommendationOrOffer && <span className="text-red-500">*</span>}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {availableSizes.map(size => (
              <div key={size} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleSizeSelection(size)}
                  className={`py-2 px-1 rounded border transition-colors ${
                    formData.availableSizes?.includes(size)
                      ? "bg-gray-500 text-white border-gray-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-medium">{size}</span>
                </button>
                {formData.availableSizes?.includes(size) && (
                  <input
                    type="number"
                    min="0"
                    value={formData.sizeQuantities?.[size] || ""}
                    onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                    className="mt-1 flex w-full border px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded"
                    placeholder="Qtd"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional fields for recommendations and offers */}
      {isRecommendationOrOffer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              Categoria do Produto <span className="text-red-500">*</span>
            </label>
            <select
              name="recommendationCategory"
              value={formData.recommendationCategory}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white"
            >
              <option value="">Selecione uma categoria</option>
              {recommendationCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              Subcategoria do Produto <span className="text-red-500">*</span>
            </label>
            <select
              name="recommendationSubcategory"
              value={formData.recommendationSubcategory}
              onChange={handleInputChange}
              disabled={!formData.recommendationCategory}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white"
            >
              <option value="">Selecione uma subcategoria</option>
              {formData.recommendationCategory && getSubcategories(formData.recommendationCategory).map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );

  // Step 3: Labels and Highlights
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Etiqueta */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Tipo de Etiqueta <span className="text-gray-400 text-sm">(Opcional)</span>
          </label>
          <select
            name="labelType"
            value={formData.labelType || ""}
            onChange={handleInputChange}
            className="w-full bg-white border border-gray-300 text-gray-700 rounded-xl px-3 py-3 focus:border-blue-500 focus:outline-none h-11"
          >
            <option value="">Sem etiqueta</option>
            <option value="promocao">Promoção</option>
            <option value="esgotado">Esgotado</option>
            <option value="personalizada">Personalizada</option>
          </select>
        </div>

        {/* Texto da Etiqueta */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Texto da Etiqueta <span className="text-gray-400 text-sm">(Opcional)</span>
          </label>
          <Input
            name="label"
            value={formData.label || ""}
            onChange={handleInputChange}
            placeholder="Ex: -50%, Esgotado, Novo, etc."
            className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
            disabled={!formData.labelType}
          />
        </div>
      </div>
      
      {/* Seção de Destaque - Apenas para modais de subcategorias */}
      {isNormalProduct && (
        <div>
          <label className="text-sm font-medium text-gray-900 mb-2 block">
            Destacar Produto Em:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="destacarEmRecomendacoes"
                checked={title === "Recomendações" ? true : (formData.destacarEmRecomendacoes || false)}
                onChange={(e) => {
                  // Only allow changing if not in Recomendações section
                  if (title !== "Recomendações") {
                    setFormData(prev => ({ ...prev, destacarEmRecomendacoes: e.target.checked }));
                  }
                }}
                disabled={title === "Recomendações"}
                className={`rounded text-gray-600 focus:ring-gray-500 ${title === "Recomendações" ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              <span className="text-gray-700">Recomendações</span>
            </label>
            
            <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="destacarEmOfertas"
                checked={title === "Ofertas" ? true : (formData.destacarEmOfertas || false)}
                onChange={(e) => {
                  // Only allow changing if not in Ofertas section
                  if (title !== "Ofertas") {
                    setFormData(prev => ({ ...prev, destacarEmOfertas: e.target.checked }));
                  }
                }}
                disabled={title === "Ofertas"}
                className={`rounded text-gray-600 focus:ring-gray-500 ${title === "Ofertas" ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              <span className="text-gray-700">Ofertas</span>
            </label>
            
            <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="destacarEmAlta"
                checked={title === "Em Alta" ? true : (formData.destacarEmAlta || false)}
                onChange={(e) => {
                  // Only allow changing if not in Em Alta section
                  if (title !== "Em Alta") {
                    setFormData(prev => ({ ...prev, destacarEmAlta: e.target.checked }));
                  }
                }}
                disabled={title === "Em Alta"}
                className={`rounded text-gray-600 focus:ring-gray-500 ${title === "Em Alta" ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              <span className="text-gray-700">Em Alta</span>
            </label>
            
            <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="destacarLancamentos"
                checked={title === "Lançamentos" ? true : (formData.destacarLancamentos || false)}
                onChange={(e) => {
                  // Only allow changing if not in Lançamentos section
                  if (title !== "Lançamentos") {
                    setFormData(prev => ({ ...prev, destacarLancamentos: e.target.checked }));
                  }
                }}
                disabled={title === "Lançamentos"}
                className={`rounded text-gray-600 focus:ring-gray-500 ${title === "Lançamentos" ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              <span className="text-gray-700">Lançamentos</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Selecione onde deseja que este produto apareça destacado. O produto será espelhado nessas seções.
          </p>
        </div>
      )}
      
      {/* Seção de Destaque Fixo - Para modais especiais */}
      {isSpecialContext && (
        <div>
          {title === "Lançamentos" || title === "Em Alta" ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">
                    Produto Automaticamente Destacado
                  </span>
                  <p className="text-sm text-gray-600">
                    Este produto será automaticamente vinculado à página de <strong>{title}</strong>.
                  </p>
                </div>
              </div>
              <input
                type="hidden"
                name={title === "Lançamentos" ? "destacarLancamentos" : "destacarEmAlta"}
                value="true"
              />
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">
                    Produto da Homepage
                  </span>
                  <p className="text-sm text-gray-600">
                    Este produto será exibido na seção de <strong>{title.replace(" (Homepage)", "")}</strong> da homepage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Step 4: Description
  const renderStep4 = () => (
    <div>
      <label className="text-gray-700 font-semibold mb-2 block">
        Descrição do Produto <span className="text-gray-400 text-sm">(Opcional)</span>
      </label>
      <textarea
        name="description"
        value={formData.description || ""}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Adicione uma descrição detalhada do produto..."
        className="w-full bg-white border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl p-3 min-h-[100px]"
      />
    </div>
  );

  // Step 5: Custom Information
  const renderStep5 = () => (
    <div className="space-y-6">
      {/* Informações do Produto */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-gray-800 font-bold text-lg">Informações Personalizadas do Produto</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Personalize as informações específicas deste produto. Se deixado em branco, serão usados os valores padrão.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações de Envio */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-700">Informações de Envio</h4>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Texto do Frete Grátis
              </label>
              <Input
                value={formData.freeShippingText}
                onChange={(e) => handleProductInfoChange('freeShippingText', e.target.value)}
                placeholder="Ex: Frete Grátis"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Valor Mínimo para Frete Grátis
              </label>
              <Input
                value={formData.freeShippingThreshold}
                onChange={(e) => handleProductInfoChange('freeShippingThreshold', e.target.value)}
                placeholder="Ex: Acima de R$ 200"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Texto de Retirada na Loja
              </label>
              <Input
                value={formData.pickupText}
                onChange={(e) => handleProductInfoChange('pickupText', e.target.value)}
                placeholder="Ex: Retire na Loja"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Status da Retirada
              </label>
              <Input
                value={formData.pickupStatus}
                onChange={(e) => handleProductInfoChange('pickupStatus', e.target.value)}
                placeholder="Ex: Disponível"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-xl h-11"
              />
            </div>
          </div>
          
          {/* Informações Técnicas */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-700">Informações Técnicas</h4>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Material
              </label>
              <Input
                value={formData.material}
                onChange={(e) => handleProductInfoChange('material', e.target.value)}
                placeholder="Ex: 100% Algodão"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Peso
              </label>
              <Input
                value={formData.weight}
                onChange={(e) => handleProductInfoChange('weight', e.target.value)}
                placeholder="Ex: 300g"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Dimensões
              </label>
              <Input
                value={formData.dimensions}
                onChange={(e) => handleProductInfoChange('dimensions', e.target.value)}
                placeholder="Ex: 70cm x 50cm"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Origem
              </label>
              <Input
                value={formData.origin}
                onChange={(e) => handleProductInfoChange('origin', e.target.value)}
                placeholder="Ex: Brasil"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Cuidados
              </label>
              <Input
                value={formData.care}
                onChange={(e) => handleProductInfoChange('care', e.target.value)}
                placeholder="Ex: Lavar à mão, não alvejar"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
            
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Garantia
              </label>
              <Input
                value={formData.warranty}
                onChange={(e) => handleProductInfoChange('warranty', e.target.value)}
                placeholder="Ex: 90 dias contra defeitos"
                className="bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> Se você deixar algum campo em branco, o sistema usará os valores padrão definidos no editor de informações do produto.
          </p>
        </div>
      </div>
      
      {/* Informação da Categoria */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold">
              Categorização Automática
            </span>
            <p className="text-sm text-gray-600">
              Produto será automaticamente categorizado como: <strong>{title}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
          {/* Header do Modal */}
          <div className="relative overflow-hidden bg-gray-800 rounded-2xl p-6 mb-8 text-white">
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {mode === 'create' ? 'Adicionar' : 'Editar'} Produto - {title}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {mode === 'create' ? 'Crie um novo produto' : 'Edite as informações do produto'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Step Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Etapa {currentStep} de {totalSteps}</span>
                <span className="text-sm font-medium text-gray-700">
                  {currentStep === 1 && 'Informações Básicas'}
                  {currentStep === 2 && 'Tamanhos e Estoque'}
                  {currentStep === 3 && 'Etiquetas e Destaques'}
                  {currentStep === 4 && 'Descrição'}
                  {currentStep === 5 && 'Informações Personalizadas'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-800 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Edit className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-gray-800 font-bold text-lg">
                  {currentStep === 1 && 'Informações Básicas do Produto'}
                  {currentStep === 2 && 'Tamanhos e Estoque'}
                  {currentStep === 3 && 'Etiquetas e Destaques'}
                  {currentStep === 4 && 'Descrição do Produto'}
                  {currentStep === 5 && 'Informações Personalizadas'}
                </h3>
              </div>
              
              {/* Render current step content */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              
              {/* Show preview and product info in all steps for better visibility */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-gray-800 font-bold text-lg mb-4">Preview do Produto</h3>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <ProductTemplate
                    product={
                      currentStep === 5 
                        ? {
                            id: formData.id,
                            name: formData.name,
                            price: formData.price,
                            originalPrice: formData.originalPrice,
                            color: formData.color,
                            image: formData.image,
                            categories: [formData.category, formData.subcategory].filter(Boolean) as string[],
                            sizes: formData.availableSizes && formData.availableSizes.length > 0 
                              ? formData.availableSizes 
                              : [],
                            discountPercentage: formData.originalPrice && formData.originalPrice > formData.price 
                              ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
                              : undefined,
                            installments: "3x sem juros",
                            brand: "Gang BoyZ",
                            isNew: true,
                            isPromotion: !!(formData.originalPrice && formData.originalPrice > formData.price),
                            description: `${formData.name} - Cores: ${formData.color.split(',').filter(c => c).join(', ')}`,
                            status: "ativo" as const,
                            stock: formData.availableUnits || 10,
                            sizeStock: formData.sizeStock || {}
                          }
                        : {
                            id: formData.id,
                            name: formData.name || "Nome do Produto",
                            price: formData.price || 0,
                            originalPrice: formData.originalPrice || undefined,
                            color: formData.color || "",
                            image: formData.image || "/placeholder-default.svg",
                            categories: [formData.category, formData.subcategory].filter(Boolean) as string[],
                            sizes: formData.availableSizes && formData.availableSizes.length > 0 
                              ? formData.availableSizes 
                              : [],
                            discountPercentage: formData.originalPrice && formData.originalPrice > formData.price 
                              ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
                              : undefined,
                            installments: "3x sem juros",
                            brand: "Gang BoyZ",
                            isNew: true,
                            isPromotion: !!(formData.originalPrice && formData.originalPrice > formData.price),
                            description: `${formData.name || "Nome do Produto"} - Cores: ${formData.color ? formData.color.split(',').filter(c => c).join(', ') : ""}`,
                            status: "ativo" as const,
                            stock: formData.availableUnits || 10,
                            sizeStock: formData.sizeStock || {}
                          }
                    }
                    onAddToCart={() => {}}
                  />
                </div>
                
                {(mode === 'edit' || !isHomepageContext) && (
                  <div>
                    <h3 className="text-gray-800 font-bold text-lg mb-4">Informações do Produto</h3>
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600"><strong>Frete:</strong> {formData.freeShippingText || "Frete Grátis"} {formData.freeShippingThreshold ? `(${formData.freeShippingThreshold})` : ""}</p>
                        <p className="text-sm text-gray-600"><strong>Retirada:</strong> {formData.pickupText || "Retire na Loja"} - {formData.pickupStatus || "Disponível"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600"><strong>Material:</strong> {formData.material || "100% Algodão"}</p>
                        <p className="text-sm text-gray-600"><strong>Peso:</strong> {formData.weight || "300g"}</p>
                        <p className="text-sm text-gray-600"><strong>Dimensões:</strong> {formData.dimensions || "70cm x 50cm"}</p>
                        <p className="text-sm text-gray-600"><strong>Origem:</strong> {formData.origin || "Brasil"}</p>
                        <p className="text-sm text-gray-600"><strong>Cuidados:</strong> {formData.care || "Lavar à mão, não alvejar"}</p>
                        <p className="text-sm text-gray-600"><strong>Garantia:</strong> {formData.warranty || "90 dias contra defeitos"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-12 font-semibold"
                >
                  Cancelar
                </Button>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex items-center justify-center gap-2 flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-12 font-semibold"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                      className="flex items-center gap-2 flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl h-12 shadow-lg transition-all duration-300"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl h-12 shadow-lg transition-all duration-300"
                    >
                      {mode === 'create' ? 'Criar Produto' : 'Atualizar Produto'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirmar {mode === 'create' ? 'Criação' : 'Atualização'} de Produto
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja {mode === 'create' ? 'criar' : 'atualizar'} este produto? 
                Esta ação {mode === 'create' ? 'adicionará' : 'atualizará'} o produto no sistema.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-11 font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmSave}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl h-11 shadow-lg transition-all duration-300"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}