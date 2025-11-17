// Script para inicializar a homepage com dados de demonstração

// Banners de demonstração
const demoBanners = [
  {
    id: "hero-banner-1",
    name: "Banner Principal 1 (Hero)",
    description: "Primeiro banner do carrossel principal da página inicial",
    currentImage: "/banner-hero.svg",
    mediaType: "image",
    dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
    format: "JPG, PNG, WebP, MP4, GIF",
    position: "Background da seção hero (abaixo da faixa de aviso)"
  },
  {
    id: "hero-banner-2",
    name: "Banner Principal 2 (Hero)",
    description: "Segundo banner do carrossel principal da página inicial",
    currentImage: "/banner-hero.svg",
    mediaType: "image",
    dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
    format: "JPG, PNG, WebP, MP4, GIF",
    position: "Background da seção hero (abaixo da faixa de aviso)"
  },
  {
    id: "footer-banner",
    name: "Banner Footer",
    description: "Banner que aparece antes do footer em todas as páginas",
    currentImage: "/banner-hero.svg",
    mediaType: "image",
    dimensions: "1920x650px (≈2.95:1) - Padrão para banners de seção",
    format: "JPG, PNG, WebP, MP4, GIF",
    position: "Antes do Footer (em todas as páginas)"
  }
]

// Produtos de demonstração para ofertas especiais
const demoStandaloneProducts = [
  {
    id: "OFERTA001",
    name: "Camiseta Oversized Gang",
    price: 89.90,
    originalPrice: 129.90,
    image: "/placeholder-default.svg",
    isNew: true,
    isPromotion: true,
    installments: "3x de R$ 29.97",
    brand: "Gang Boyz"
  },
  {
    id: "OFERTA002", 
    name: "Moletom Premium",
    price: 199.90,
    originalPrice: 279.90,
    image: "/placeholder-default.svg",
    isNew: false,
    isPromotion: true,
    installments: "6x de R$ 33.32",
    brand: "Gang Boyz"
  },
  {
    id: "OFERTA003",
    name: "Calça Cargo Street",
    price: 179.90,
    originalPrice: 229.90,
    image: "/placeholder-default.svg",
    isNew: true,
    isPromotion: true,
    installments: "5x de R$ 35.98",
    brand: "Gang Boyz"
  },
  {
    id: "OFERTA004",
    name: "Boné Snapback",
    price: 79.90,
    originalPrice: 99.90,
    image: "/placeholder-default.svg",
    isNew: false,
    isPromotion: true,
    installments: "2x de R$ 39.95",
    brand: "Gang Boyz"
  }
]

// Categorias de demonstração
const demoCategories = [
  {
    id: "MOLETONS",
    name: "MOLETONS",
    icon: "/placeholder-logo.svg",
    products: [
      {
        id: "MOL001",
        name: "Moletom Hoodie Gang",
        price: 199.90,
        originalPrice: 249.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "6x de R$ 33.32",
        brand: "Gang Boyz"
      },
      {
        id: "MOL002",
        name: "Moletom Básico",
        price: 149.90,
        originalPrice: 199.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "5x de R$ 29.98",
        brand: "Gang Boyz"
      },
      {
        id: "MOL003",
        name: "Moletom Premium",
        price: 279.90,
        originalPrice: 349.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "8x de R$ 34.99",
        brand: "Gang Boyz"
      },
      {
        id: "MOL004",
        name: "Moletom Oversized",
        price: 229.90,
        originalPrice: 299.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "7x de R$ 32.84",
        brand: "Gang Boyz"
      }
    ]
  },
  {
    id: "CAMISETAS",
    name: "CAMISETAS",
    icon: "/placeholder-logo.svg",
    products: [
      {
        id: "CAM001",
        name: "Camiseta Básica Gang",
        price: 69.90,
        originalPrice: 99.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "2x de R$ 34.95",
        brand: "Gang Boyz"
      },
      {
        id: "CAM002",
        name: "Camiseta Oversized",
        price: 89.90,
        originalPrice: 129.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "3x de R$ 29.97",
        brand: "Gang Boyz"
      },
      {
        id: "CAM003",
        name: "Camiseta Manga Longa",
        price: 99.90,
        originalPrice: 139.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "3x de R$ 33.30",
        brand: "Gang Boyz"
      },
      {
        id: "CAM004",
        name: "Camiseta Estampada",
        price: 79.90,
        originalPrice: 119.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "2x de R$ 39.95",
        brand: "Gang Boyz"
      }
    ]
  },
  {
    id: "CALCAS",
    name: "CALÇAS",
    icon: "/placeholder-logo.svg",
    products: [
      {
        id: "CAL001",
        name: "Calça Cargo Street",
        price: 179.90,
        originalPrice: 229.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "5x de R$ 35.98",
        brand: "Gang Boyz"
      },
      {
        id: "CAL002",
        name: "Calça Jeans Oversized",
        price: 199.90,
        originalPrice: 279.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "6x de R$ 33.32",
        brand: "Gang Boyz"
      },
      {
        id: "CAL003",
        name: "Calça Básica",
        price: 149.90,
        originalPrice: 199.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "4x de R$ 37.48",
        brand: "Gang Boyz"
      },
      {
        id: "CAL004",
        name: "Calça Jogger",
        price: 159.90,
        originalPrice: 219.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "5x de R$ 31.98",
        brand: "Gang Boyz"
      }
    ]
  }
]

// Produtos HOT de demonstração
const demoHotProducts = [
  {
    id: "HOT001",
    name: "Jaqueta Oversized Premium",
    description: "Jaqueta streetwear com design exclusivo e tecido premium",
    price: 299.90,
    originalPrice: 399.90,
    image: "/placeholder-default.svg",
    category: "Jaquetas",
    isActive: true
  },
  {
    id: "HOT002", 
    name: "Moletom Hoodie Gang",
    description: "Moletom com logo bordado e capuz ajustável",
    price: 199.90,
    originalPrice: 249.90,
    image: "/placeholder-default.svg",
    category: "Moletons",
    isActive: true
  },
  {
    id: "HOT003",
    name: "Camiseta Oversized",
    description: "Camiseta confortável com design urbano",
    price: 89.90,
    originalPrice: 129.90,
    image: "/placeholder-default.svg",
    category: "Camisetas",
    isActive: true
  },
  {
    id: "HOT004",
    name: "Calça Cargo Street",
    description: "Calça cargo com bolsos funcionais",
    price: 179.90,
    originalPrice: 229.90,
    image: "/placeholder-default.svg",
    category: "Calças",
    isActive: true
  }
]

// Função para inicializar dados
function initHomepageData() {
  console.log("🚀 Inicializando dados da homepage...")
  
  // Salvar banners
  localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(demoBanners))
  console.log("✅ Banners inicializados")
  
  // Salvar produtos standalone (ofertas especiais)
  localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(demoStandaloneProducts))
  console.log("✅ Produtos de ofertas especiais inicializados")
  
  // Verificar se já existem categorias personalizadas antes de sobrescrever
  const existingCategories = localStorage.getItem("gang-boyz-categories")
  let shouldInitializeCategories = true
  
  if (existingCategories) {
    try {
      const parsedCategories = JSON.parse(existingCategories)
      // Verificar se as categorias já foram personalizadas
      const isCustomized = parsedCategories.some(cat => 
        cat.id !== cat.id.toUpperCase() || // IDs personalizados não estão em maiúsculo
        cat.description !== "" || // Categorias personalizadas podem ter descrições
        !cat.products // Categorias personalizadas podem não ter o array de produtos
      )
      
      if (isCustomized) {
        shouldInitializeCategories = false
        console.log("ℹ️ Categorias personalizadas detectadas, mantendo as existentes")
      }
    } catch (error) {
      console.warn("Erro ao verificar categorias existentes:", error)
    }
  }
  
  // Salvar categorias apenas se não foram personalizadas
  if (shouldInitializeCategories) {
    localStorage.setItem("gang-boyz-categories", JSON.stringify(demoCategories))
    console.log("✅ Categorias inicializadas")
  }
  
  // Salvar produtos HOT
  localStorage.setItem("gang-boyz-hot-products", JSON.stringify(demoHotProducts))
  console.log("✅ Produtos HOT inicializados")
  
  console.log("🎉 Homepage inicializada com sucesso!")
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  initHomepageData()
}

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initHomepageData,
    demoBanners,
    demoStandaloneProducts,
    demoCategories,
    demoHotProducts
  }
}


