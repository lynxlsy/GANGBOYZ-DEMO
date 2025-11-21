"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { useUnifiedSearch, SearchResult } from "@/lib/unified-id-system"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FunctionalSearchProps {
  className?: string
}

export function FunctionalSearch({ className = "" }: FunctionalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { search, refreshCache } = useUnifiedSearch()

  // Search when query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsLoading(true)
      const searchResults = search(query, 8)
      setResults(searchResults)
      setIsLoading(false)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Refresh cache when page loads
  useEffect(() => {
    refreshCache()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to search results page
      router.push(`/busca?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const formatPrice = (price?: number) => {
    if (!price) return ''
    return `R$ ${price.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className={`px-[80px] pb-4 animate-in slide-in-from-top-4 duration-500 search-container ${className}`}>
      <div className="relative w-full max-w-2xl mx-auto hidden md:block">
        <div ref={searchRef} className="relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por ID, nome ou categoria..."
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 shadow-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto mb-2"></div>
                  Buscando...
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <Link
                      key={`${result.id}-${index}`}
                      href={result.type === 'product' ? `/produto/${result.id}` : `/busca?q=${encodeURIComponent(query)}`}
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer group relative"
                      onClick={() => {
                        setIsOpen(false)
                        setQuery("")
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {result.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {result.price && (
                              <span className="text-sm font-bold text-red-600">
                                {formatPrice(result.price)}
                              </span>
                            )}
                            {result.category && 
                             String(result.category).trim() !== '' && 
                             String(result.category).trim() !== '0' &&
                             isNaN(Number(String(result.category).trim())) && (
                              <span className="text-xs text-gray-500">
                                {String(result.category)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Show all results link */}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => {
                        router.push(`/busca?q=${encodeURIComponent(query)}`)
                        setIsOpen(false)
                        setQuery("")
                      }}
                      className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Ver todos os resultados ({results.length})
                    </button>
                  </div>
                </div>
              ) : query.length >= 2 ? (
                <div className="p-4 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Nenhum resultado encontrado para "{query}"</p>
                  <p className="text-xs mt-1">Tente buscar por ID, nome ou categoria</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}