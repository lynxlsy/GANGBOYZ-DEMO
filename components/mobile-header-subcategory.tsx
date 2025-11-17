import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { Menu, Heart, ShoppingCart } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export function MobileHeaderSubcategory() {
  const { state, openCart } = useCart()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isBannerAtTop, setIsBannerAtTop] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  // Check if banner is positioned at top
  useEffect(() => {
    const checkBannerPosition = () => {
      const bannerPosition = localStorage.getItem("gang-boyz-main-banner-position") || 
                           localStorage.getItem("gang-boyz-top-banner-position");
      setIsBannerAtTop(bannerPosition === "top");
    };
    
    // Check on mount
    checkBannerPosition();
    
    // Listen for banner position changes
    const handleBannerUpdate = () => {
      setTimeout(checkBannerPosition, 100); // Small delay to ensure localStorage is updated
    };
    
    window.addEventListener('mainBannerSettingsUpdated', handleBannerUpdate);
    window.addEventListener('topBannerSettingsUpdated', handleBannerUpdate);
    
    // Detect scroll for background effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mainBannerSettingsUpdated', handleBannerUpdate);
      window.removeEventListener('topBannerSettingsUpdated', handleBannerUpdate);
      window.removeEventListener('scroll', handleScroll)
    };
  }, []);

  return (
    <>
      {/* Mobile Header - Dedicated for Subcategory Pages */}
      <div className={`md:hidden relative top-0 left-0 right-0 z-[60] ${isScrolled && !isBannerAtTop ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'} border-b border-black`}>
        <div className="container relative flex items-center justify-between gap-space-32 text-cor-base cart-01 py-space-10">
          {/* Sidebar Menu Button - Left */}
          <div className="header-menu-button-ctn">
            <a 
              href="#" 
              className="menu-button prevent-default"
              onClick={(e) => {
                e.preventDefault()
                setIsSidebarOpen(true)
              }}
            >
              <div className="flex size-[50px] min-w-[50px] items-center justify-center text-icon-fill-base transition-all delay-300">
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </a>
          </div>
          
          {/* Logo - Center */}
          <div className="flex-1 flex justify-center">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center group"
            >
              <img
                src="/logo-gang-boyz-new.svg"
                alt="Gang BoyZ"
                className="cursor-pointer transition-all duration-300 group-hover:scale-105"
                style={{ width: '163.625px', height: '150px' }}
              />
            </button>
          </div>
          
          {/* Icons Section - Right */}
          <div className="flex items-center space-x-4">
            <a href="/favoritos" className="text-white hover:text-gray-300">
              <Heart className="h-6 w-6" />
            </a>
            <button 
              onClick={openCart}
              className="relative text-white hover:text-gray-300"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}