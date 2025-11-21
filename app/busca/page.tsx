"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, ArrowRight, Tag, Image as ImageIcon, Star, Flame, Heart } from "lucide-react"
import { useUnifiedSearch, SearchResult } from "@/lib/unified-id-system"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { NotificationSystem } from "@/components/notification-system"
import { CookieBanner } from "@/components/cookie-banner"

export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { search, refreshCache } = useUnifiedSearch()

  // Search when query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsLoading(true)
      const searchResults = search(query, 50)
      setResults(searchResults)
      setIsLoading(false)
    } else {
      setResults([])
    }
  }, [query])

  // Refresh cache when page loads
  useEffect(() => {
    refreshCache()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Update URL with search query
      router.push(`/busca?q=${encodeURIComponent(query)}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Tag className="h-4 w-4 text-blue-600" />
      case 'banner':
        return <ImageIcon className="h-4 w-4 text-green-600" />
      case 'offer':
        return <Flame className="h-4 w-4 text-orange-600" />
      case 'recommendation':
        return <Star className="h-4 w-4 text-purple-600" />
      default:
        return <Tag className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'Produto'
      case 'banner':
        return 'Banner'
      case 'offer':
        return 'Oferta'
      case 'recommendation':
        return 'Recomendação'
      default:
        return 'Item'
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return ''
    return `R$ ${price.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Spacer to push content down - smaller on mobile, larger on desktop */}
      <div className="h-[337px] md:h-[112px] bg-black"></div>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Resultados da Pesquisa</h1>
          
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por ID, nome ou categoria..."
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-white/60 shadow-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Search Results */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                {results.length} resultado(s) encontrado(s) para "{query}"
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {results.map((result, index) => (
                  <div
                    key={`${result.id}-${index}`}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:bg-gray-900 transition-colors cursor-pointer group"
                    onClick={() => {
                      // Navigate to the appropriate page based on type
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
                        // For other types, we could navigate to a specific page or show a modal
                        console.log("Item selecionado:", result)
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {result.image && (
                        <div className="flex-shrink-0">
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-default.svg"
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(result.type)}
                          <span className="text-xs font-medium bg-gray-700 px-2 py-1 rounded">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white truncate">
                          {result.name}
                        </h3>
                        
                        {result.description && (
                          <p className="text-sm text-gray-400 truncate mt-1">
                            {result.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 mt-2">
                          {result.price && (
                            <span className="text-lg font-bold text-red-500">
                              {formatPrice(result.price)}
                            </span>
                          )}
                          
                          {result.category && 
                           typeof result.category === 'string' &&
                           result.category.trim() !== '' &&
                           result.category.trim() !== '0' &&
                           isNaN(Number(result.category.trim())) && (
                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                              {result.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum resultado encontrado para "{query}"</p>
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
      <CartDrawer />
      <ScrollToTop />
      <WhatsAppButton />
      <NotificationSystem />
      <CookieBanner />
    </div>
  )
}