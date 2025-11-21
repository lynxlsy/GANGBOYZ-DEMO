"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { Edit3, Trash2, Save } from "lucide-react"
import { toast } from "sonner"
import { eventManager } from "@/lib/event-manager"
import { useProducts } from "@/lib/products-context-simple"
import { AdminProductModal } from "@/components/admin-product-modal"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from "@/lib/editable-content-sync"

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

export function HotSection({ isEditMode = false }: { isEditMode?: boolean }) {
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableTitle, setEditableTitle] = useState("PRODUTOS EM DESTAQUE")
  const [editableSubtitle, setEditableSubtitle] = useState("Os produtos mais vendidos e em alta")
  const [editingTitle, setEditingTitle] = useState("PRODUTOS EM DESTAQUE")
  const [editingSubtitle, setEditingSubtitle] = useState("Os produtos mais vendidos e em alta")
  const { activeTheme } = useTheme()
  const { products } = useProducts()
  
  // Carregar produtos HOT do localStorage e produtos destacados
  useEffect(() => {
    const loadHotProducts = () => {
      // Carregar produtos HOT do localStorage (manuais)
      const savedProducts = localStorage.getItem("gang-boyz-hot-products")
      let manualHotProducts: HotProduct[] = []
      
      if (savedProducts) {
        try {
          const products: HotProduct[] = JSON.parse(savedProducts)
          manualHotProducts = products.filter(product => product.isActive)
        } catch (error) {
          console.error("Erro ao fazer parse dos produtos HOT:", error)
          manualHotProducts = []
        }
      }
      
      // Carregar produtos destacados das subcategorias
      const highlightedProducts = products
        .filter(product => product.destacarEmAlta === true)
        .map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || `${product.name} - Cor: ${product.color}`,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image,
          category: "Em Alta",
          isActive: true
        }))
      
      // Combinar produtos manuais com produtos destacados
      const allHotProducts = [...manualHotProducts, ...highlightedProducts]
      
      setHotProducts(allHotProducts)
    }

    // Carregar conteúdo editável
    const loadEditableContent = async () => {
      const titleContent = await getContentById("hot-title")
      const subtitleContent = await getContentById("hot-subtitle")
      
      console.log("Initial load - titleContent:", titleContent, "subtitleContent:", subtitleContent);
      
      if (titleContent !== null) {
        setEditableTitle(titleContent || "PRODUTOS EM DESTAQUE")
      }
      
      if (subtitleContent !== null) {
        setEditableSubtitle(subtitleContent || "Os produtos mais vendidos e em alta")
      }
    }

    // Firebase real-time listener for hot section title and subtitle
    const unsubscribeFirebaseTitle = editableContentSyncService.listenToContentChanges("hot-title", (content: string | null) => {
      if (content !== null) { // Only update if content is not null
        setEditableTitle(content || "PRODUTOS EM DESTAQUE") // Fallback to default if content is empty
      }
    })

    const unsubscribeFirebaseSubtitle = editableContentSyncService.listenToContentChanges("hot-subtitle", (content: string | null) => {
      if (content !== null) { // Only update if content is not null
        setEditableSubtitle(content || "Os produtos mais vendidos e em alta") // Fallback to default if content is empty
      }
    })

    // Carregar inicialmente
    loadHotProducts()
    loadEditableContent()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-hot-products") {
        loadHotProducts()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadHotProducts()
    }
    
    // Escutar mudanças nos produtos do contexto
    const handleProductsUpdate = () => {
      loadHotProducts()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('hotProductsUpdated', handleCustomStorageChange)
    window.addEventListener('forceProductsReload', handleProductsUpdate)
    window.addEventListener('testProductCreated', handleProductsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('hotProductsUpdated', handleCustomStorageChange)
      window.removeEventListener('forceProductsReload', handleProductsUpdate)
      window.removeEventListener('testProductCreated', handleProductsUpdate)
      // Clean up Firebase listeners
      unsubscribeFirebaseTitle()
      unsubscribeFirebaseSubtitle()
    }
  }, [products])

  // Função para excluir um produto
  const handleDeleteProduct = (productId: string) => {
    const savedProducts = localStorage.getItem("gang-boyz-hot-products")
    if (savedProducts) {
      try {
        const products: HotProduct[] = JSON.parse(savedProducts)
        const updatedProducts = products.filter(product => product.id !== productId)
        localStorage.setItem("gang-boyz-hot-products", JSON.stringify(updatedProducts))
        
        // Atualizar estado local imediatamente
        const activeProducts = updatedProducts.filter(product => product.isActive)
        setHotProducts(activeProducts)
        
        // Disparar evento para atualizar outros componentes
        eventManager.emit('hotProductsUpdated')
        
        toast.success("Produto removido localmente! A alteração será sincronizada quando a conexão for restabelecida.")
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        toast.error("Erro ao excluir produto")
      }
    }
  }

  // Função para editar um produto
  const handleEditProduct = (product: HotProduct) => {
    // Criar um objeto de produto no formato esperado pelo AdminProductModal
    const productForModal = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      isActive: product.isActive,
      // Campos adicionais necessários para o modal
      color: "Preto",
      subcategory: "em-alta",
      label: "",
      labelType: undefined,
      stock: 10,
      sizeStock: {},
      availableUnits: 10,
      availableSizes: ["P", "M", "G", "GG"],
      sizeQuantities: {
        "P": 2,
        "M": 3,
        "G": 3,
        "GG": 2
      } as Record<string, number>,
      recommendationCategory: "Camisetas",
      recommendationSubcategory: "basica"
    }
    
    // Tentar obter os dados completos do produto dos produtos administrativos
    try {
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products")
      if (existingAdminProducts) {
        const adminProductsArray: any[] = JSON.parse(existingAdminProducts)
        const adminProduct = adminProductsArray.find((p: any) => p.id === product.id)
        
        if (adminProduct) {
          // Atualizar com os dados reais do produto administrativo
          productForModal.color = adminProduct.color || "Preto"
          productForModal.stock = adminProduct.stock || 0
          productForModal.sizeStock = adminProduct.sizeStock || {}
          productForModal.availableUnits = adminProduct.stock || 0
          productForModal.availableSizes = adminProduct.sizes || ["P", "M", "G", "GG"]
          productForModal.recommendationCategory = adminProduct.category || "Camisetas"
          productForModal.recommendationSubcategory = adminProduct.subcategory || "basica"
          
          // Atualizar quantidades de tamanho do sizeStock
          const sizeQuantities: Record<string, number> = {}
          if (adminProduct.sizeStock) {
            Object.entries(adminProduct.sizeStock).forEach(([size, qty]) => {
              sizeQuantities[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0
            })
          }
          productForModal.sizeQuantities = sizeQuantities
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do produto admin:', error)
    }
    
    // Definir o produto atual e abrir o modal
    setCurrentProduct(productForModal)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  // Funções para salvar título e subtítulo editáveis
  const handleSaveTitle = async (newTitle: string) => {
    try {
      await updateContentById("hot-title", newTitle)
      setEditableTitle(newTitle)
      toast.success("Título atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar título:", error)
      toast.error("Erro ao atualizar título")
    }
  }

  const handleSaveSubtitle = async (newSubtitle: string) => {
    try {
      await updateContentById("hot-subtitle", newSubtitle)
      setEditableSubtitle(newSubtitle)
      toast.success("Subtítulo atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar subtítulo:", error)
      toast.error("Erro ao atualizar subtítulo")
    }
  }

  // Funções para salvar e cancelar edição do título e subtítulo
  const handleSaveConfig = async () => {
    try {
      await updateContentById("hot-title", editingTitle)
      await updateContentById("hot-subtitle", editingSubtitle)
      setEditableTitle(editingTitle)
      setEditableSubtitle(editingSubtitle)
      toast.success("O título e descrição da seção foram atualizados com sucesso.")
    } catch (error) {
      console.error("Erro ao salvar configuração:", error)
      toast.error("Erro ao atualizar título e descrição")
    }
  }

  const handleCancelEdit = () => {
    setEditingTitle(editableTitle)
    setEditingSubtitle(editableSubtitle)
  }

  // Add function to save a product
  const handleSaveProduct = async (product: any) => {
    // Compress image before saving
    const compressedImage = await compressImage(product.image, 0.6)
    const productWithCompressedImage = { ...product, image: compressedImage }
    
    // For hot products, we save to the "gang-boyz-hot-products" localStorage item
    const existingProducts = localStorage.getItem("gang-boyz-hot-products");
    let productsArray: HotProduct[] = [];
    
    if (existingProducts) {
      productsArray = JSON.parse(existingProducts);
    }
    
    // Generate ID if needed
    const productId = productWithCompressedImage.id || `hot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create product object with correct structure for hot products
    const hotProduct: HotProduct = {
      id: productId,
      name: productWithCompressedImage.name,
      description: productWithCompressedImage.description || `${productWithCompressedImage.name} - Cor: ${productWithCompressedImage.color}`,
      price: productWithCompressedImage.price,
      originalPrice: productWithCompressedImage.originalPrice || productWithCompressedImage.price,
      image: productWithCompressedImage.image,
      category: productWithCompressedImage.category || "Em Alta",
      isActive: productWithCompressedImage.isActive !== undefined ? productWithCompressedImage.isActive : true
    };
    
    // Check if we're updating an existing product or adding a new one
    const existingIndex = productsArray.findIndex(p => p.id === productId);
    
    if (existingIndex !== -1) {
      // Update existing product
      productsArray[existingIndex] = hotProduct;
    } else {
      // Add new product
      productsArray.push(hotProduct);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem("gang-boyz-hot-products", JSON.stringify(productsArray))
      
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
        
        const subcategoryKey = subcategoryNameToKeyMap[productWithCompressedImage.recommendationSubcategory] || productWithCompressedImage.recommendationSubcategory || "em-alta";
        
        // Create admin product object
        const adminProduct = {
          id: productId,
          name: productWithCompressedImage.name,
          price: productWithCompressedImage.price,
          originalPrice: productWithCompressedImage.originalPrice,
          image: productWithCompressedImage.image,
          color: productWithCompressedImage.color || "Preto",
          category: productWithCompressedImage.recommendationCategory || "Em Alta",
          subcategory: productWithCompressedImage.recommendationSubcategory || "em-alta",
          categories: [productWithCompressedImage.recommendationCategory || "Em Alta", subcategoryKey],
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
          // Configuração de destaque para produtos em alta
          destacarEmAlta: true
        }
        
        // Save to admin products
        const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
        let adminProductsArray: any[] = [];
        
        if (existingAdminProducts) {
          adminProductsArray = JSON.parse(existingAdminProducts);
        }
        
        // Check if we're updating an existing admin product or adding a new one
        const adminIndex = adminProductsArray.findIndex((p: any) => p.id === productId);
        
        if (adminIndex !== -1) {
          // Update existing admin product
          adminProductsArray[adminIndex] = adminProduct;
        } else {
          // Add new admin product
          adminProductsArray.push(adminProduct);
        }
        
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(adminProductsArray));
        
        // Dispatch events to force reload products in all pages
        eventManager.emit('forceProductsReload')
        eventManager.emit('testProductCreated')
      }
      
      // Disparar evento para atualizar outros componentes
      eventManager.emit('hotProductsUpdated')
      
      toast.success("Produto salvo localmente! A alteração será sincronizada quando a conexão for restabelecida.")
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      toast.error("Erro ao salvar produto")
      return
    }
    
    // Close modal
    setIsModalOpen(false)
  }

  // Function to handle adding a new product
  const handleAddNewProduct = () => {
    // Create a default product for the modal with proper ID
    const defaultProduct = {
      id: `hot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      color: "", // No default color - user must select
      category: "Em Alta", // Correct category
      subcategory: "em-alta", // Subcategory for EM ALTA
      label: "", // Default label
      labelType: undefined, // Default label type
      stock: 0, // No default stock
      sizeStock: {}, // Empty size stock
      // Recommendation fields for hot products
      availableUnits: 0,
      availableSizes: [], // No default sizes - user must select
      sizeQuantities: {}, // Empty size quantities
      recommendationCategory: "", // User must select category
      recommendationSubcategory: "", // User must select subcategory
      // Automatically check the destacar checkbox for hot products
      destacarEmRecomendacoes: false,
      destacarEmOfertas: false,
      destacarEmAlta: true,
      destacarLancamentos: false,
      isActive: true
    }
    
    setCurrentProduct(defaultProduct);
    setIsEditing(false);
    setIsModalOpen(true);
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

  return (
    <div>
      <section className="pt-24 pb-16 bg-black">
        <div className="container mx-auto px-4">
          {/* Título Hot - Using inline editing pattern like other components */}
          <div className="text-center mb-12 relative">
            {isEditMode ? (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <input
                    value={editingTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center bg-gray-800 border border-gray-600 rounded-md px-2 py-1 w-full max-w-full"
                  />
                  <Edit3 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  <Button onClick={handleSaveConfig} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
                    Cancelar
                  </Button>
                </div>
                <div className="mt-4 px-4">
                  <input
                    value={editingSubtitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSubtitle(e.target.value)}
                    className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-full mx-auto bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-center w-full"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  {editableTitle}
                </h2>
                <div 
                  className="w-16 sm:w-24 md:w-32 h-1 mx-auto rounded"
                  style={{ backgroundColor: `var(--primary-color)` }}
                ></div>
                <p className="text-neutral-400 mt-4 text-base sm:text-lg md:text-xl px-4">
                  {editableSubtitle}
                </p>
              </>
            )}
          </div>

          {/* Produtos em Destaque */}
          {hotProducts.length > 0 && (
            <>
              {/* Desktop - Grid de produtos */}
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {hotProducts.map((product) => (
                  <div key={product.id} className="w-full relative group">
                    <div className="bg-black overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
                      {/* Imagem */}
                      <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
                        <img
                          src={product.image || "/placeholder-default.svg"}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                        />
                      </div>
                      
                      {/* Nome/Código embaixo da imagem */}
                      <div className="text-white p-3">
                        <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                        <div className="red-text font-bold text-lg md:text-xl">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                        <div className="text-gray-400 text-xs">ID: {product.id}</div>
                      </div>
                    </div>
                    
                    {/* Botões de edição e exclusão quando em modo de edição */}
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
                          <Edit3 className="h-4 w-4 text-gray-700" />
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
              
              {/* Mobile - Grid otimizado (2 cards por linha) */}
              <div className="md:hidden">
                <div className="grid grid-cols-2 gap-3">
                  {hotProducts.map((product) => (
                    <div key={product.id} className="w-full relative group">
                      <div 
                        className="bg-black overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation"
                        onClick={() => isEditMode ? handleEditProduct(product) : window.location.href = `/produto/${product.id}`}
                      >
                        {/* Imagem com proporção otimizada para mobile */}
                        <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
                          <img
                            src={product.image || "/placeholder-default.svg"}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Nome/Código embaixo da imagem - Otimizado para mobile */}
                        <div className="text-white p-2 sm:p-3">
                          <h3 className="font-semibold text-xs sm:text-sm leading-tight mb-1">{product.name}</h3>
                          <div className="red-text font-bold text-sm sm:text-lg">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                          <div className="text-gray-400 text-[10px] sm:text-xs">ID: {product.id}</div>
                        </div>
                      </div>
                      
                      {/* Botões de edição e exclusão quando em modo de edição */}
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
                            <Edit3 className="h-4 w-4 text-gray-700" />
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
            </>
          )}
        </div>
      </section>
      
      <div className="relative w-full h-full">
      </div>
      
      {/* Product Modal */}
      {isModalOpen && (
        <AdminProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={currentProduct}
          onSave={handleSaveProduct}
          title="Produtos em Destaque"
          subcategory="em-alta"
          mode={isEditing ? "edit" : "create"}
        />
      )}
    </div>
  )
}
