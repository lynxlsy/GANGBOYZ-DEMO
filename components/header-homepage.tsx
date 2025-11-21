"use client"

import { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingCart, Sparkles, Flame, ChevronDown, Menu, X, Home, Bell, Truck } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { MobileLogoSection } from "@/components/mobile-logo-section"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useProductPage } from "@/hooks/use-product-page"
import { SearchBar } from "@/components/search-bar"
import { UserDropdown } from "@/components/user-dropdown"
import { useUser } from "@/lib/user-context"
import { getContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from '@/lib/editable-content-sync';
import { useEditMode } from "@/lib/edit-mode-context"
import MobileHeaderLiteral from "@/components/mobile-header-literal"

export function HeaderHomepage({ hideMobileHeader = false }: { hideMobileHeader?: boolean }) {
  const { state, openCart } = useCart()
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isBannerAtTop, setIsBannerAtTop] = useState(true)
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/5511999999999")
  const { isProductPage, isProductDetailPage } = useProductPage()
  const { user } = useUser()
  const { isEditMode, toggleEditMode } = useEditMode()
  
  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  const menuItems = [
    { label: "Camisetas", href: "/camisetas", icon: null, hasSubmenu: true, key: "camisetas" },
    { label: "Moletons", href: "/moletons", icon: null, hasSubmenu: true, key: "moletons" },
    { label: "Jaquetas", href: "/jaquetas", icon: null, hasSubmenu: true, key: "jaquetas" },
    { label: "Calças", href: "/calcas", icon: null, hasSubmenu: true, key: "calcas" },
    { label: "Shorts/Bermudas", href: "/shorts-bermudas", icon: null, hasSubmenu: true, key: "shorts" },
    { label: "Lançamentos", href: "/lancamentos", icon: Sparkles, isBlue: true },
    { label: "Em alta", href: "/em-alta", icon: Flame, isHot: true }
  ]

  const submenus = {
    camisetas: [
      { label: "Manga Longa", href: "/camisetas/manga-longa" },
      { label: "Manga Curta", href: "/camisetas/manga-curta" },
      { label: "Regata", href: "/camisetas/regata" },
      { label: "Tank Top", href: "/camisetas/tank-top" },
      { label: "Polo", href: "/camisetas/polo" },
      { label: "Básica", href: "/camisetas/basica" }
    ],
    moletons: [
      { label: "Com Capuz", href: "/moletons/com-capuz" },
      { label: "Sem Capuz", href: "/moletons/sem-capuz" },
      { label: "Zíper", href: "/moletons/ziper" }
    ],
    jaquetas: [
      { label: "Casual", href: "/jaquetas/casual" },
      { label: "Esportiva", href: "/jaquetas/esportiva" },
      { label: "Social", href: "/jaquetas/social" }
    ],
    calcas: [
      { label: "Jeans", href: "/calcas/jeans" },
      { label: "Moletom", href: "/calcas/moletom" },
      { label: "Social", href: "/calcas/social" }
    ],
    shorts: [
      { label: "Esportivo", href: "/shorts-bermudas/esportivo" },
      { label: "Casual", href: "/shorts-bermudas/casual" },
      { label: "Praia", href: "/shorts-bermudas/praia" }
    ]
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setOpenDropdown(null)
    setIsSidebarOpen(false)
  }

  // Detectar scroll para header fixo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Verificar se o banner está no topo
  useEffect(() => {
    const checkBannerPosition = () => {
      if (typeof window !== 'undefined') {
        const bannerAtTop = localStorage.getItem('gang-boyz-banner-at-top') === 'true'
        setIsBannerAtTop(bannerAtTop)
      }
    }

    // Verificar inicialmente
    checkBannerPosition()

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gang-boyz-banner-at-top') {
        setIsBannerAtTop(e.newValue === 'true')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Também verificar periodicamente para garantir sincronização
    const interval = setInterval(checkBannerPosition, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  // Fechar barra de pesquisa ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showSearchBar && !target.closest('.search-container')) {
        setShowSearchBar(false)
      }
    }

    if (showSearchBar) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSearchBar])

  // Fechar sidebar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
        setShowSearchBar(false)
        setOpenDropdown(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Firebase integration for WhatsApp link
  useEffect(() => {
    // Carregar link do WhatsApp do Firebase ou localStorage
    const loadWhatsAppLink = () => {
      if (typeof window !== 'undefined') {
        // Try Firebase first
        const firebaseContent = getContentById("whatsapp-link")
        if (firebaseContent) {
          setWhatsappLink(firebaseContent)
          return;
        }
        
        // Try localStorage as fallback
        const savedContacts = localStorage.getItem("gang-boyz-contacts")
        if (savedContacts) {
          try {
            const contacts = JSON.parse(savedContacts)
            const whatsappContact = contacts.find((contact: any) => contact.id === 'whatsapp')
            if (whatsappContact && whatsappContact.isActive) {
              setWhatsappLink(whatsappContact.url)
            }
          } catch (error) {
            console.error('Erro ao fazer parse dos contatos:', error)
          }
        }
      }
    }

    loadWhatsAppLink()

    // Firebase real-time listener for WhatsApp link
    const unsubscribeWhatsApp = editableContentSyncService.listenToContentChanges("whatsapp-link", (content) => {
      if (content) {
        setWhatsappLink(content)
        // Also save to localStorage for offline access
        const contacts = [{
          id: 'whatsapp',
          url: content,
          isActive: true
        }]
        localStorage.setItem("gang-boyz-contacts", JSON.stringify(contacts))
      }
    });

    return () => {
      // Clean up Firebase listener
      unsubscribeWhatsApp()
    }
  }, [])

  const handleWhatsApp = () => {
    window.open(whatsappLink, '_blank')
  }

  return (
    <>
      {/* Header Desktop - Otimizado */}
      <div className={`hidden md:block relative top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled && !isBannerAtTop ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isProductPage 
            ? 'px-[80px] py-4' 
            : 'px-[80px] py-6'
        }`}>
          
          {/* Logo - Responsivo */}
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center group"
            >
              <img
                src="/logo-gang-boyz-new.svg"
                alt="Gang BoyZ"
                className={`cursor-pointer transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? 'w-[200px]' : 'w-[230px]'
                }`}
              />
            </button>
          </div>

          {/* Menu Centralizado - Otimizado */}
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {/* Botão Início */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer text-white"
            >
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Início</span>
            </button>
            
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isOpen = openDropdown === item.key
              
              if (item.hasSubmenu) {
                return (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                      className={`flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer ${
                        item.isHot 
                          ? 'text-red-500 font-bold' 
                          : item.isBlue
                          ? 'text-blue-500 font-bold'
                          : 'text-white'
                      }`}
                      style={{ 
                        fontFamily: item.isHot 
                          ? 'Inter, Work Sans, sans-serif, cursive' 
                          : 'Inter, Work Sans, sans-serif' 
                      }}
                    >
                      <span className="hidden lg:inline">{item.label}</span>
                      <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Submenu Dropdown - Melhorado */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-2">
                          {submenus[item.key as keyof typeof submenus]?.map((subItem, index) => (
                            <button
                              key={subItem.label}
                              onClick={() => handleNavigation(subItem.href)}
                              className={`w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer transform translate-y-[-10px] opacity-0 animate-fadeInDown`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <span className="font-medium">{subItem.label}</span>
                              <div className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer ${
                    item.isHot 
                      ? 'text-red-500 font-bold' 
                      : item.isBlue
                      ? 'text-blue-500 font-bold'
                      : 'text-white'
                  }`}
                  style={{ 
                    fontFamily: item.isHot 
                      ? 'Inter, Work Sans, sans-serif, cursive' 
                      : 'Inter, Work Sans, sans-serif' 
                  }}
                >
                  {IconComponent && (
                    <IconComponent className={`h-5 w-5 transition-colors duration-300 ${
                      item.isHot 
                        ? 'text-red-500 group-hover:text-red-400' 
                        : item.isBlue
                        ? 'text-blue-500 group-hover:text-blue-400'
                        : 'group-hover:text-yellow-400'
                    }`} />
                  )}
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </nav>

          {/* Ícones - Direita - Otimizado */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Botão de Edit Mode - Apenas visível em telas maiores */}
            <button 
              onClick={toggleEditMode}
              className={`hidden md:flex items-center space-x-1 font-medium text-sm px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                isEditMode 
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                  : 'text-white hover:text-gray-300 hover:bg-white/10'
              }`}
              title={isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"}
            >
              <span className="hidden lg:inline">
                {isEditMode ? "Editar ON" : "Editar OFF"}
              </span>
              <span className="lg:hidden">
                {isEditMode ? "ON" : "OFF"}
              </span>
            </button>
            
            {/* Botão de Pesquisa */}
            <button 
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer search-container group"
              title="Pesquisar"
            >
              <Search className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
            
            {/* Usuário Logado ou Botão de Login */}
            {user ? (
              <UserDropdown />
            ) : (
              <button 
                onClick={() => handleNavigation('/auth/signin')}
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group"
                title="Entrar / Criar Conta"
              >
                <User className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
            
            {/* Favoritos */}
            <button 
              onClick={() => handleNavigation('/favoritos')}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group relative"
              title="Favoritos"
            >
              <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {/* Indicador de favoritos */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
            
            {/* Carrinho */}
            <button 
              onClick={openCart}
              className="relative text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group"
              title="Carrinho"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Desktop - Sempre visível na homepage abaixo do logo */}
        <div className="px-[80px] pb-4 search-container">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const searchQuery = formData.get('search') as string;
              if (searchQuery && searchQuery.trim()) {
                router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}>
              <div className="relative">
                <input
                  name="search"
                  type="text"
                  placeholder="Pesquisar produtos..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Header Mobile - Otimizado */}
      {!(hideMobileHeader || isProductDetailPage) && (
        <MobileHeaderLiteral 
          onMenuClick={() => setIsSidebarOpen(true)}
          openCart={openCart}
          handleNavigation={handleNavigation}
          handleWhatsApp={handleWhatsApp}
          user={user}
          cartItemsCount={cartItemsCount}
        />
      )}

      {/* Sidebar - Apenas Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    </>
  )
}