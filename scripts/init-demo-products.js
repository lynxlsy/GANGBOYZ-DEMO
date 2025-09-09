// Script para inicializar produtos demonstrativos
// Executa diretamente no navegador via console

const demoHotProducts = [
  {
    id: "HOT001",
    name: "Jaqueta Oversized Premium",
    description: "Jaqueta streetwear com design exclusivo e tecido premium",
    price: 299.90,
    originalPrice: 399.90,
    image: "/black-oversized-streetwear-jacket.jpg",
    category: "Jaquetas",
    isActive: true
  },
  {
    id: "HOT002", 
    name: "Moletom Hoodie Gang",
    description: "Moletom com logo bordado e capuz ajustável",
    price: 199.90,
    originalPrice: 249.90,
    image: "/black-streetwear-hoodie-with-white-logo.jpg",
    category: "Moletons",
    isActive: true
  },
  {
    id: "HOT003",
    name: "Camiseta Graphic Design",
    description: "Camiseta com estampa neon e design urbano",
    price: 89.90,
    originalPrice: 129.90,
    image: "/black-t-shirt-with-neon-graphic-design.jpg",
    category: "Camisetas",
    isActive: true
  },
  {
    id: "HOT004",
    name: "Calça Cargo Street",
    description: "Calça cargo com bolsos laterais e corte moderno",
    price: 179.90,
    originalPrice: 229.90,
    image: "/black-cargo-streetwear.png",
    category: "Calças",
    isActive: true
  },
  {
    id: "HOT005",
    name: "Boné Snapback Gang",
    description: "Boné ajustável com logo bordado em branco",
    price: 79.90,
    originalPrice: 99.90,
    image: "/black-snapback-cap-with-white-embroidery.jpg",
    category: "Acessórios",
    isActive: true
  },
  {
    id: "HOT006",
    name: "Colar de Corrente Prata",
    description: "Colar de corrente prata com design minimalista",
    price: 149.90,
    originalPrice: 199.90,
    image: "/silver-chain-necklace-streetwear-accessory.jpg",
    category: "Acessórios",
    isActive: true
  }
];

const demoStandaloneProducts = [
  {
    id: "OFFER001",
    name: "Kit Completo Streetwear",
    description: "Jaqueta + Calça + Camiseta",
    price: 499.90,
    originalPrice: 699.90,
    image: "/black-oversized-streetwear-jacket.jpg",
    isNew: true,
    isPromotion: true,
    installments: "12x de R$ 41,66",
    brand: "Gang Boyz"
  },
  {
    id: "OFFER002",
    name: "Moletom Premium Collection",
    description: "Moletom com acabamento premium",
    price: 229.90,
    originalPrice: 299.90,
    image: "/black-streetwear-hoodie-with-white-logo.jpg",
    isNew: false,
    isPromotion: true,
    installments: "6x de R$ 38,32",
    brand: "Gang Boyz"
  },
  {
    id: "OFFER003",
    name: "Camiseta Limited Edition",
    description: "Edição limitada com design exclusivo",
    price: 119.90,
    originalPrice: 159.90,
    image: "/black-t-shirt-with-neon-graphic-design.jpg",
    isNew: true,
    isPromotion: false,
    installments: "3x de R$ 39,97",
    brand: "Gang Boyz"
  },
  {
    id: "OFFER004",
    name: "Calça Cargo Tactical",
    description: "Calça cargo com tecnologia tática",
    price: 199.90,
    originalPrice: 279.90,
    image: "/black-cargo-streetwear.png",
    isNew: false,
    isPromotion: true,
    installments: "8x de R$ 24,99",
    brand: "Gang Boyz"
  }
];

const demoCategories = [
  {
    id: "cat001",
    name: "Jaquetas",
    icon: "🧥",
    products: [
      {
        id: "JACKET001",
        name: "Jaqueta Bomber Premium",
        price: 349.90,
        originalPrice: 449.90,
        image: "/black-oversized-streetwear-jacket.jpg",
        isNew: true,
        isPromotion: true,
        installments: "10x de R$ 34,99",
        brand: "Gang Boyz"
      },
      {
        id: "JACKET002",
        name: "Jaqueta Oversized Street",
        price: 299.90,
        originalPrice: 399.90,
        image: "/black-oversized-streetwear-jacket.jpg",
        isNew: false,
        isPromotion: true,
        installments: "8x de R$ 37,49",
        brand: "Gang Boyz"
      }
    ]
  },
  {
    id: "cat002",
    name: "Moletons",
    icon: "👕",
    products: [
      {
        id: "HOODIE001",
        name: "Moletom Hoodie Gang",
        price: 199.90,
        originalPrice: 249.90,
        image: "/black-streetwear-hoodie-with-white-logo.jpg",
        isNew: true,
        isPromotion: true,
        installments: "6x de R$ 33,32",
        brand: "Gang Boyz"
      }
    ]
  },
  {
    id: "cat003",
    name: "Camisetas",
    icon: "👔",
    products: [
      {
        id: "TSHIRT001",
        name: "Camiseta Graphic Neon",
        price: 89.90,
        originalPrice: 129.90,
        image: "/black-t-shirt-with-neon-graphic-design.jpg",
        isNew: true,
        isPromotion: true,
        installments: "3x de R$ 29,97",
        brand: "Gang Boyz"
      }
    ]
  },
  {
    id: "cat004",
    name: "Calças",
    icon: "👖",
    products: [
      {
        id: "PANTS001",
        name: "Calça Cargo Street",
        price: 179.90,
        originalPrice: 229.90,
        image: "/black-cargo-streetwear.png",
        isNew: false,
        isPromotion: true,
        installments: "5x de R$ 35,98",
        brand: "Gang Boyz"
      }
    ]
  }
];

// Função para inicializar produtos demonstrativos
function initializeDemoProducts() {
  console.log("🚀 Inicializando produtos demonstrativos...");
  
  // Adicionar produtos HOT
  localStorage.setItem("gang-boyz-hot-products", JSON.stringify(demoHotProducts));
  console.log("✅ Produtos HOT adicionados:", demoHotProducts.length);
  
  // Adicionar produtos avulsos
  localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(demoStandaloneProducts));
  console.log("✅ Produtos avulsos adicionados:", demoStandaloneProducts.length);
  
  // Adicionar categorias
  localStorage.setItem("gang-boyz-categories", JSON.stringify(demoCategories));
  console.log("✅ Categorias adicionadas:", demoCategories.length);
  
  // Disparar eventos para atualizar as seções
  window.dispatchEvent(new CustomEvent('hotProductsUpdated'));
  window.dispatchEvent(new CustomEvent('productsUpdated'));
  
  console.log("🎉 Produtos demonstrativos inicializados com sucesso!");
  console.log("📱 Acesse a homepage para ver os produtos nas seções:");
  console.log("   • PRODUTOS EM DESTAQUE (seção HOT)");
  console.log("   • OFERTAS ESPECIAIS");
  console.log("   • Categorias");
  
  return true;
}

// Executar inicialização
initializeDemoProducts();



