"use client"

import { useState } from "react"
import { CreditCard, Plus, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    category?: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  // Add size and color props
  selectedSize?: string
  selectedColor?: string
}

export function AddToCartButton({ 
  product, 
  variant = "default", 
  size = "md", 
  className = "",
  selectedSize,
  selectedColor
}: AddToCartButtonProps) {
  const { addItem, state } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  
  // Check if product is in cart
  const isInCart = state.items.some(item => 
    typeof item.id === 'string' && typeof product.id === 'string' 
      ? item.id === product.id 
      : item.id === (typeof product.id === 'string' ? parseInt(product.id, 10) : product.id)
  )

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      toast.info("Faça login para adicionar produtos ao carrinho")
      router.push('/auth/signin')
      return
    }

    setIsAdding(true)
    
    try {
      await addItem({
        id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity: 1,
        size: selectedSize,
        color: selectedColor
      })
      
      setIsAdded(true)
      toast.success(`${product.name} adicionado ao carrinho!`)
      
      // Reset animation after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
        setIsAdding(false)
      }, 2000)
      
    } catch (error) {
      toast.error("Erro ao adicionar ao carrinho")
      setIsAdding(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || isAdded}
      variant={variant}
      size="sm"
      className={`${sizeClasses[size]} ${className} ${
        isAdded ? "bg-green-600 hover:bg-green-700" : ""
      } transition-all duration-200`}
    >
      {isAdding ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : isAdded ? (
        <>
          <Check className={`${iconSizeClasses[size]} mr-2`} />
          Adicionado!
        </>
      ) : isInCart ? (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          No Carrinho
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CreditCard className={`${iconSizeClasses[size]} mr-2`} />
          Compre agora
        </div>
      )}
    </Button>
  )
}





