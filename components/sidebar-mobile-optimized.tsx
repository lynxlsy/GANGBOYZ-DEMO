"use client"

import { useState, useEffect } from "react"
import { 
  X, 
  Home, 
  Search, 
  Heart, 
  User, 
  ShoppingCart, 
  ChevronRight, 
  ChevronDown,
  Flame,
  Menu
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { UserDropdown } from "@/components/user-dropdown"

interface SidebarMobileOptimizedProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarMobileOptimized({ isOpen, onClose }: SidebarMobileOptimizedProps) {
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const { state } = useCart()
  const { user } = useUser()

  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  const menuItems = [
    { label: "Camisetas", href: "/camisetas", icon: null, hasSubmenu: true, key: "camisetas" },
    { label: "Moletons", href: "/moletons", icon: null, hasSubmenu: true, key: "moletons" },
    { label: "Jaquetas", href: "/jaquetas", icon: null, hasSubmenu: true, key: "jaquetas" },
    { label: "Calças", href: "/calcas", icon: null, hasSubmenu: true, key: "calcas" },
    { label: "Shorts/Bermudas", href: "/shorts-bermudas", icon: null, hasSubmenu: true, key: "shorts" },
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
    onClose()
    setOpenDropdown(null)
  }

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

  // Fechar sidebar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay - Apenas Mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-[80] md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Sidebar - Apenas Mobile - Otimizada */}
      <div className="md:hidden fixed left-0 top-0 h-full w-full max-w-sm bg-black/95 backdrop-blur-md border-r border-white/20 z-[90] transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header da Sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <img
              src="/logo-gang-boyz-new.svg"
              alt="Gang BoyZ"
              className="h-auto w-[120px]"
            />
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors duration-200 group"
            >
              <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* Ações Rápidas - Layout Horizontal */}
          <div className="p-4 border-b border-white/10">
            <div className="grid grid-cols-2 gap-2">
              {/* Pesquisar */}
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="flex items-center justify-center space-x-2 px-3 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 group"
              >
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Pesquisar</span>
              </button>
              
              {/* Favoritos */}
              <button
                onClick={() => handleNavigation("/favoritos")}
                className="flex items-center justify-center space-x-2 px-3 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 group relative"
              >
                <Heart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Favoritos</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          {showSearchBar && (
            <div className="p-4 border-b border-white/10 animate-in slide-in-from-top duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
            </div>
          )}

          {/* Menu Items - Otimizado para Mobile */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {/* Botão Início */}
              <button
                onClick={() => handleNavigation("/")}
                className="w-full text-left px-4 py-4 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-3 group cursor-pointer"
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-base">Início</span>
              </button>
              
              {/* Categorias com Submenus */}
              {menuItems.map((item) => {
                const IconComponent = item.icon
                const isOpen = openDropdown === item.key
                
                if (item.hasSubmenu) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                        className={`w-full text-left px-4 py-4 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                          (item as any).isHot 
                            ? 'text-red-500 font-bold' 
                            : (item as any).isBlue
                            ? 'text-blue-500 font-bold'
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {IconComponent && (
                            <IconComponent className={`h-5 w-5 transition-colors duration-300 ${
                              (item as any).isHot 
                                ? 'text-red-500 group-hover:text-red-400' 
                                : (item as any).isBlue
                                ? 'text-blue-500 group-hover:text-blue-400'
                                : 'group-hover:text-yellow-400'
                            }`} />
                          )}
                          <span className="font-medium text-base">{item.label}</span>
                        </div>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                        ) : (
                          <ChevronRight className="h-4 w-4 transition-transform duration-300" />
                        )}
                      </button>
                      
                      {/* Submenu - Layout Otimizado */}
                      {isOpen && (
                        <div className="ml-2 mt-2 space-y-1 animate-in slide-in-from-top duration-200">
                          {submenus[item.key as keyof typeof submenus]?.map((subItem) => (
                            <button
                              key={subItem.label}
                              onClick={() => handleNavigation(subItem.href)}
                              className="w-full text-left px-4 py-3 text-white/90 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center group cursor-pointer border-l-2 border-transparent hover:border-blue-400"
                            >
                              <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full text-left px-4 py-4 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-3 group cursor-pointer ${
                      (item as any).isHot 
                        ? 'text-red-500 font-bold' 
                        : (item as any).isBlue
                        ? 'text-blue-500 font-bold'
                        : ''
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent className={`h-5 w-5 transition-colors duration-300 ${
                        (item as any).isHot 
                          ? 'text-red-500 group-hover:text-red-400' 
                          : (item as any).isBlue
                          ? 'text-blue-500 group-hover:text-blue-400'
                          : 'group-hover:text-yellow-400'
                      }`} />
                    )}
                    <span className="font-medium text-base">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Footer da Sidebar - Otimizado */}
          <div className="p-4 border-t border-white/20">
            <div className="space-y-3">
              {/* Usuário */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <UserDropdown />
                ) : (
                  <button
                    onClick={() => handleNavigation('/auth/signin')}
                    className="flex items-center space-x-3 px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 group cursor-pointer w-full"
                  >
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium text-base">Entrar</span>
                  </button>
                )}
              </div>

              {/* Carrinho */}
              <button
                onClick={() => handleNavigation('/cart')}
                className="flex items-center justify-between px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 group cursor-pointer w-full relative"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium text-base">Carrinho</span>
                </div>
                {cartItemsCount > 0 && (
                  <span className="bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



