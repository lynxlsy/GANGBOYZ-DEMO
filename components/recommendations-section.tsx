"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { eventManager } from "@/lib/event-manager"
import { useProducts } from "@/lib/products-context-simple"
import { AdminProductModal } from "@/components/admin-product-modal"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from "@/lib/editable-content-sync"
import { Edit3, Trash2, Save, Plus } from "lucide-react"
import { StandardProductCard } from "@/components/standard-product-card"
import { useRouter } from "next/navigation"

interface Recommendation {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isActive: boolean
  availableUnits: number
  availableSizes: string[]
  sizeQuantities: Record<string, number>
  recommendationCategory: string
  recommendationSubcategory: string
}

export function RecommendationsSection({ isEditMode = false }: { isEditMode?: boolean }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [highlightedProducts, setHighlightedProducts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableTitle, setEditableTitle] = useState("RECOMENDAÇÕES")
  const [editingTitle, setEditingTitle] = useState("RECOMENDAÇÕES")
  const { addItem, openCart } = useCart()
  const { products } = useProducts()
  const router = useRouter()

  // Carregar recomendações do localStorage
  useEffect(() => {
    const loadRecommendations = () => {
      const savedRecommendations = localStorage.getItem("gang-boyz-recommendations")
      if (savedRecommendations) {
        try {
          const recommendations: Recommendation[] = JSON.parse(savedRecommendations)
          // Filtrar apenas as recomendações ativas
          const activeRecommendations = recommendations.filter(rec => rec.isActive)
          setRecommendations(activeRecommendations)
          localStorage.setItem("gang-boyz-recommendations", JSON.stringify(activeRecommendations));
        } catch (error) {
          console.error("Erro ao carregar recomendações:", error);
          // Se houver erro no parse, inicializar com array vazio
          localStorage.setItem("gang-boyz-recommendations", JSON.stringify([]));
          setRecommendations([]);
        }
      } else {
        // Inicializar com array vazio se não houver recomendações
        localStorage.setItem("gang-boyz-recommendations", JSON.stringify([]));
        setRecommendations([]);
      }
    }

    loadRecommendations();

    // Escutar mudanças nos conteúdos editáveis
    const handleEditableContentsChange = async () => {
      const titleContent = await getContentById("recommendations-title");
      if (titleContent !== null) {
        setEditableTitle(titleContent || "RECOMENDAÇÕES");
        setEditingTitle(titleContent || "RECOMENDAÇÕES");
      }
    }

    // Firebase real-time listener for recommendations title
    const unsubscribeFirebase = editableContentSyncService.listenToContentChanges("recommendations-title", (content: string | null) => {
      if (content !== null) { // Only update if content is not null
        setEditableTitle(content || "RECOMENDAÇÕES") // Fallback to default if content is empty
        setEditingTitle(content || "RECOMENDAÇÕES") // Fallback to default if content is empty
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('editableContentsUpdated'));
      }
    });

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-recommendations") {
        loadRecommendations();
      }
    }

    // Escutar eventos customizados
    const handleCustomStorageChange = () => {
      loadRecommendations();
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('recommendationsUpdated', handleCustomStorageChange);
    window.addEventListener('editableContentsUpdated', handleEditableContentsChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('recommendationsUpdated', handleCustomStorageChange);
      window.removeEventListener('editableContentsUpdated', handleEditableContentsChange);
      // Clean up Firebase listener
      unsubscribeFirebase();
    }
  }, []);

  // Carregar produtos destacados para recomendações
  useEffect(() => {
    const loadHighlightedProducts = () => {
      // Filtrar produtos marcados para aparecer em recomendações
      const highlighted = products.filter(product => 
        product.destacarEmRecomendacoes === true
      );
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

  // Combinar recomendações regulares com produtos destacados
  const allRecommendations = [
    ...recommendations,
    ...highlightedProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || `${product.name} - Cor: ${product.color}`,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Recomendações",
      isActive: true,
      availableUnits: product.stock || 0,
      availableSizes: product.sizes || [],
      sizeQuantities: product.sizeStock || {},
      recommendationCategory: product.recommendationCategory || "",
      recommendationSubcategory: ""
    }))
  ]
  const displayRecommendations = allRecommendations.slice(0, 12) // Limitar a 12 imagens (2 linhas de 6)

  // Função para adicionar produto ao carrinho e abrir sidebar
  const handleAddToCart = (recommendation: Recommendation) => {
    if (isEditMode) return; // Não adicionar ao carrinho no modo de edição
    
    addItem({
      id: Number(recommendation.id),
      name: recommendation.name,
      price: recommendation.price,
      image: recommendation.image || "/placeholder-default.svg",
    })
    openCart()
    toast.success(`${recommendation.name} adicionado ao carrinho!`)
  }

  // Função para lidar com o clique no produto (redirecionar para a página do produto)
  const handleProductClick = (recommendation: Recommendation) => {
    if (isEditMode) {
      handleEditRecommendation(recommendation);
    } else {
      // Redirecionar para a página do produto
      router.push(`/produto/${recommendation.id}`);
    }
  }

  // Função para editar uma recomendação
  const handleEditRecommendation = (recommendation: Recommendation) => {
    setCurrentProduct(recommendation)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  // Função para adicionar uma nova recomendação
  const handleAddNewRecommendation = () => {
    setCurrentProduct(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  // Função para salvar uma nova recomendação
  const handleSaveRecommendation = async (product: any) => {
    if (isEditing) {
      // Atualizar recomendação existente
      await handleUpdateRecommendation(product);
    } else {
      // Adicionar nova recomendação
      await handleCreateRecommendation(product);
    }
  }

  // Função para criar uma nova recomendação
  const handleCreateRecommendation = async (product: any) => {
    // Calculate total available units from size quantities
    const sizeQuantities = product.sizeQuantities || {};
    const availableSizes = product.availableSizes || [];
    const totalUnits = Object.values(sizeQuantities).reduce((sum: number, qty: unknown) => 
      sum + (typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0), 0);
    
    // Converter o produto do modal para o formato de recomendação
    const newRecommendation: Recommendation = {
      id: product.id || generateUniqueId("REC"), // Gera ID único se não houver
      name: product.name,
      description: `${product.name} - Cor: ${product.color}`,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Recomendações",
      isActive: true,
      availableUnits: totalUnits, // Use calculated total
      availableSizes: availableSizes,
      sizeQuantities: sizeQuantities, // Store size quantities
      recommendationCategory: product.recommendationCategory,
      recommendationSubcategory: product.recommendationSubcategory
    }

    // Salvar no localStorage
    const existingRecommendations = localStorage.getItem("gang-boyz-recommendations");
    let recommendationsArray: Recommendation[] = [];
    
    if (existingRecommendations) {
      recommendationsArray = JSON.parse(existingRecommendations);
    }
    
    // Adicionar a nova recomendação
    recommendationsArray.push(newRecommendation);
    
    // Limpar recomendações antigas se necessário (manter apenas as 30 mais recentes)
    recommendationsArray = cleanupOldRecommendations(recommendationsArray);
    
    // Salvar no localStorage com tratamento de erro
    try {
      localStorage.setItem("gang-boyz-recommendations", JSON.stringify(recommendationsArray));
      
      // Also save to backend
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-recommendations', 
          content: JSON.stringify(recommendationsArray) 
        }),
      });
      
      // Disparar evento para atualizar outros componentes
      eventManager.emit('recommendationsUpdated');
      
      toast.success("Recomendação criada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar recomendação:", error);
      toast.error("Erro ao salvar recomendação");
    }
    
    // Fechar modal
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProduct(null);
  }

  // Função para atualizar uma recomendação existente
  const handleUpdateRecommendation = async (updatedProduct: any) => {
    // Calculate total available units from size quantities
    const sizeQuantities = updatedProduct.sizeQuantities || {};
    const availableSizes = updatedProduct.availableSizes || [];
    const totalUnits = Object.values(sizeQuantities).reduce((sum: number, qty: unknown) => 
      sum + (typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0), 0);
    
    // Converter o produto do modal para o formato de recomendação
    const updatedRecommendation: Recommendation = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: `${updatedProduct.name} - Cor: ${updatedProduct.color}`,
      price: updatedProduct.price,
      originalPrice: updatedProduct.originalPrice,
      image: updatedProduct.image,
      category: "Recomendações",
      isActive: true,
      availableUnits: totalUnits, // Use calculated total
      availableSizes: availableSizes,
      sizeQuantities: sizeQuantities, // Store size quantities
      recommendationCategory: updatedProduct.recommendationCategory,
      recommendationSubcategory: updatedProduct.recommendationSubcategory
    }

    // Atualizar no localStorage
    const existingRecommendations = localStorage.getItem("gang-boyz-recommendations");
    let recommendationsArray: Recommendation[] = [];
    
    if (existingRecommendations) {
      recommendationsArray = JSON.parse(existingRecommendations);
    }
    
    // Encontrar e atualizar a recomendação existente
    const updatedArray = recommendationsArray.map(rec => 
      rec.id === updatedRecommendation.id ? updatedRecommendation : rec
    );
    
    // Salvar no localStorage com tratamento de erro
    try {
      localStorage.setItem("gang-boyz-recommendations", JSON.stringify(updatedArray));
      
      // Also save to backend
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-recommendations', 
          content: JSON.stringify(updatedArray) 
        }),
      });
      
      // Disparar evento para atualizar outros componentes
      eventManager.emit('recommendationsUpdated');
      
      toast.success("Recomendação atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar recomendação:", error);
      toast.error("Erro ao atualizar recomendação");
    }
    
    // Fechar modal
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProduct(null);
  }

  // Função para excluir uma recomendação
  const handleDeleteRecommendation = (recommendationId: string) => {
    const existingRecommendations = localStorage.getItem("gang-boyz-recommendations");
    if (existingRecommendations) {
      try {
        const recommendationsArray: Recommendation[] = JSON.parse(existingRecommendations);
        const updatedArray = recommendationsArray.map(rec => 
          rec.id === recommendationId ? { ...rec, isActive: false } : rec
        );
        
        localStorage.setItem("gang-boyz-recommendations", JSON.stringify(updatedArray));
        
        // Atualizar estado local imediatamente
        const activeRecommendations = updatedArray.filter(rec => rec.isActive);
        setRecommendations(activeRecommendations);
        
        // Disparar evento para atualizar outros componentes
        eventManager.emit('recommendationsUpdated');
        
        toast.success("Recomendação removida com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir recomendação:", error);
        toast.error("Erro ao excluir recomendação");
      }
    }
  }

  // Função para limpar recomendações antigas (manter apenas as 30 mais recentes)
  const cleanupOldRecommendations = (recommendations: Recommendation[]): Recommendation[] => {
    // Ordenar por ID (assumindo que IDs mais recentes são maiores)
    const sorted = [...recommendations].sort((a, b) => {
      // Extrair número do ID para comparação
      const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
      return numB - numA; // Mais recente primeiro
    });
    
    // Manter apenas as 30 mais recentes
    return sorted.slice(0, 30);
  }

  // Função para gerar ID único
  const generateUniqueId = (prefix: string = "REC"): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  }

  // Função para salvar o título editável
  const handleSaveTitle = async () => {
    try {
      console.log('Saving recommendations title to Firebase:', editingTitle);
      await updateContentById("recommendations-title", editingTitle);
      setEditableTitle(editingTitle);
      toast.success("Título atualizado com sucesso!");
      console.log('Recommendations title saved successfully');
    } catch (error) {
      console.error("Erro ao salvar título:", error);
      toast.error("Erro ao atualizar título");
    }
  }

  // Função para cancelar a edição do título
  const handleCancelEdit = () => {
    setEditingTitle(editableTitle);
  }

  return (
    <section className="py-8 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <div className="text-center mb-8 md:mb-12 relative">
          {isEditMode ? (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="text-2xl md:text-3xl font-bold text-white text-center bg-gray-800 border-gray-600"
                />
                <Edit3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <Button onClick={handleSaveTitle} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button 
                  onClick={handleCancelEdit} 
                  variant="outline" 
                  size="sm" 
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {editableTitle}
              </h2>
              <div className="w-24 md:w-32 h-1 red-bg mx-auto rounded"></div>
            </>
          )}
        </div>

        {/* Produtos recomendados - Otimizado para Mobile */}
        <div className="mb-6 sm:mb-8 md:mb-16">
          {/* Desktop - Grid de produtos (mesmo padrão de ofertas) */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {displayRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="relative group">
                <StandardProductCard
                  product={recommendation}
                  onClick={() => handleProductClick(recommendation)}
                />
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRecommendation(recommendation);
                      }}
                      title="Editar recomendação"
                    >
                      <Edit3 className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecommendation(recommendation.id);
                      }}
                      title="Excluir recomendação"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile - Grid layout (2 columns) */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3">
              {displayRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="relative group">
                  <StandardProductCard
                    product={recommendation}
                    onClick={() => handleProductClick(recommendation)}
                  />
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRecommendation(recommendation);
                        }}
                        title="Editar recomendação"
                      >
                        <Edit3 className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecommendation(recommendation.id);
                        }}
                        title="Excluir recomendação"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para adicionar/editar recomendação */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
          setCurrentProduct(null);
        }}
        product={currentProduct}
        onSave={handleSaveRecommendation}
        title="Recomendações"
        subcategory="recomendacoes"
        mode={isEditing ? "edit" : "create"}
      />
    </section>
  )
}