"use client"

interface StandardProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    [key: string]: any
  }
  onClick?: () => void
  className?: string
}

export function StandardProductCard({ product, onClick, className = "" }: StandardProductCardProps) {
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  const calculateDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return 0
  }

  const discountPercentage = calculateDiscountPercentage()

  return (
    <div 
      className={`bg-black text-white cursor-pointer hover:opacity-90 transition-opacity duration-300 w-full ${className}`}
      onClick={onClick}
    >
      {/* Imagem do produto */}
      <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
        <img
          src={product.image || "/placeholder-default.svg"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Badge de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Informações do produto */}
      <div className="p-2 flex-1 flex flex-col">
        {/* Nome do produto */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Preço */}
        <div className="mb-1">
          <div className="flex items-center gap-2">
            <span className="red-text font-bold text-lg">
              R$ {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">
                R$ {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        {/* ID do produto */}
        <div className="text-gray-400 text-xs">
          ID: {product.id}
        </div>
      </div>
    </div>
  )
}