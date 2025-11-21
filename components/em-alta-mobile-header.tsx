"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { Menu, Heart, ShoppingCart } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface CustomMobileHeaderProps {
  onMenuClick?: () => void
}

export function CustomMobileHeader({ onMenuClick }: CustomMobileHeaderProps) {
  const { state, openCart } = useCart()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0
  
  const handleNavigation = (path: string) => {
    router.push(path)
    setIsSidebarOpen(false)
  }
  
  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick()
    } else {
      setIsSidebarOpen(true)
    }
  }

  return (
    <>
      {/* Custom Mobile Header */}
      <div className="md:hidden container relative flex items-center justify-between gap-space-32 text-cor-base cart-01 py-space-10">
        <div className="header-menu-button-ctn">
          <button 
            onClick={handleMenuClick}
            className="menu-button prevent-default"
          >
            <div className="flex size-[50px] min-w-[50px] items-center justify-center text-icon-fill-base transition-all delay-300">
              <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <button 
            onClick={() => handleNavigation("/")}
            className="flex items-center group"
          >
            <img 
              src="/logo-gang-boyz-new.svg" 
              alt="Gang BoyZ" 
              className="cursor-pointer transition-all duration-300 group-hover:scale-105" 
              style={{ width: "163.625px", height: "150px" }} 
            />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => handleNavigation("/favoritos")}
            className="text-white hover:text-gray-300"
          >
            <Heart className="h-6 w-6" />
          </button>
          
          <button 
            onClick={openCart}
            className="relative text-white hover:text-gray-300"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Sidebar - Apenas Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}