import { useState, useEffect } from 'react';
import { UserDropdown } from './user-dropdown';

interface MobileHeaderLiteralProps {
  onMenuClick: () => void;
  openCart: () => void;
  handleNavigation: (path: string) => void;
  handleWhatsApp: () => void;
  user: any;
  cartItemsCount: number;
}

const MobileHeaderLiteral = ({
  onMenuClick,
  openCart,
  handleNavigation,
  handleWhatsApp,
  user,
  cartItemsCount
}: MobileHeaderLiteralProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBannerAtTop, setIsBannerAtTop] = useState(false);
  const [logoWidth, setLogoWidth] = useState(180);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      
      // Verificar posição do banner apenas no cliente
      if (typeof window !== 'undefined') {
        try {
          const bannerPosition = localStorage.getItem('bannerAtTop');
          setIsBannerAtTop(bannerPosition === 'true');
        } catch (e) {
          console.error('Error reading localStorage:', e);
        }
      }
    };

    // Verificar posição do banner ao carregar o componente apenas no cliente
    if (typeof window !== 'undefined') {
      try {
        const bannerPosition = localStorage.getItem('bannerAtTop');
        setIsBannerAtTop(bannerPosition === 'true');
      } catch (e) {
        console.error('Error reading localStorage:', e);
      }

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const newWidth = Math.max(120, Math.min(220, screenWidth * 0.4));
      setLogoWidth(newWidth);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      {/* Header com fundo preto condicional */}
      <div className={`md:hidden absolute top-0 left-0 right-0 z-[60] transition-all duration-300 ${isBannerAtTop ? 'mt-[40px]' : 'mt-[20px]'} ${
        isScrolled && !isBannerAtTop ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-3 py-3">
          <button 
            className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex-shrink-0 p-2" 
            title="Abrir Menu"
            onClick={onMenuClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu h-5 w-5 group-hover:scale-110 transition-transform duration-200">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex items-center justify-center flex-1 px-6">
            <div className="flex items-center justify-between w-full max-w-xs">
              <button 
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10" 
                title="Início"
                onClick={() => handleNavigation("/")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house h-5 w-5 group-hover:scale-110 transition-transform duration-200">
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="text-xs font-medium text-white">Início</span>
              </button>
              <button 
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group relative flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10" 
                title="Favoritos"
                onClick={() => handleNavigation("/favoritos")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-5 w-5 group-hover:scale-110 transition-transform duration-200">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                <span className="text-xs font-medium text-white">Favoritos</span>
                <div className="absolute top-0 right-1 w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              <button 
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10" 
                title="WhatsApp"
                onClick={handleWhatsApp}
              >
                <img src="/icons8-whatsapp-32.png" alt="WhatsApp" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200 filter brightness-0 invert" />
                <span className="text-xs font-medium text-white">Contato</span>
              </button>
              {user ? (
                <UserDropdown />
              ) : (
                <button 
                  className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-1 px-3 py-2 rounded-md hover:bg-white/10" 
                  title="Login"
                  onClick={() => handleNavigation('/auth/signin')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5 group-hover:scale-110 transition-transform duration-200">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-xs font-medium text-white">Login</span>
                </button>
              )}
            </div>
          </div>
          <button 
            className="relative text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex-shrink-0 p-2" 
            title="Carrinho"
            onClick={openCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart h-5 w-5 group-hover:scale-110 transition-transform duration-200">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse text-[10px]">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Logo Gang Boyz abaixo do header - SEM fundo preto */}
      <div className="md:hidden flex justify-center pt-2" style={{ 
        marginTop: '2cm',
        position: 'absolute', 
        top: 'calc(50% - 8cm)', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'transparent',
        zIndex: 50,
        pointerEvents: 'none'
      }}>
        <button 
          onClick={() => handleNavigation("/")}
          className="flex items-center group"
          style={{ pointerEvents: 'auto' }}
        >
          <img
            src="/logo-gang-boyz-new.svg"
            alt="Gang BoyZ"
            className="cursor-pointer transition-all duration-300 group-hover:scale-105"
            style={{ width: `${logoWidth}px` }}
          />
        </button>
      </div>
    </>
  );
};

export default MobileHeaderLiteral;