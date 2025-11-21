import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { UserDropdown } from './user-dropdown';
import { useRouter } from 'next/navigation';
import { useUnifiedSearch } from '@/lib/unified-id-system';
import { Search, X, Tag, Image as ImageIcon, Star, Flame, ArrowRight } from 'lucide-react';

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
  const router = useRouter();
  const { search } = useUnifiedSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBannerAtTop, setIsBannerAtTop] = useState(false);
  const [logoWidth, setLogoWidth] = useState(180);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPreview, setShowSearchPreview] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoize search results to prevent infinite loops
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      return search(searchQuery, 3); // Limit to 3 results
    }
    return [];
  }, [searchQuery, search]);

  // Close search preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchPreview(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Control search preview visibility
  useEffect(() => {
    if (searchResults.length > 0) {
      setShowSearchPreview(true);
    } else {
      setShowSearchPreview(false);
    }
  }, [searchResults]);

  // Optimize scroll handler to prevent excessive re-renders
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 10;
          setIsScrolled(scrolled);
          
          // Verificar posição do banner apenas no cliente
          if (typeof window !== 'undefined') {
            try {
              const bannerPosition = localStorage.getItem('bannerAtTop');
              const isAtTop = bannerPosition === 'true';
              setIsBannerAtTop(prev => prev !== isAtTop ? isAtTop : prev);
            } catch (e) {
              console.error('Error reading localStorage:', e);
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Verificar posição do banner ao carregar o componente apenas no cliente
    if (typeof window !== 'undefined') {
      try {
        const bannerPosition = localStorage.getItem('bannerAtTop');
        const isAtTop = bannerPosition === 'true';
        setIsBannerAtTop(isAtTop);
      } catch (e) {
        console.error('Error reading localStorage:', e);
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Tag className="h-4 w-4 text-blue-600" />;
      case 'banner':
        return <ImageIcon className="h-4 w-4 text-green-600" />;
      case 'offer':
        return <Flame className="h-4 w-4 text-orange-600" />;
      case 'recommendation':
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <Tag className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'Produto';
      case 'banner':
        return 'Banner';
      case 'offer':
        return 'Oferta';
      case 'recommendation':
        return 'Recomendação';
      default:
        return 'Item';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

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
        top: 'calc(50% - 7.5cm)', // Moved down by 3cm (from 10.5cm to 7.5cm)
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'transparent',
        zIndex: 50,
        pointerEvents: 'auto'
      }}>
        <button 
          onClick={() => handleNavigation("/")}
          className="flex items-center group"
        >
          <img
            src="/logo-gang-boyz-new.svg"
            alt="Gang BoyZ"
            className="cursor-pointer transition-all duration-300 group-hover:scale-105"
            style={{ width: `${logoWidth}px` }}
          />
        </button>
      </div>

      {/* Barra de Pesquisa Mobile - Apenas na homepage */}
      <div 
        ref={searchContainerRef}
        className="md:hidden px-4 search-container" 
        style={{ 
          position: 'absolute',
          top: 'calc(50% - 3cm)', // Moved down by 3cm (from 6cm to 3cm)
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          zIndex: 49,
          pointerEvents: 'auto'
        }}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
            router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearchPreview(false);
          }
        }}>
          <div className="relative">
            <input
              name="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowSearchPreview(true)}
              placeholder="Pesquisar produtos..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </form>
        
        {/* Search Preview Dropdown */}
        {showSearchPreview && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 z-50 max-h-96 overflow-y-auto">
            <div className="py-2">
              {searchResults.map((result: any, index: number) => (
                <div
                  key={`${result.id}-${index}`}
                  className="px-4 py-3 hover:bg-white/30 cursor-pointer border-b border-white/20 last:border-b-0"
                  onClick={() => {
                    setSearchQuery(result.name);
                    setShowSearchPreview(false);
                    // Navigate to the appropriate page based on type
                    if (result.type === 'product') {
                      router.push(`/produto/${result.id}`);
                    } else if (result.type === 'category') {
                      const categoryPath = result.id.toLowerCase();
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
                      router.push(`/busca?q=${encodeURIComponent(result.name)}`);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {result.image ? (
                      <div className="flex-shrink-0">
                        <img 
                          src={result.image} 
                          alt={result.name} 
                          className="w-12 h-12 object-cover rounded-md"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/placeholder-default.svg";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-md flex items-center justify-center">
                        {getTypeIcon(result.type)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium bg-white/30 px-2 py-1 rounded text-white">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-white truncate">
                        {result.name}
                      </h3>
                      
                      {result.description && (
                        <p className="text-xs text-white/80 truncate mt-1">
                          {result.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-1">
                        {result.price && (
                          <span className="text-sm font-bold text-red-400">
                            {formatPrice(result.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-white/60" />
                  </div>
                </div>
              ))}
              
              <div 
                className="px-4 py-2 text-center text-sm text-white/80 hover:bg-white/30 cursor-pointer border-t border-white/20"
                onClick={() => {
                  router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
                  setShowSearchPreview(false);
                }}
              >
                Ver todos os resultados
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileHeaderLiteral;