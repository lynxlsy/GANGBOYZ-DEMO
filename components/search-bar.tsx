"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowRight, Tag, Image as ImageIcon, Star, Flame } from "lucide-react"
import { useUnifiedSearch, SearchResult } from "@/lib/unified-id-system"
import { eventManager } from "@/lib/event-manager"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { search, refreshCache } = useUnifiedSearch()

  // Buscar quando o usuário digita
  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsLoading(true)
      const searchResults = search(query, 10)
      setResults(searchResults)
      setIsLoading(false)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query]) // Remove search from dependencies to prevent infinite loop

  // Fechar quando clica fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Atualizar cache quando a página carrega e quando produtos são adicionados
  useEffect(() => {
    refreshCache()
    
    // Also refresh when products are added
    const handleProductAdded = () => {
      setTimeout(() => {
        refreshCache()
      }, 1000) // Small delay to ensure localStorage is updated
    }
    
    eventManager.subscribe('testProductCreated', handleProductAdded)
    eventManager.subscribe('forceProductsReload', handleProductAdded)
    
    return () => {
      eventManager.unsubscribe('testProductCreated', handleProductAdded)
      eventManager.unsubscribe('forceProductsReload', handleProductAdded)
    }
  }, []) // Remove refreshCache from dependencies

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Redirecionar para página de resultados ou executar ação
      console.log("Buscar:", query)
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
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
    <div ref={searchRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Barra de Pesquisa */}
      <form onSubmit={handleSearch} className="relative">
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

      {/* Resultados da Pesquisa */}
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
                <div
                  key={`${result.id}-${index}`}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer group relative"
                  onClick={() => {
                    // Navigate to the appropriate page based on type
                    if (result.type === 'product') {
                      router.push(`/produto/${result.id}`)
                    } else {
                      // For other types, we could navigate to a specific page or show a modal
                      console.log("Item selecionado:", result)
                    }
                    setIsOpen(false)
                    setQuery("")
                  }}
                >
                  {/* Botões de editar e excluir para dispositivos móveis */}
                  <div className="absolute top-2 right-2 flex gap-1 md:hidden">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Editar item:", result.id);
                        // Adicione aqui a lógica para editar o item
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Tem certeza que deseja excluir este item?')) {
                          console.log("Excluir item:", result.id);
                          // Adicione aqui a lógica para excluir o item
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Imagem */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {result.image ? (
                        <Image
                          src={result.image}
                          alt={result.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getTypeIcon(result.type)}
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {result.id}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {result.name}
                      </h3>
                      {result.description && (
                        <p className="text-xs text-gray-600 truncate">
                          {result.description}
                        </p>
                      )}
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

                    {/* Indicador de relevância */}
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Footer com estatísticas */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{results.length} resultado(s) encontrado(s)</span>
                  <span>Pressione Enter para buscar</span>
                </div>
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
  )
}