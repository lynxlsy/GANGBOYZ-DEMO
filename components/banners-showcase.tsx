"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, Play, Edit3, Save, Upload, Plus, X, Search, Trash2 } from "lucide-react"
import { BannerRenderer } from "@/components/banner-renderer"
import { AdminEditButton } from "@/components/admin-edit-button"
import { AdminEditModal } from "@/components/admin-edit-modal"
import { AdminProductModal } from "@/components/admin-product-modal"
import { getContentById, updateContentById, getContentByIdAsync } from "@/lib/editable-content-utils"
import { toast } from "sonner"

interface ShowcaseBanner {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  mediaType?: 'image' | 'video' | 'gif' | 'banner'
  link?: string
  buttonText: string
  overlayColor: string
}

// Interface para produtos em destaque removida conforme solicitado

// Add interface for editing banner texts
interface EditingBannerTexts {
  id: string
  title: string
  subtitle: string
  description: string
  buttonText: string
}

export function BannersShowcase({ isEditMode = false }: { isEditMode?: boolean }) {
  const [banners, setBanners] = useState<ShowcaseBanner[]>([])
  const [config, setConfig] = useState({
    title: "DESTAQUES DA TEMPORADA",
    description: "Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editableTitle, setEditableTitle] = useState("DESTAQUES DA TEMPORADA")
  const [editableDescription, setEditableDescription] = useState("Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano")
  const [editingTitle, setEditingTitle] = useState("")
  const [editingDescription, setEditingDescription] = useState("")
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null)
  const [editingBannerTexts, setEditingBannerTexts] = useState<EditingBannerTexts | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  // Add state for product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  // Add state for about section
  const [aboutTitle, setAboutTitle] = useState("Sobre a Gang Boyz")
  const [aboutDescription, setAboutDescription] = useState("A Gang Boyz é uma marca de streetwear brasileira que traz autenticidade, estilo e qualidade para as ruas. Representamos a cultura urbana com roupas que expressam a verdadeira essência da juventude brasileira.")
  const [editingAboutTitle, setEditingAboutTitle] = useState("")
  const [editingAboutDescription, setEditingAboutDescription] = useState("")
  const [isEditingAboutSection, setIsEditingAboutSection] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerContainerRef = useRef<HTMLDivElement>(null)

  // Carregar banners do localStorage
  useEffect(() => {
    const loadBanners = async () => {
      // Try to fetch banners from backend first
      try {
        const response = await fetch('/api/content?id=gang-boyz-showcase-banners');
        if (response.ok) {
          const data = await response.json();
          if (data['gang-boyz-showcase-banners']) {
            setBanners(JSON.parse(data['gang-boyz-showcase-banners']));
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching banners from backend:', error);
      }
      
      // Fallback to localStorage
      const savedBanners = localStorage.getItem("gang-boyz-showcase-banners");
      if (savedBanners) {
        setBanners(JSON.parse(savedBanners));
      } else {
        // Sem banners padrão - aguardando configuração pelo admin
        setBanners([]);
      }
    }

    // Função para carregar produtos de destaques da temporada removida

    // Carregar configuração do título e descrição editáveis
    const loadEditableConfig = async () => {
      // Carregar título
      const titleContent = await getContentByIdAsync("season-highlights-title");
      if (titleContent) {
        setEditableTitle(titleContent);
        setEditingTitle(titleContent);
      }
      
      // Carregar descrição
      const descriptionContent = await getContentByIdAsync("season-highlights-description");
      if (descriptionContent) {
        setEditableDescription(descriptionContent);
        setEditingDescription(descriptionContent);
      }
      
      // Carregar conteúdo da seção "Sobre a Gang Boyz"
      const aboutTitleContent = await getContentByIdAsync("about-gang-boyz-title");
      if (aboutTitleContent) {
        setAboutTitle(aboutTitleContent);
        setEditingAboutTitle(aboutTitleContent);
      }
      
      const aboutDescriptionContent = await getContentByIdAsync("about-gang-boyz-description");
      if (aboutDescriptionContent) {
        setAboutDescription(aboutDescriptionContent);
        setEditingAboutDescription(aboutDescriptionContent);
      }
    }

    // Função para recarregar todos os dados
    const loadAllData = async () => {
      await loadBanners();
      await loadEditableConfig();
    }

    // Carregar inicialmente
    loadAllData();

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-showcase-banners" || e.key === "gang-boyz-destaques-config") {
        // Removido console.log para evitar loop de logs
        loadAllData();
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleShowcaseBannersUpdated = () => {
      // Removido console.log para evitar loop de logs
      loadBanners();
    }

    // Função handleSeasonHighlightProductsUpdated removida

    const handleDestaquesConfigUpdated = () => {
      // Removido console.log para evitar loop de logs
      loadEditableConfig();
    }

    // Event listener for opening product edit modal
    const handleOpenProductEditModal = (e: CustomEvent) => {
      const product = e.detail;
      setCurrentProduct(product);
      setIsEditingProduct(!!product.id); // If product has id, we're editing, otherwise creating
      setIsProductModalOpen(true);
    };

    // Event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('showcaseBannersUpdated', handleShowcaseBannersUpdated);
    window.addEventListener('destaquesConfigUpdated', handleDestaquesConfigUpdated);
    window.addEventListener('editableContentsUpdated', handleDestaquesConfigUpdated);
    window.addEventListener('openProductEditModal', handleOpenProductEditModal as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('showcaseBannersUpdated', handleShowcaseBannersUpdated);
      window.removeEventListener('destaquesConfigUpdated', handleDestaquesConfigUpdated);
      window.removeEventListener('editableContentsUpdated', handleDestaquesConfigUpdated);
      window.removeEventListener('openProductEditModal', handleOpenProductEditModal as EventListener);
    }
  }, []);

  // Initialize scroll position for infinite scroll
  useEffect(() => {
    if (banners.length > 0 && bannerContainerRef.current) {
      // Set initial scroll position to the middle of the duplicated banners
      // This ensures we start with the first set of banners and have room to scroll in both directions
      const container = bannerContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const halfScrollWidth = scrollWidth / 2;
      // Start slightly offset to avoid edge cases
      container.scrollLeft = halfScrollWidth / 2 + 10;
    }
  }, [banners]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!bannerContainerRef.current || banners.length === 0) return;

    let autoScrollInterval: NodeJS.Timeout | null = null;
    let isUserScrolling = false;
    let scrollEndTimer: NodeJS.Timeout | null = null;
    
    // Function to handle auto scroll
    const autoScroll = () => {
      if (!isUserScrolling && bannerContainerRef.current) {
        const container = bannerContainerRef.current;
        const scrollAmount = 300; // Width of one banner card
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    };
    
    // Start auto scroll after 1 second
    const startAutoScroll = () => {
      autoScrollInterval = setInterval(autoScroll, 1000);
    };
    
    // Clear interval
    const clearAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };
    
    // Handle user scroll events - DISABLE auto-scroll completely on user interaction
    const handleUserScrollStart = () => {
      isUserScrolling = true;
      clearAutoScroll();
      
      // Clear existing timer
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = null;
      }
    };
    
    // DON'T restart auto-scroll after user interaction - keep it disabled
    const handleUserScrollEnd = () => {
      // Keep auto-scroll disabled permanently after user interaction
      isUserScrolling = true;
      clearAutoScroll();
    };
    
    // Add event listeners
    const container = bannerContainerRef.current;
    container.addEventListener('scroll', handleUserScrollStart);
    
    // Check if scrollend event is supported, if not use scroll with debounce
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', handleUserScrollEnd);
    } else {
      // Fallback: use scroll event with debounce
      let scrollTimer: NodeJS.Timeout;
      const handleScrollFallback = () => {
        handleUserScrollStart();
        clearTimeout(scrollTimer);
        // Don't restart auto-scroll even with fallback
        scrollTimer = setTimeout(handleUserScrollEnd, 100);
      };
      container.addEventListener('scroll', handleScrollFallback);
    }
    
    // Start auto scroll initially
    const initialStartTimer = setTimeout(startAutoScroll, 1000);
    
    // Clean up
    return () => {
      clearTimeout(initialStartTimer);
      clearAutoScroll();
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }
      container.removeEventListener('scroll', handleUserScrollStart);
      container.removeEventListener('scrollend', handleUserScrollEnd);
    };
  }, [banners]);

  // Throttle scroll handler for better performance
  const throttledHandleBannerScroll = useRef<(() => void) | null>(null);

  useEffect(() => {
    let ticking = false;
    
    const throttle = (func: () => void) => {
      return function() {
        if (!ticking) {
          requestAnimationFrame(() => {
            func();
            ticking = false;
          });
          ticking = true;
        }
      };
    };
    
    throttledHandleBannerScroll.current = throttle(handleBannerScroll);
  }, [banners]);

  // Handle infinite scroll by jumping between duplicate sets
  const handleBannerScroll = () => {
    if (bannerContainerRef.current && banners.length > 0) {
      const container = bannerContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const halfScrollWidth = scrollWidth / 2;
      
      // Infinite scroll - when we reach near the end, jump to the beginning
      // But only jump when we're actually at the edge to prevent jumping during normal scrolling
      if (scrollPosition >= scrollWidth - container.clientWidth - 10) {
        // At the end, jump to the beginning
        container.scrollLeft = scrollPosition - halfScrollWidth;
      } else if (scrollPosition <= 10) {
        // At the beginning, jump to the end
        container.scrollLeft = scrollPosition + halfScrollWidth;
      }
    }
  }

  const handleSaveConfig = () => {
    updateContentById("season-highlights-title", editingTitle);
    updateContentById("season-highlights-description", editingDescription);
    setEditableTitle(editingTitle);
    setEditableDescription(editingDescription);
    
    // Also save to backend
    try {
      fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'season-highlights-title', 
          content: editingTitle 
        }),
      });
      
      fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'season-highlights-description', 
          content: editingDescription 
        }),
      });
    } catch (error) {
      console.error('Error saving to backend:', error);
    }
    
    toast.success("O título e descrição da seção foram atualizados com sucesso.");
  }

  const handleCancelEdit = () => {
    setEditingTitle(editableTitle)
    setEditingDescription(editableDescription)
  }

  // Function to start editing about section
  const handleEditAboutSection = () => {
    setEditingAboutTitle(aboutTitle)
    setEditingAboutDescription(aboutDescription)
    setIsEditingAboutSection(true)
  }

  // Function to save about section edits
  const handleSaveAboutSection = () => {
    // Save to state
    setAboutTitle(editingAboutTitle)
    setAboutDescription(editingAboutDescription)
    
    // Save to localStorage/backend
    updateContentById("about-gang-boyz-title", editingAboutTitle);
    updateContentById("about-gang-boyz-description", editingAboutDescription);
    
    // Also save to backend
    try {
      fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'about-gang-boyz-title', 
          content: editingAboutTitle 
        }),
      });
      
      fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'about-gang-boyz-description', 
          content: editingAboutDescription 
        }),
      });
    } catch (error) {
      console.error('Error saving about section to backend:', error);
    }
    
    setIsEditingAboutSection(false)
    toast.success("Seção 'Sobre a Gang Boyz' atualizada com sucesso.");
  }

  // Function to cancel about section edit
  const handleCancelAboutSection = () => {
    setEditingAboutTitle(aboutTitle)
    setEditingAboutDescription(aboutDescription)
    setIsEditingAboutSection(false)
  }

  // Function to start editing banner texts
  const handleEditBannerTexts = (banner: ShowcaseBanner) => {
    setEditingBannerTexts({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      buttonText: banner.buttonText
    })
  }

  // Function to save banner text edits
  const handleSaveBannerTexts = () => {
    if (!editingBannerTexts) return

    const updatedBanners = banners.map(banner => 
      banner.id === editingBannerTexts.id 
        ? { 
            ...banner, 
            title: editingBannerTexts.title,
            subtitle: editingBannerTexts.subtitle,
            description: editingBannerTexts.description,
            buttonText: editingBannerTexts.buttonText
          }
        : banner
    )

    setBanners(updatedBanners)
    localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners))
    
    // Also save to backend
    try {
      fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-showcase-banners', 
          content: JSON.stringify(updatedBanners) 
        }),
      });
    } catch (error) {
      console.error('Error saving banners to backend:', error);
    }
    
    setEditingBannerTexts(null)
    window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'))
    toast.success("Textos do banner atualizados com sucesso!")
  }

  // Function to save a hot product
  const handleSaveHotProduct = async (product: any) => {
    // For hot products, we save to the "gang-boyz-hot-products" localStorage item
    const existingProducts = localStorage.getItem("gang-boyz-hot-products");
    let productsArray: any[] = [];
    
    if (existingProducts) {
      productsArray = JSON.parse(existingProducts);
    }
    
    // Generate ID if needed
    const productId = product.id || `hot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create product object with correct structure for hot products
    const hotProduct = {
      id: productId,
      name: product.name,
      description: product.description || `${product.name} - Cor: ${product.color}`,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      category: product.category || "Em Alta",
      isActive: product.isActive !== undefined ? product.isActive : true
    };
    
    // Check if we're updating an existing product or adding a new one
    const existingIndex = productsArray.findIndex((p: any) => p.id === productId);
    
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
      if (product.recommendationCategory && product.recommendationSubcategory) {
        // Calculate total stock from size quantities
        const sizeQuantities = product.sizeQuantities || {}
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
        
        const subcategoryKey = subcategoryNameToKeyMap[product.recommendationSubcategory] || product.recommendationSubcategory || "em-alta";
        
        // Create admin product object with proper structure
        const adminProduct = {
          id: productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          color: product.color || "Preto",
          category: product.recommendationCategory || "Em Alta",
          subcategory: subcategoryKey, // Use the mapped key
          categories: [product.recommendationCategory || "Em Alta", subcategoryKey], // Add categories array
          // Recommendation fields
          availableUnits: totalUnits,
          availableSizes: product.availableSizes || ["P", "M", "G", "GG"],
          sizeQuantities: Object.entries(sizeQuantities).reduce((acc, [size, qty]) => {
            acc[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0
            return acc
          }, {} as Record<string, number>),
          recommendationCategory: product.recommendationCategory,
          recommendationSubcategory: product.recommendationSubcategory,
          // Highlighting fields - only set destacarEmAlta to true for hot products
          destacarEmRecomendacoes: product.destacarEmRecomendacoes || false,
          destacarEmOfertas: product.destacarEmOfertas || false,
          destacarEmAlta: true, // Always true for hot products
          destacarLancamentos: product.destacarLancamentos || false,
          // Product info fields
          description: product.description || "",
          freeShippingText: product.freeShippingText || "Frete Grátis",
          freeShippingThreshold: product.freeShippingThreshold || "Acima de R$ 200",
          pickupText: product.pickupText || "Retire na Loja",
          pickupStatus: product.pickupStatus || "Disponível",
          material: product.material || "100% Algodão",
          weight: product.weight || "300g",
          dimensions: product.dimensions || "70cm x 50cm",
          origin: product.origin || "Brasil",
          care: product.care || "Lavar à mão, não alvejar",
          warranty: product.warranty || "90 dias contra defeitos",
          // Stock fields
          stock: totalUnits,
          sizeStock: Object.entries(sizeQuantities).reduce((acc, [size, qty]) => {
            acc[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0
            return acc
          }, {} as Record<string, number>),
          // Status field for active products
          status: "ativo"
        }
        
        // Save to admin products (gang-boyz-test-products)
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
        
        // Also save to dev products for consistency
        const existingDevProducts = localStorage.getItem("gang-boyz-dev-products");
        let devProductsArray: any[] = [];
        
        if (existingDevProducts) {
          devProductsArray = JSON.parse(existingDevProducts);
        }
        
        // Check if we're updating an existing dev product or adding a new one
        const devIndex = devProductsArray.findIndex((p: any) => p.id === productId);
        
        if (devIndex !== -1) {
          // Update existing dev product
          devProductsArray[devIndex] = adminProduct;
        } else {
          // Add new dev product
          devProductsArray.push(adminProduct);
        }
        
        localStorage.setItem("gang-boyz-dev-products", JSON.stringify(devProductsArray));
        
        // Dispatch events to force reload products in all pages
        window.dispatchEvent(new CustomEvent('forceProductsReload'))
        window.dispatchEvent(new CustomEvent('testProductCreated'))
      }
      
      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
      
      toast.success("Produto salvo localmente! A alteração será sincronizada quando a conexão for restabelecida.")
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      toast.error("Erro ao salvar produto")
      return
    }
    
    // Close modal
    setIsProductModalOpen(false)
  }

  // Function to cancel banner text editing
  const handleCancelBannerTexts = () => {
    setEditingBannerTexts(null)
  }

  // Function to delete a banner
  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = banners.filter(banner => banner.id !== bannerId);
    setBanners(updatedBanners);
    localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners));
    
    // Also save to backend
    try {
      fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-showcase-banners', 
          content: JSON.stringify(updatedBanners) 
        }),
      });
    } catch (error) {
      console.error('Error saving banners to backend:', error);
    }
    
    window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'));
    toast.success("Destaque removido com sucesso!");
  }

  // Funções de produtos removidas conforme solicitado

  // Function to generate a page for a new highlight
  const generateHighlightPage = (title: string) => {
    // Generate a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
    
    // Create the page content using the same pattern as explore pages
    const pageContent = `// Generated page for "${title}"
"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { generateDynamicCategoryConfig } from "@/lib/dynamic-category-generator"
import { useMemo } from "react"

export default function ${title.replace(/\s+/g, '')}Page() {
  // Generate dynamic config for this category
  const config = useMemo(() => {
    return generateDynamicCategoryConfig("${title}", "${slug}")
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="${slug}" />
    </div>
  )
}

`
    return { slug, pageContent }
  }

  const handleEditBannerImage = (bannerId: string) => {
    setEditingBannerId(bannerId)
    setShowUploadModal(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingBannerId) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo permitido: 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Apenas arquivos de imagem são permitidos")
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const { url } = await response.json()
      
      // Update the banner image
      const updatedBanners = banners.map(banner => 
        banner.id === editingBannerId 
          ? { ...banner, image: url } 
          : banner
      )
      
      setBanners(updatedBanners)
      localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners))
      window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'))
      
      toast.success("Imagem atualizada com sucesso!")
      setShowUploadModal(false)
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro ao fazer upload da imagem")
    } finally {
      setUploading(false)
      setEditingBannerId(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <section className="py-16 bg-black relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editar Imagem do Banner
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Enviando..." : "Selecionar Imagem"}
              </Button>
              
              <Button
                onClick={() => setShowUploadModal(false)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 relative">
          {isEditMode ? (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Input
                  value={editingTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                  className="text-3xl font-black text-white text-center bg-gray-800 border-gray-600"
                />
                <Edit3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <Button onClick={handleSaveConfig} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
                  Cancelar
                </Button>
              </div>
              <div className="mt-4">
                <Textarea
                  value={editingDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingDescription(e.target.value)}
                  className="text-gray-200 text-lg max-w-2xl mx-auto bg-gray-800 border-gray-600"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-white mb-4">
                {editableTitle}
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                {editableDescription}
              </p>
            </>
          )}
          {/* Add Edit and Add Banner buttons for the section */}
          {isEditMode && (
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => {
                  // Switch to edit mode for the section title and description
                  const titleInput = document.querySelector('input[value="' + editableTitle + '"]') as HTMLInputElement;
                  if (titleInput) {
                    titleInput.focus();
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
              >
                <Edit3 className="h-5 w-5" />
                Editar Seção
              </Button>
              <Button
                onClick={() => {
                  // Create a new banner with default values
                  const bannerId = 'banner-' + Date.now()
                  const defaultTitle = "Novo Destaque"
                  
                  // Generate a slug for the new page
                  const slug = defaultTitle
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                  
                  const newBanner: ShowcaseBanner = {
                    id: bannerId,
                    title: defaultTitle,
                    subtitle: "Subtítulo",
                    description: "Descrição do novo destaque da temporada",
                    image: "/placeholder-default.svg",
                    link: '/explore/' + slug, // Link to the dynamic explore page
                    buttonText: "EXPLORAR",
                    overlayColor: "from-black"
                  }
                  
                  // Add the new banner to the list
                  const updatedBanners = [...banners, newBanner]
                  setBanners(updatedBanners)
                  localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners))
                  
                  // Also save to backend
                  try {
                    fetch('/api/content', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 
                        id: 'gang-boyz-showcase-banners', 
                        content: JSON.stringify(updatedBanners) 
                      }),
                    });
                  } catch (error) {
                    console.error('Error saving banners to backend:', error);
                  }
                  
                  window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'))
                  toast.success("Novo banner adicionado com sucesso! A página será acessível via o link do banner.")
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Adicionar Banner
              </Button>
            </div>
          )}
        </div>

        {/* Product Cards Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Produtos em Destaque</h3>
            {isEditMode && (
              <div className="flex gap-2">
                {/* Hidden button - Adicionar Produto */}
                {/*
                <Button 
                  onClick={() => {
                    // Create a default product for the modal with proper ID
                    const defaultProduct = {
                      id: 'hot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
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
                      isActive: true,
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
                    }
                    
                    // Emit event to open the product modal with the default product
                    window.dispatchEvent(new CustomEvent('openProductEditModal', {
                      detail: defaultProduct
                    }))
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar Produto
                </Button>
                */}
                
                {/* New button to add a new banner card */}
                <Button
                  onClick={() => {
                    // Create a new banner with default values
                    const bannerId = 'banner-' + Date.now()
                    const defaultTitle = "Novo Destaque"
                    
                    // Generate a slug for the new page
                    const slug = defaultTitle
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w\-]+/g, '')
                    
                    const newBanner: ShowcaseBanner = {
                      id: bannerId,
                      title: defaultTitle,
                      subtitle: "Subtítulo",
                      description: "Descrição do novo destaque da temporada",
                      image: "/placeholder-default.svg",
                      link: '/explore/' + slug, // Link to the dynamic explore page
                      buttonText: "EXPLORAR",
                      overlayColor: "from-black"
                    }
                    
                    // Add the new banner to the list
                    const updatedBanners = [...banners, newBanner]
                    setBanners(updatedBanners)
                    localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners))
                    
                    // Also save to backend
                    try {
                      fetch('/api/content', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                          id: 'gang-boyz-showcase-banners', 
                          content: JSON.stringify(updatedBanners) 
                        }),
                      });
                    } catch (error) {
                      console.error('Error saving banners to backend:', error);
                    }
                    
                    window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'))
                    toast.success("Novo banner adicionado com sucesso! A página será acessível via o link do banner.")
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar Banner
                </Button>
              </div>
            )}
          </div>
          
          {/* Product Cards Grid - Removido conforme solicitado */}
          <div className="hidden"></div>
        </div>

        {/* Product Search Modal - Removido conforme solicitado */}

        <div 
          ref={bannerContainerRef}
          className="flex overflow-x-auto pb-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:block md:overflow-visible md:mx-0 md:px-0" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          onScroll={throttledHandleBannerScroll.current || handleBannerScroll}
        >
          <style jsx>{'.flex::-webkit-scrollbar {display: none;}'}</style>
          {/* Duplicate banners for infinite scroll effect */}
          {[...banners, ...banners].map((banner, index) => (
            <div
              key={banner.id + '-' + index}
              className="relative h-[400px] overflow-hidden group cursor-pointer bg-gray-900 rounded-lg flex-shrink-0 w-[300px] md:w-auto"
              onClick={() => {
                if (isEditMode) {
                  handleEditBannerImage(banner.id)
                } else if (banner.link) {
                  window.location.href = banner.link
                }
              }}
            >
              {/* Background Media */}
              <div className="absolute inset-0">
                {banner.mediaType === 'video' ? (
                  <video
                    src={banner.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : banner.mediaType === 'banner' ? (
                  <BannerRenderer
                    bannerId={banner.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              </div>
              
              {/* Edit overlay for individual banner */}
              {isEditMode && (
                <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-yellow-400 text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Editar Imagem</span>
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">
                    {banner.title}
                  </h3>
                  <p className="text-gray-200 font-semibold mb-1">
                    {banner.subtitle}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {banner.description}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="w-fit bg-white text-black hover:bg-gray-200 font-bold px-4 py-2 shadow-lg transition-all duration-300"
                >
                  {banner.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                {/* Edit text button for individual banner in edit mode */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditBannerTexts(banner)
                    }}
                    className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
                
                {/* Delete button for individual banner in edit mode */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm('Tem certeza que deseja excluir este destaque?')) {
                        handleDeleteBanner(banner.id)
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add new banner card in edit mode */}
          {isEditMode && (
            <div
              className="hidden relative h-[400px] overflow-hidden group cursor-pointer bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center flex-shrink-0 w-[300px] md:w-auto"
              onClick={() => {
                // Create a new banner with default values
                const bannerId = 'banner-' + Date.now()
                const defaultTitle = "Novo Destaque"
                
                // Generate a slug for the new page
                const slug = defaultTitle
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\-]+/g, '')
                
                const newBanner: ShowcaseBanner = {
                  id: bannerId,
                  title: defaultTitle,
                  subtitle: "Subtítulo",
                  description: "Descrição do novo destaque da temporada",
                  image: "/placeholder-default.svg",
                  link: '/explore/' + slug, // Link to the dynamic explore page
                  buttonText: "EXPLORAR",
                  overlayColor: "from-black"
                }
                
                // Add the new banner to the list
                const updatedBanners = [...banners, newBanner]
                setBanners(updatedBanners)
                localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners))
                
                // Also save to backend
                try {
                  fetch('/api/content', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                      id: 'gang-boyz-showcase-banners', 
                      content: JSON.stringify(updatedBanners) 
                    }),
                  });
                } catch (error) {
                  console.error('Error saving banners to backend:', error);
                }
                
                window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'))
                toast.success("Novo banner adicionado com sucesso! A página será acessível via o link do banner.")
              }}
            >
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">Novo Destaque</h3>
                  <p className="text-gray-200 font-semibold mb-1">Subtítulo</p>
                  <p className="text-gray-300 text-sm leading-relaxed">Descrição do novo destaque da temporada</p>
                </div>
                <button data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 has-[>svg]:px-2.5 w-fit bg-white text-black hover:bg-gray-200 font-bold px-4 py-2 shadow-lg transition-all duration-300">
                  EXPLORAR
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right ml-2 h-4 w-4">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Plus className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Adicionar Destaque</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      

      
      {/* Banner Text Editing Modal */}
      {editingBannerTexts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editar Textos do Banner
              </h3>
              <button 
                onClick={handleCancelBannerTexts}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-1 block">Título</Label>
                <Input
                  value={editingBannerTexts.title}
                  onChange={(e) => setEditingBannerTexts({...editingBannerTexts, title: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-1 block">Subtítulo</Label>
                <Input
                  value={editingBannerTexts.subtitle}
                  onChange={(e) => setEditingBannerTexts({...editingBannerTexts, subtitle: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-1 block">Descrição</Label>
                <Textarea
                  value={editingBannerTexts.description}
                  onChange={(e) => setEditingBannerTexts({...editingBannerTexts, description: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-1 block">Texto do Botão</Label>
                <Input
                  value={editingBannerTexts.buttonText}
                  onChange={(e) => setEditingBannerTexts({...editingBannerTexts, buttonText: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={handleCancelBannerTexts}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveBannerTexts}
                className="bg-green-600 hover:bg-green-700"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Modal */}
      {isProductModalOpen && (
        <AdminProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          product={currentProduct}
          onSave={handleSaveHotProduct}
          title="Produtos em Destaque"
          subcategory="em-alta"
          mode={isEditingProduct ? "edit" : "create"}
        />
      )}
    </section>
  )
}
