"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Sparkles, Flame, X, Home, Search, User, Heart, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { UserDropdown } from "@/components/user-dropdown"
import { useUnifiedSearch, SearchResult } from "@/lib/unified-id-system"
import { useTheme } from "@/lib/theme-context"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const { state, openCart } = useCart()
  const { user } = useUser()
  const { activeTheme } = useTheme()

  const { search, refreshCache } = useUnifiedSearch()

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
    onClose()
    setOpenDropdown(null)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Close the sidebar and navigate to search results page
      onClose()
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Perform search if query is long enough
    if (value.trim().length >= 2) {
      const results = search(value, 3) // Limit to 3 results
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  // Close sidebar when pressing ESC
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

  return (
    <>
      {/* Overlay - Apenas Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Apenas Mobile - Só renderiza quando aberta */}
      {isOpen && (
        <div className="md:hidden fixed left-0 top-0 h-full w-80 bg-black/95 backdrop-blur-md border-r border-white/20 z-[9999] transform transition-transform duration-300 ease-in-out translate-x-0 animate-in slide-in-from-left duration-300">
          <div className="flex flex-col h-full">
            {/* Header da Sidebar */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex-1 flex justify-center">
                <img
                  src="/logo-gang-boyz-new.svg"
                  alt="Gang BoyZ"
                  className="h-auto w-[120px]"
                />
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors duration-200 group touch-manipulation"
              >
                <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>

            {/* Ações Rápidas */}
            <div className="p-4 border-b border-white/10">
              <div className="grid grid-cols-2 gap-2">
                {/* Pesquisar */}
                <button
                  onClick={() => {
                    setShowSearchBar(!showSearchBar)
                    setSearchResults([])
                  }}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 group touch-manipulation"
                >
                  <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium">Pesquisar</span>
                </button>
                
                {/* Favoritos */}
                <button
                  onClick={() => handleNavigation("/favoritos")}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 group relative touch-manipulation"
                >
                  <Heart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium">Favoritos</span>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>
            </div>

            {/* Barra de Pesquisa */}
            {showSearchBar && (
              <div className="p-4 border-b border-white/10">
                <div className="relative animate-in fade-in zoom-in-95 duration-200 ease-out">
                  <div className="relative">
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Pesquisar produtos..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 touch-manipulation backdrop-blur-sm"
                        style={{ 
                          borderColor: 'var(--primary-color)',
                          boxShadow: activeTheme === 'vibrant-red' 
                            ? '0 0 0 1px var(--primary-color), 0 0 0 3px rgba(255, 23, 68, 0.2)' 
                            : '0 0 0 1px var(--primary-color), 0 0 0 3px rgba(139, 0, 0, 0.2)'
                        }}
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </form>
                  </div>
                  
                  {/* Search Results Preview */}
                  {searchQuery.trim().length >= 2 && searchResults.length > 0 && (
                    <div className="mt-2 bg-black border border-white/10 rounded-lg overflow-hidden">
                      {searchResults.map((result) => (
                        <div 
                          key={result.id}
                          className="p-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            if (result.type === 'product') {
                              router.push(`/produto/${result.id}`)
                            } else if (result.type === 'category') {
                              // Handle category navigation to the main category pages
                              const categoryPath = result.id.toLowerCase();
                              // Map category IDs to their proper paths
                              const categoryPaths: Record<string, string> = {
                                'camisetas': '/camisetas',
                                'moletons': '/moletons',
                                'jaquetas': '/jaquetas',
                                'calcas': '/calcas',
                                'shorts': '/shorts-bermudas'
                              };
                              
                              const path = categoryPaths[categoryPath] || `/explore/${categoryPath}`;
                              router.push(path);
                            } else {
                              router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
                            }
                            onClose()
                            setSearchQuery("")
                            setSearchResults([])
                            setShowSearchBar(false)
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-white text-sm font-medium truncate">{result.name}</h4>
                                  {result.type === 'category' && (
                                    <span 
                                      className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wider"
                                      style={{ backgroundColor: 'var(--primary-color)' }}
                                    >
                                      Categoria
                                    </span>
                                  )}
                                </div>
                                {result.productCount !== undefined && result.productCount > 0 && (
                                  <span className="text-gray-400 text-xs bg-gray-800 rounded-full px-2 py-0.5">
                                    {result.productCount}
                                  </span>
                                )}
                              </div>
                              {/* Show category only if it's a product result and has a valid category value */}
                              {result.type === 'product' && 
                               result.category && 
                               typeof result.category === 'string' &&
                               result.category.trim() !== '' &&
                               result.category.trim() !== '0' &&
                               isNaN(Number(result.category.trim())) && (
                                <p className="text-gray-400 text-xs truncate">
                                  {result.category}
                                </p>
                              )}
                              {result.price && result.price > 0 && (
                                <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                                  R$ {result.price.toFixed(2).replace('.', ',')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="p-2 bg-black/50 text-center">
                        <button 
                          className="text-xs font-medium hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--primary-color)' }}
                          onClick={() => {
                            router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
                            onClose()
                            setSearchQuery("")
                            setSearchResults([])
                            setShowSearchBar(false)
                          }}
                        >
                          Ver todos os resultados
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                    <div className="mt-2 bg-black border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Nenhum resultado encontrado</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                {/* Botão Início */}
                <button
                  onClick={() => handleNavigation("/")}
                  className="w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-3 group cursor-pointer touch-manipulation"
                >
                  <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Início</span>
                </button>
                
                {menuItems.map((item) => {
                  const IconComponent = item.icon
                  const isOpen = openDropdown === item.key
                
                  if (item.hasSubmenu) {
                    return (
                      <div key={item.label} className="overflow-hidden">
                        <button
                          onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                          className={`w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer touch-manipulation ${
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
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {/* Submenu - Animação melhorada para expandir de dentro da categoria */}
                        <div 
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top duration-200">
                            {submenus[item.key as keyof typeof submenus]?.map((subItem) => (
                              <button
                                key={subItem.label}
                                onClick={() => handleNavigation(subItem.href)}
                                className="w-full text-left px-4 py-2 text-white/80 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center group cursor-pointer touch-manipulation"
                              >
                                <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">{subItem.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  }
                
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-3 group cursor-pointer touch-manipulation ${
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
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Footer da Sidebar */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                {/* Usuário */}
                <div className="flex items-center space-x-3">
                  {user ? (
                    <div className="touch-manipulation">
                      <UserDropdown />
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleNavigation('/auth/signin')}
                      className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200 group touch-manipulation"
                    >
                      <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm font-medium">Entrar</span>
                    </button>
                  )}
                </div>
                
                {/* Carrinho */}
                <button 
                  onClick={openCart}
                  className="relative flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200 group touch-manipulation"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium">Carrinho</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse touch-manipulation">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}