"use client"

import { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingCart, Sparkles, Flame, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { state } = useCart()
  const router = useRouter()
  const [isCamisetasOpen, setIsCamisetasOpen] = useState(false)
  const [bannerText, setBannerText] = useState("SITE DEMONSTRATIVO")
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [bannerEmoji, setBannerEmoji] = useState("")
  const [bannerBgColor, setBannerBgColor] = useState("black")

  // Carregar configurações da faixa
  useEffect(() => {
    const loadBannerSettings = () => {
      const savedText = localStorage.getItem("gang-boyz-banner-text")
      const savedActive = localStorage.getItem("gang-boyz-banner-active")
      const savedEmoji = localStorage.getItem("gang-boyz-banner-emoji")
      const savedBgColor = localStorage.getItem("gang-boyz-banner-bg-color")
      
      if (savedText) setBannerText(savedText)
      if (savedActive !== null) setIsBannerActive(savedActive === 'true')
      if (savedEmoji) setBannerEmoji(savedEmoji)
      if (savedBgColor) setBannerBgColor(savedBgColor)
    }

    loadBannerSettings()
    
    // Escutar mudanças nas configurações
    window.addEventListener('bannerSettingsUpdated', loadBannerSettings)
    
    return () => {
      window.removeEventListener('bannerSettingsUpdated', loadBannerSettings)
    }
  }, [])

  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  const menuItems = [
    { label: "Camisetas", href: "/camisetas", icon: null, hasSubmenu: true },
    { label: "Moletons", href: "/moletons", icon: null },
    { label: "Jaquetas", href: "/jaquetas", icon: null },
    { label: "Calças", href: "/calcas", icon: null },
    { label: "Shorts/Bermudas", href: "/shorts-bermudas", icon: null },
    { label: "Lançamentos", href: "/lancamentos", icon: Sparkles, isBlue: true },
    { label: "Em alta", href: "/em-alta", icon: Flame, isHot: true }
  ]

  const camisetasSubmenu = [
    { label: "Manga Longa", href: "/camisetas/manga-longa" },
    { label: "Manga Curta", href: "/camisetas/manga-curta" },
    { label: "Regata", href: "/camisetas/regata" },
    { label: "Tank Top", href: "/camisetas/tank-top" },
    { label: "Polo", href: "/camisetas/polo" },
    { label: "Básica", href: "/camisetas/basica" }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <>
      {/* Faixa Preta Superior com Animação Deslizante */}
      <div className={`absolute top-0 left-0 right-0 z-50 h-[38px] overflow-hidden ${
        bannerBgColor === 'black' ? 'bg-black' :
        bannerBgColor === 'red' ? 'bg-red-600' :
        bannerBgColor === 'blue' ? 'bg-blue-600' :
        bannerBgColor === 'yellow' ? 'bg-yellow-500' :
        bannerBgColor === 'green' ? 'bg-green-600' :
        bannerBgColor === 'sync' ? 'bg-gradient-to-r from-red-600 to-blue-600' :
        'bg-black'
      }`}>
        {isBannerActive ? (
          <div className="flex items-center h-full">
            <div className="flex animate-scroll text-white font-bold text-sm tracking-wider whitespace-nowrap">
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
              <span className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Header Container - Centralizado e com mais espaçamento */}
      <div className="absolute top-[5px] left-0 right-0 z-[60] flex items-center justify-between pl-[60px] pr-[230px]">
        
        {/* Logo - Esquerda */}
        <div className="flex items-center">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center"
          >
            <img
              src="/logo-gang-boyz-new.svg"
              alt="Gang BoyZ"
              className="h-auto w-[230px]"
            />
          </button>
        </div>

        {/* Menu Centralizado */}
        <nav className="flex items-center space-x-6 relative">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            
            if (item.hasSubmenu) {
              return (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => setIsCamisetasOpen(!isCamisetasOpen)}
                    className={`flex items-center space-x-2 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm ${
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
                    <span>{item.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isCamisetasOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Submenu Dropdown */}
                  {isCamisetasOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-2">
                        {camisetasSubmenu.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => {
                              handleNavigation(subItem.href)
                              setIsCamisetasOpen(false)
                            }}
                            className="w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-between group"
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
                className={`flex items-center space-x-2 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm ${
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
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Ícones - Direita */}
        <div className="flex items-center space-x-6">
          <button className="text-white hover:text-gray-300 transition-colors duration-200">
            <Search className="h-6 w-6" />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors duration-200">
            <User className="h-6 w-6" />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors duration-200">
            <Heart className="h-6 w-6" />
          </button>
          <button className="relative text-white hover:text-gray-300 transition-colors duration-200">
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
