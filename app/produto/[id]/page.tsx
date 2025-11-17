"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MobileHeaderSubcategory } from "@/components/mobile-header-subcategory"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { toast } from "sonner"
import { Heart, Share2, Truck, Shield, RotateCcw, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category: string
  color: string
  sizes: string[]
  stock: number
  material?: string
  weight?: string
  dimensions?: string
  origin?: string
  care?: string
  warranty?: string
  brand?: string
  // Product info fields
  freeShippingText?: string
  freeShippingThreshold?: string
  pickupText?: string
  pickupStatus?: string
}

interface ProductInfoConfig {
  freeShippingText: string
  freeShippingThreshold: string
  pickupText: string
  pickupStatus: string
  material: string
  weight: string
  dimensions: string
  origin: string
  care: string
  warranty: string
}

interface ShippingInfo {
  standard: { name: string; price: number; days: string }
  express: { name: string; price: number; days: string }
  expressPlus: { name: string; price: number; days: string }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [productInfoConfig, setProductInfoConfig] = useState<ProductInfoConfig>({
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
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState("")
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const { state, addItem, openCart } = useCart()
  const { user, favorites, addToFavorites, removeFromFavorites, isFavorite } = useUser()

  const router = useRouter()

  // Carregar produto
  useEffect(() => {
    const loadProduct = () => {
      const productId = params?.id as string | undefined
      
      // Buscar produto em múltiplos locais de armazenamento
      let foundProduct = null;
      
      // Verificar primeiro no gang-boyz-test-products (armazenamento principal)
      const savedTestProducts = localStorage.getItem("gang-boyz-test-products");
      if (savedTestProducts && productId) {
        const products = JSON.parse(savedTestProducts);
        foundProduct = products.find((p: any) => {
          // Handle both string and number ID comparisons
          const productIdStr = String(productId);
          const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
          const pIdStr = String(p.id);
          const pIdNum = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
          
          return pIdStr === productIdStr || 
                 pIdNum === productIdNum || 
                 pIdStr === productIdStr || 
                 String(pIdNum) === productIdStr;
        });
      }
      
      // Se não encontrou, verificar no gang-boyz-products (contexto de produtos)
      if (!foundProduct && productId) {
        const savedProducts = localStorage.getItem("gang-boyz-products");
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          foundProduct = products.find((p: any) => {
            // Handle both string and number ID comparisons
            const productIdStr = String(productId);
            const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
            const pIdStr = String(p.id);
            const pIdNum = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
            
            return pIdStr === productIdStr || 
                   pIdNum === productIdNum || 
                   pIdStr === productIdStr || 
                   String(pIdNum) === productIdStr;
          });
        }
      }
      
      // Se não encontrou, verificar no gang-boyz-standalone-products (produtos standalone)
      if (!foundProduct && productId) {
        const savedStandaloneProducts = localStorage.getItem("gang-boyz-standalone-products");
        if (savedStandaloneProducts) {
          const products = JSON.parse(savedStandaloneProducts);
          foundProduct = products.find((p: any) => {
            // Handle both string and number ID comparisons
            const productIdStr = String(productId);
            const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
            const pIdStr = String(p.id);
            const pIdNum = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
            
            return pIdStr === productIdStr || 
                   pIdNum === productIdNum || 
                   pIdStr === productIdStr || 
                   String(pIdNum) === productIdStr;
          });
        }
      }
      
      // Se não encontrou, verificar no gang-boyz-recommendations (recomendações)
      if (!foundProduct && productId) {
        const savedRecommendations = localStorage.getItem("gang-boyz-recommendations");
        if (savedRecommendations) {
          const recommendations = JSON.parse(savedRecommendations);
          const recommendationProduct = recommendations.find((p: any) => {
            // Handle both string and number ID comparisons
            const productIdStr = String(productId);
            const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
            const pIdStr = String(p.id);
            const pIdNum = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
            
            return pIdStr === productIdStr || 
                   pIdNum === productIdNum || 
                   pIdStr === productIdStr || 
                   String(pIdNum) === productIdStr;
          });
          
          // Se encontrou uma recomendação, converter para formato de produto
          if (recommendationProduct) {
            foundProduct = {
              id: recommendationProduct.id,
              name: recommendationProduct.name,
              price: recommendationProduct.price,
              originalPrice: recommendationProduct.originalPrice,
              image: recommendationProduct.image || "/placeholder-default.svg",
              description: recommendationProduct.description || "Produto premium da Gang BoyZ",
              category: recommendationProduct.recommendationCategory || "Recomendações",
              sizes: recommendationProduct.availableSizes || ["P", "M", "G", "GG"],
              stock: recommendationProduct.availableUnits || Math.floor(Math.random() * 10) + 1
            };
          }
        }
      }
        
      if (foundProduct) {
        // Load product info config from localStorage
        let loadedProductInfoConfig: ProductInfoConfig = {
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
          const savedInfo = localStorage.getItem('gang-boyz-product-info')
          if (savedInfo) {
            loadedProductInfoConfig = { ...loadedProductInfoConfig, ...JSON.parse(savedInfo) }
          }
        } catch (error) {
          console.error("Failed to parse product info config:", error)
        }
          
        setProductInfoConfig(loadedProductInfoConfig)
          
        setProduct({
          id: foundProduct.id,
          name: foundProduct.name,
          price: foundProduct.price,
          originalPrice: foundProduct.originalPrice,
          image: foundProduct.image || "/placeholder-default.svg",
          description: foundProduct.description || "Produto premium da Gang BoyZ",
          category: foundProduct.category || "Produto",
          color: foundProduct.color || "Preto",
          sizes: foundProduct.sizes || ["P", "M", "G", "GG"],
          stock: foundProduct.stock || Math.floor(Math.random() * 10) + 1,
          material: foundProduct.material || loadedProductInfoConfig.material,
          weight: foundProduct.weight || loadedProductInfoConfig.weight,
          dimensions: foundProduct.dimensions || loadedProductInfoConfig.dimensions,
          origin: foundProduct.origin || loadedProductInfoConfig.origin,
          care: foundProduct.care || loadedProductInfoConfig.care,
          warranty: foundProduct.warranty || loadedProductInfoConfig.warranty,
          brand: foundProduct.brand || "Gang BoyZ",
          // Product info fields - use product-specific values or fall back to defaults
          freeShippingText: foundProduct.freeShippingText || loadedProductInfoConfig.freeShippingText,
          freeShippingThreshold: foundProduct.freeShippingThreshold || loadedProductInfoConfig.freeShippingThreshold,
          pickupText: foundProduct.pickupText || loadedProductInfoConfig.pickupText,
          pickupStatus: foundProduct.pickupStatus || loadedProductInfoConfig.pickupStatus
        })
      }
      
      setLoading(false)
    }

    loadProduct()
  }, [params?.id])

  // Função para calcular frete
  const calculateShipping = async () => {
    if (!cep || cep.length !== 8) {
      toast.error("CEP deve ter 8 dígitos")
      return
    }

    setLoadingShipping(true)
    
    try {
      // Fetch real address data from ViaCEP API
      const cleanCep = cep.replace(/\D/g, '')
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data')
      }
      
      const addressData = await response.json()
      
      // Check if CEP is valid
      if (addressData.erro) {
        toast.error("CEP não encontrado. Por favor, verifique o CEP informado.")
        setLoadingShipping(false)
        return
      }
      
      // Calculate shipping cost based on state
      const state = addressData.uf
      let standardPrice = 15.90
      let expressPrice = 25.90
      let expressPlusPrice = 35.90
      
      if (state !== "SP") {
        // Increase cost for other states
        standardPrice = 20.90
        expressPrice = 30.90
        expressPlusPrice = 40.90
        
        // Further increase based on region
        switch (state) {
          case "RJ":
          case "MG":
          case "ES":
            standardPrice = 22.90
            expressPrice = 32.90
            expressPlusPrice = 42.90
            break
          case "PR":
          case "SC":
          case "RS":
            standardPrice = 25.90
            expressPrice = 35.90
            expressPlusPrice = 45.90
            break
          case "MS":
          case "MT":
          case "GO":
          case "DF":
            standardPrice = 27.90
            expressPrice = 37.90
            expressPlusPrice = 47.90
            break
          case "BA":
          case "SE":
          case "AL":
          case "PE":
          case "PB":
          case "RN":
            standardPrice = 29.90
            expressPrice = 39.90
            expressPlusPrice = 49.90
            break
          case "CE":
          case "PI":
          case "MA":
            standardPrice = 32.90
            expressPrice = 42.90
            expressPlusPrice = 52.90
            break
          case "PA":
          case "AP":
          case "AM":
          case "RR":
          case "AC":
          case "RO":
          case "TO":
            standardPrice = 35.90
            expressPrice = 45.90
            expressPlusPrice = 55.90
            break
        }
      }
      
      setShippingInfo({
        standard: { name: "PAC", price: standardPrice, days: "5-7 dias úteis" },
        express: { name: "SEDEX", price: expressPrice, days: "2-3 dias úteis" },
        expressPlus: { name: "SEDEX 10", price: expressPlusPrice, days: "1 dia útil" }
      })
      
      toast.success(`Frete calculado para ${addressData.localidade}/${addressData.uf}`)
    } catch (error) {
      console.error("Error calculating shipping:", error)
      toast.error("Erro ao calcular frete. Por favor, tente novamente.")
    } finally {
      setLoadingShipping(false)
    }
  }

  // Adicionar ao carrinho
  const handleAddToCart = () => {
    if (!product) return
    
    if (!selectedSize) {
      toast.error("Selecione um tamanho")
      return
    }

    addItem({
      id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity
    })
    
    openCart()
    toast.success(`${product.name} foi adicionado ao carrinho!`)
  }

  // Ir para pagamento
  const handleBuyNow = () => {
    if (!product) return
    
    if (!selectedSize) {
      toast.error("Selecione um tamanho")
      return
    }

    // Create a single item for direct checkout
    const checkoutItem = {
      id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: quantity
    }
    
    // Store the item in localStorage for checkout
    if (typeof window !== 'undefined') {
      localStorage.setItem('gang-boyz-checkout-items', JSON.stringify([checkoutItem]))
      
      // Save as ongoing checkout
      const checkoutData = {
        items: [checkoutItem],
        formData: {},
        timestamp: Date.now(),
        subtotal: product.price * quantity
      }
      localStorage.setItem('gang-boyz-ongoing-checkout', JSON.stringify(checkoutData))
    }
    
    // Redirect directly to checkout
    window.location.href = '/checkout'
  }

  // Toggle favorito
  const toggleFavorite = () => {
    if (!user) {
      toast("Faça login para curtir produtos")
      // Redirecionar para login
      window.location.href = '/auth/signin'
      return
    }

    if (isFavorite(product?.id || "")) {
      removeFromFavorites(product?.id || "")
      toast.success("Produto removido dos favoritos")
    } else {
      addToFavorites(product?.id || "")
      toast.success("Produto adicionado aos favoritos")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link href="/" className="red-text hover:underline">
            Voltar para a homepage
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Mobile Header for Product Page - Same as Subcategory Pages */}
      <MobileHeaderSubcategory />
      
      {/* Black spacer for desktop header separation */}
      <div className="hidden md:block h-20 bg-black"></div>
      
      <main className="pt-0">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${product.category?.toLowerCase()}`} className="hover:text-white transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Imagem do Produto */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 has-[>svg]:px-3 flex-1 ${
                    isFavorite(product.id) 
                      ? 'red-bg text-white border-red-500' 
                      : 'bg-transparent border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  {isFavorite(product.id) ? 'Favoritado' : 'Favoritar'}
                </button>
                
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 has-[>svg]:px-3 bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Título e Preço */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold red-text">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="red-bg text-white">
                      -{discountPercentage}%
                    </Badge>
                  )}
                </div>
                
                {/* Avaliação e Estoque */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="text-green-400">Em estoque</span>
                  <span>•</span>
                  <span>{product.stock} unidades</span>
                </div>
              </div>

              {/* Seleção de Tamanho */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-white text-white bg-white/10'
                          : 'border-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Cor */}
              <div>
                <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Cores</h4>
                <div className="flex flex-wrap gap-2">
                  {product.color.split(',').map((color: string) => {
                    // Map color names to actual color values
                    const colorMap: Record<string, string> = {
                      'Preto': 'bg-black',
                      'Branco': 'bg-white',
                      'Azul': 'bg-blue-500',
                      'Rosa': 'bg-pink-500',
                      'Bege': 'bg-amber-100',
                      'Cinza': 'bg-gray-500',
                      'Vermelho': 'bg-red-500',
                      'Verde': 'bg-green-500',
                      'Amarelo': 'bg-yellow-500',
                      'Roxo': 'bg-purple-500',
                      'Laranja': 'bg-orange-500',
                      'Marrom': 'bg-amber-800'
                    };
                    
                    const colorClass = colorMap[color.trim()] || 'bg-gray-500';
                    const isSelected = selectedColor === color.trim();
                    
                    return (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(isSelected ? null : color.trim())}
                        className={`w-8 h-8 rounded-full ${colorClass} border-2 ${isSelected ? 'border-red-500' : 'border-gray-600'} flex items-center justify-center`}
                        title={color.trim()}
                      >
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check h-4 w-4 text-white">
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantidade */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantidade</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className={`px-3 py-2 text-gray-400 hover:text-white transition-colors ${quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.stock} unidades disponíveis
                  </span>
                </div>
              </div>

              {/* Botões de Compra */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary shadow-xs h-9 px-4 has-[>svg]:px-3 w-full red-bg hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors ${!selectedSize || !selectedColor ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Adicionar ao Carrinho
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSize || !selectedColor}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 has-[>svg]:px-3 w-full bg-white text-black hover:bg-gray-100 font-bold py-3 rounded-lg transition-colors ${!selectedSize || !selectedColor ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Comprar Agora
                </button>
                

              </div>



              {/* Informações Técnicas */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold mb-4">Informações Técnicas</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material:</span>
                    <span>{product.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peso:</span>
                    <span>{product.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dimensões:</span>
                    <span>{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Origem:</span>
                    <span>{product.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cuidados:</span>
                    <span>{product.care}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Garantia:</span>
                    <span>{product.warranty}</span>
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold mb-4">Benefícios</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Truck className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <div className="text-sm font-medium text-black">{product.freeShippingText}</div>
                      <div className="text-xs text-black">{product.freeShippingThreshold}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Shield className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <div className="text-sm font-medium text-black">Garantia</div>
                      <div className="text-xs text-black">{product.warranty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <RotateCcw className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <div className="text-sm font-medium text-black">Troca Fácil</div>
                      <div className="text-xs text-black">30 dias</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Empty fragment for removed modal */}
      {/* The modal was removed as we now redirect directly to checkout */}
    </div>
  )
}