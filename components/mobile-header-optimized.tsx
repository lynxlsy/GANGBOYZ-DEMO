"use client"

import { useState, useEffect } from "react"
import { User, Heart, ShoppingCart, Menu, Home } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { UserDropdown } from "@/components/user-dropdown"
import { getContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from '@/lib/editable-content-sync';

interface MobileHeaderOptimizedProps {
  isScrolled: boolean
  onMenuClick: () => void
}

export function MobileHeaderOptimized({ isScrolled, onMenuClick }: MobileHeaderOptimizedProps) {
  const { state, openCart } = useCart()
  const router = useRouter()
  const { user } = useUser()
  
  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/5511999999999")
  const [isBannerAtTop, setIsBannerAtTop] = useState(true)

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleWhatsApp = () => {
    window.open(whatsappLink, '_blank')
  }

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

  return (
    <div className={`md:hidden absolute top-0 left-0 right-0 z-[60] transition-all duration-300 ${
      isScrolled && !isBannerAtTop ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between px-3 py-3">
        
        {/* Menu Hambúrguer - Esquerda */}
        <button
          onClick={onMenuClick}
          className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex-shrink-0 p-2"
          title="Abrir Menu"
        >
          <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Ícones Centrais - Apenas os 4 principais */}
        <div className="flex items-center justify-center flex-1 px-6">
          <div className="flex items-center justify-between w-full max-w-xs">
            
            {/* Início */}
            <button
              onClick={() => handleNavigation("/")}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10"
              title="Início"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-medium text-white">Início</span>
            </button>
            
            {/* Favoritos */}
            <button
              onClick={() => handleNavigation("/favoritos")}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group relative flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10"
              title="Favoritos"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-medium text-white">Favoritos</span>
              <div className="absolute top-0 right-1 w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>

            {/* WhatsApp - SVG do Projeto */}
            <button
              onClick={handleWhatsApp}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10"
              title="WhatsApp"
            >
              <img 
                src="/whatsapp.svg" 
                alt="WhatsApp" 
                className="h-5 w-5 group-hover:scale-110 transition-transform duration-200 filter brightness-0 invert"
              />
              <span className="text-xs font-medium text-white">Contato</span>
            </button>

            {/* Login */}
            {user ? (
              <UserDropdown />
            ) : (
              <button 
                onClick={() => handleNavigation('/auth/signin')}
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10"
                title="Login"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-medium text-white">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Carrinho - Direita (mesma distância do menu) */}
        <button 
          onClick={openCart}
          className="relative text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex-shrink-0 p-2"
          title="Carrinho"
        >
          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse text-[10px]">
              {cartItemsCount > 9 ? '9+' : cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
