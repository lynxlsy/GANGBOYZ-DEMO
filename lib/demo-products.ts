// Produtos demonstrativos para o sistema Gang Boyz

export interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  isNew: boolean
  isPromotion: boolean
  installments: string
  brand: string
  // Novos campos para o Card 1 (Card Completo)
  sizes: string[]
  color: string
  categories: string[]
  discountPercentage?: number
}

export interface Category {
  id: string
  name: string
  icon: string
  products: Product[]
}

// Produtos HOT demonstrativos
export const demoHotProducts: HotProduct[] = [
  {
    id: "HOT001",
    name: "Jaqueta Oversized Premium",
    description: "Jaqueta streetwear com design exclusivo e tecido premium",
    price: 299.90,
    originalPrice: 399.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  },
  {
    id: "HOT002", 
    name: "Moletom Hoodie Gang",
    description: "Moletom com logo bordado e capuz ajustável",
    price: 199.90,
    originalPrice: 249.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  },
  {
    id: "HOT003",
    name: "Camiseta Graphic Design",
    description: "Camiseta com estampa neon e design urbano",
    price: 89.90,
    originalPrice: 129.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  },
  {
    id: "HOT004",
    name: "Calça Cargo Street",
    description: "Calça cargo com bolsos laterais e corte moderno",
    price: 179.90,
    originalPrice: 229.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  },
  {
    id: "HOT005",
    name: "Boné Snapback Gang",
    description: "Boné ajustável com logo bordado em branco",
    price: 79.90,
    originalPrice: 99.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  },
  {
    id: "HOT006",
    name: "Colar de Corrente Prata",
    description: "Colar de corrente prata com design minimalista",
    price: 149.90,
    originalPrice: 199.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  }
]

// Produtos para OFERTAS ESPECIAIS
export const demoStandaloneProducts: Product[] = [
  {
    id: "OFFER001",
    name: "Kit Completo Streetwear",
    price: 499.90,
    originalPrice: 699.90,
    image: "/placeholder-default.svg",
    isNew: true,
    isPromotion: true,
    installments: "12x de R$ 41,66",
    brand: "Gang Boyz",
    sizes: ["P", "M", "G", "GG"],
    color: "Preto",
    categories: ["Kits"],
    discountPercentage: 29
  },
  {
    id: "OFFER002",
    name: "Moletom Premium Collection",
    price: 229.90,
    originalPrice: 299.90,
    image: "/placeholder-default.svg",
    isNew: false,
    isPromotion: true,
    installments: "6x de R$ 38,32",
    brand: "Gang Boyz",
    sizes: ["P", "M", "G", "GG"],
    color: "Cinza",
    categories: ["Moletons"],
    discountPercentage: 23
  },
  {
    id: "OFFER003",
    name: "Camiseta Limited Edition",
    price: 119.90,
    originalPrice: 159.90,
    image: "/placeholder-default.svg",
    isNew: true,
    isPromotion: false,
    installments: "3x de R$ 39,97",
    brand: "Gang Boyz",
    sizes: ["P", "M", "G", "GG"],
    color: "Branco",
    categories: ["Camisetas"],
    discountPercentage: 25
  },
  {
    id: "OFFER004",
    name: "Calça Cargo Tactical",
    price: 199.90,
    originalPrice: 279.90,
    image: "/placeholder-default.svg",
    isNew: false,
    isPromotion: true,
    installments: "8x de R$ 24,99",
    brand: "Gang Boyz",
    sizes: ["38", "40", "42", "44", "46"],
    color: "Preto",
    categories: ["Calças"],
    discountPercentage: 29
  }
]

// Categorias com produtos - Simplificadas
export const demoCategories: Category[] = [
  {
    id: "cat001",
    name: "Produtos",
    icon: "👕",
    products: []
  }
]

// Função para inicializar produtos demonstrativos
export function initializeDemoProducts() {
  // Verificar se já existem produtos
  const existingHotProducts = localStorage.getItem("gang-boyz-hot-products")
  const existingStandaloneProducts = localStorage.getItem("gang-boyz-standalone-products")
  const existingCategories = localStorage.getItem("gang-boyz-categories")

  // Adicionar produtos HOT se não existirem
  if (!existingHotProducts) {
    localStorage.setItem("gang-boyz-hot-products", JSON.stringify(demoHotProducts))
    console.log("✅ Produtos HOT demonstrativos adicionados!")
  }

  // Adicionar produtos avulsos se não existirem
  if (!existingStandaloneProducts) {
    localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(demoStandaloneProducts))
    console.log("✅ Produtos avulsos demonstrativos adicionados!")
  }

  // Adicionar categorias se não existirem ou não foram personalizadas
  let shouldAddCategories = false
  if (!existingCategories) {
    shouldAddCategories = true
  } else {
    try {
      const parsedCategories = JSON.parse(existingCategories)
      // Verificar se as categorias já foram personalizadas
      const isCustomized = parsedCategories.some((cat: any) => 
        cat.id !== cat.id.toUpperCase() || // IDs personalizados não estão em maiúsculo
        cat.description !== "" || // Categorias personalizadas podem ter descrições
        !cat.products // Categorias personalizadas podem não ter o array de produtos
      )
      
      if (!isCustomized) {
        shouldAddCategories = true
      } else {
        console.log("ℹ️ Categorias personalizadas detectadas, mantendo as existentes")
      }
    } catch (error) {
      console.warn("Erro ao verificar categorias existentes:", error)
      shouldAddCategories = true
    }
  }
  
  if (shouldAddCategories) {
    localStorage.setItem("gang-boyz-categories", JSON.stringify(demoCategories))
    console.log("✅ Categorias demonstrativas adicionadas!")
  }

  return {
    hotProductsAdded: !existingHotProducts,
    standaloneProductsAdded: !existingStandaloneProducts,
    categoriesAdded: shouldAddCategories
  }
}

// Função para resetar todos os produtos (útil para testes)
export function resetAllProducts() {
  localStorage.setItem("gang-boyz-hot-products", JSON.stringify(demoHotProducts))
  localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(demoStandaloneProducts))
  localStorage.setItem("gang-boyz-categories", JSON.stringify(demoCategories))
  
  console.log("🔄 Todos os produtos foram resetados para os demonstrativos!")
  
  // Disparar eventos para atualizar as seções
  window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
  window.dispatchEvent(new CustomEvent('productsUpdated'))
  
  return true
}





