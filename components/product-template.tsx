"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Heart, ShoppingCart } from "lucide-react"
import { Product } from "@/lib/products-context-simple"
import { useUser } from "@/lib/user-context"
import { useCart } from "@/lib/cart-context"
import { useEditMode } from "@/lib/edit-mode-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SeasonHighlightsSelector } from "@/components/season-highlights-selector"

interface ProductTemplateProps {
  product: Product & {
    // Added new fields for recommendations
    availableUnits?: number
    availableSizes?: string[]
    recommendationCategory?: string
    recommendationSubcategory?: string
    // Adicionando campo de descrição
    description?: string
  }
  onAddToCart?: (product: Product) => void
  className?: string
  isEditable?: boolean
  onEdit?: (product: Product) => void
  disableSeasonHighlightsSelector?: boolean
}

export function ProductTemplate({ product, onAddToCart, className = "", isEditable = false, onEdit, disableSeasonHighlightsSelector = false }: ProductTemplateProps) {
  const [showSizes, setShowSizes] = useState(false)
  const { user, isFavorite, addToFavorites, removeFromFavorites } = useUser()
  const { state: cartState, addItem, removeItem } = useCart()
  const { isEditMode } = useEditMode()
  const router = useRouter()

  // Check if product is in cart (convert product.id to number for comparison)
  const productCartId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
  const isInCart = cartState.items.some(item => item.id === productCartId)

  const isLiked = isFavorite(product.id)

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  const calculateDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return product.discountPercentage || 0
  }

  const discountPercentage = calculateDiscountPercentage()

  // Handle add to cart/remove from cart
  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInCart) {
      // Remove from cart
      const cartItem = cartState.items.find(item => item.id === productCartId)
      if (cartItem) {
        removeItem(cartItem.id)
        toast.success("Produto removido do carrinho")
      }
    } else {
      // Add to cart
      if (onAddToCart) {
        onAddToCart(product)
      } else {
        addItem({
          id: productCartId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        })
      }
      toast.success("Produto adicionado ao carrinho")
    }
  }

  return (
    <div 
      className={`w-[240px] bg-black ${className} cursor-pointer`}
      onClick={() => router.push(`/produto/${product.id}`)}
    >
      {/* FOTO - Compacta */}
      <div className="w-[240px] h-[280px] bg-gray-800 flex items-center justify-center overflow-hidden relative group">
        {product.image && product.image !== "/placeholder-default.svg" ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-1">🖼️</div>
            <div className="text-xs font-medium">ADICIONE SUA IMAGEM</div>
            <div className="text-xs">240x280px</div>
          </div>
        )}
        
        {/* Etiqueta de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold text-white bg-red-500">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Etiqueta de estoque esgotado */}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white bg-gray-600">
            ESGOTADO
          </div>
        )}
        
        {/* Botões de Ação */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Botão Curtir */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              
              if (!user) {
                toast.info("Faça login para curtir produtos")
                router.push('/auth/signin')
                return
              }

              if (isLiked) {
                removeFromFavorites(product.id)
                toast.success("Removido dos favoritos")
              } else {
                addToFavorites(product.id)
                toast.success("Adicionado aos favoritos")
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked 
                ? 'red-bg text-white scale-110' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
            }`}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 ${
                isLiked ? 'fill-current' : ''
              }`} 
            />
          </button>
          
          {/* Botão Carrinho */}
          <button
            onClick={handleCartAction}
            disabled={product.stock === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              product.stock === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : isInCart 
                  ? 'bg-green-500 text-white scale-110' 
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
            }`}
          >
            <ShoppingCart 
              className={`w-4 h-4 transition-all duration-300 ${
                isInCart ? 'fill-current' : ''
              }`} 
            />
          </button>
        </div>
      </div>
      
      {/* INFORMAÇÕES - Compactas */}
      <div className="p-2 bg-black text-left">
        <h3 className="text-sm font-semibold text-white mb-1 text-left line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2 text-left">
          <span className="text-base font-bold text-white">R$ {formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && product.originalPrice > 0 && (
            <span className="text-xs text-gray-400 line-through">R$ {formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mb-1 text-left">#{product.id}</div>
        <div className="text-xs text-gray-400 mb-1 text-left">Cor: {product.color}</div>
        
        {/* Display stock information */}
        {product.stock !== undefined && (
          <div className="text-xs text-gray-400 mb-1 text-left">
            Estoque: {product.stock} unid.
          </div>
        )}
        {product.recommendationCategory && (
          <div className="text-xs text-gray-400 mb-1 text-left">
            Categoria: {product.recommendationCategory}
          </div>
        )}
        {product.recommendationSubcategory && (
          <div className="text-xs text-gray-400 mb-1 text-left">
            Subcategoria: {product.recommendationSubcategory}
          </div>
        )}
        
        {/* Descrição do produto (se disponível) */}
        {product.description && (
          <div className="text-xs text-gray-300 mb-2 text-left line-clamp-2">
            {product.description}
          </div>
        )}
        
        {/* Tamanhos disponíveis */}
        <div className="mb-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowSizes(!showSizes)
            }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span>Tamanhos:</span>
            <span className="text-gray-300">
              {(product.availableSizes || product.sizes || []).slice(0, 3).join(", ")}
              {(product.availableSizes || product.sizes || []).length > 3 && ` +${(product.availableSizes || product.sizes || []).length - 3}`}
            </span>
            {showSizes ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          
          {showSizes && (
            <div className="mt-1 flex flex-wrap gap-1">
              {(product.availableSizes || product.sizes || []).map((size) => {
                // Verificar estoque para este tamanho, se disponível
                const sizeStock = (product as any).sizeStock?.[size]
                const isAvailable = sizeStock === undefined || sizeStock > 0
                
                return (
                  <span
                    key={size}
                    className={`px-1 py-0.5 text-xs border ${
                      isAvailable
                        ? 'bg-gray-800 text-gray-300 border-gray-600'
                        : 'bg-gray-700 text-gray-500 border-gray-600'
                    }`}
                  >
                    {size}
                    {sizeStock !== undefined && (
                      <span className="ml-0.5">({sizeStock})</span>
                    )}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Botão de editar (apenas se for editável) */}
        {isEditable && onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="w-full bg-blue-500 text-white py-1.5 px-3 hover:bg-blue-600 transition-colors font-medium mt-1 text-sm"
          >
            Editar Produto
          </button>
        )}
        
        {/* Season Highlights Selector (apenas no modo de edição) */}
        {isEditMode && !disableSeasonHighlightsSelector && (
          <div className="mt-2">
            <SeasonHighlightsSelector 
              product={product} 
              onProductAdded={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
