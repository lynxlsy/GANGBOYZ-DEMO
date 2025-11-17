// Sistema de ID Unificado para Gang Boyz E-commerce
// Este arquivo gerencia todos os IDs do sistema

export interface ProductID {
  id: string
  type: 'product' | 'banner' | 'offer' | 'recommendation' | 'category'
  name: string
  description?: string
  price?: number
  originalPrice?: number
  image?: string
  category?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  tags?: string[]
  metadata?: Record<string, any>
  productCount?: number // Adicionado para mostrar a contagem de produtos nas categorias
}

export interface SearchResult {
  id: string
  type: string
  name: string
  description?: string
  price?: number
  image?: string
  category?: string
  relevanceScore: number
  productCount?: number // Adicionado para mostrar a contagem de produtos nas categorias
}

// Configurações de ID por tipo
export const ID_CONFIGS = {
  product: {
    prefix: 'PROD',
    length: 6,
    description: 'Produtos do catálogo'
  },
  banner: {
    prefix: 'BANNER',
    length: 8,
    description: 'Banners da homepage'
  },
  offer: {
    prefix: 'OFFER',
    length: 6,
    description: 'Ofertas especiais'
  },
  recommendation: {
    prefix: 'REC',
    length: 6,
    description: 'Recomendações'
  },
  category: {
    prefix: 'CAT',
    length: 6,
    description: 'Categorias de produtos'
  }
} as const

// Gerador de ID único
export function generateID(type: keyof typeof ID_CONFIGS, existingIds: string[] = []): string {
  const config = ID_CONFIGS[type]
  const timestamp = Date.now().toString().slice(-4)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  let id = `${config.prefix}${timestamp}${random}`
  
  // Garantir que o ID seja único
  let counter = 1
  while (existingIds.includes(id)) {
    id = `${config.prefix}${timestamp}${random}${counter.toString().padStart(2, '0')}`
    counter++
  }
  
  return id
}

// Validador de ID
export function validateID(id: string): { isValid: boolean; type?: keyof typeof ID_CONFIGS; error?: string } {
  for (const [type, config] of Object.entries(ID_CONFIGS)) {
    if (id.startsWith(config.prefix)) {
      if (id.length >= config.prefix.length) { // Changed from exact length check to minimum length check
        return { isValid: true, type: type as keyof typeof ID_CONFIGS }
      } else {
        return { isValid: false, error: `ID ${id} deve ter pelo menos ${config.prefix.length} caracteres` }
      }
    }
  }
  
  return { isValid: false, error: `ID ${id} não é válido` }
}

// Sistema de busca unificado
export class UnifiedSearchSystem {
  private static instance: UnifiedSearchSystem
  private allItems: ProductID[] = []
  private cache: Map<string, SearchResult[]> = new Map()
  private cacheTimeout: Map<string, number> = new Map()
  private lastLoadTime: number = 0
  private loadThrottle: number = 5000 // 5 seconds throttle for loading
  
  private constructor() {
    this.loadAllItems()
  }
  
  public static getInstance(): UnifiedSearchSystem {
    if (!UnifiedSearchSystem.instance) {
      UnifiedSearchSystem.instance = new UnifiedSearchSystem()
    }
    return UnifiedSearchSystem.instance
  }
  
  // Carregar todos os itens do localStorage com throttling
  private loadAllItems(): void {
    const now = Date.now()
    // Only load if more than 5 seconds have passed since last load
    if (now - this.lastLoadTime < this.loadThrottle) {
      return
    }
    
    this.lastLoadTime = now
    this.allItems = []
    
    // Carregar produtos de diferentes seções
    const sections = [
      'gang-boyz-hot-products',
      'gang-boyz-standalone-products', 
      'gang-boyz-recommendations',
      'gang-boyz-showcase-banners',
      'gang-boyz-categories',
      'gang-boyz-products', // Added this section to include products from the main product context
      'gang-boyz-test-products' // Added this section to include products from the admin
    ]
    
    sections.forEach(section => {
      const data = localStorage.getItem(section)
      if (data) {
        try {
          const items = JSON.parse(data)
          if (Array.isArray(items)) {
            items.forEach(item => {
              if (item.id) {
                this.allItems.push({
                  id: item.id,
                  type: this.detectType(item.id, item),
                  name: item.name || item.title || 'Sem nome',
                  description: item.description || '',
                  price: item.price || 0,
                  originalPrice: item.originalPrice || 0,
                  image: item.image || '',
                  category: item.category || '',
                  isActive: item.isActive !== false,
                  createdAt: item.createdAt || new Date().toISOString(),
                  updatedAt: item.updatedAt || new Date().toISOString(),
                  tags: this.generateTags(item),
                  metadata: item
                })
              }
            })
          }
        } catch (error) {
          console.error(`Erro ao carregar ${section}:`, error)
        }
      }
    })
    
    // Adicionar categorias principais ao sistema de busca
    const mainCategories = [
      { 
        id: 'camisetas', 
        name: 'Camisetas', 
        type: 'category',
        productCount: this.getActiveProductCountByMainCategory('Camisetas')
      },
      { 
        id: 'moletons', 
        name: 'Moletons', 
        type: 'category',
        productCount: this.getActiveProductCountByMainCategory('Moletons')
      },
      { 
        id: 'jaquetas', 
        name: 'Jaquetas', 
        type: 'category',
        productCount: this.getActiveProductCountByMainCategory('Jaquetas')
      },
      { 
        id: 'calcas', 
        name: 'Calças', 
        type: 'category',
        productCount: this.getActiveProductCountByMainCategory('Calças')
      },
      { 
        id: 'shorts-bermudas', 
        name: 'Shorts/Bermudas', 
        type: 'category',
        productCount: this.getActiveProductCountByMainCategory('Shorts/Bermudas')
      }
    ]
    
    // Remover categorias duplicadas que podem existir no localStorage
    const mainCategoryIds = mainCategories.map(cat => cat.id)
    this.allItems = this.allItems.filter(item => {
      // Manter todos os itens que não são categorias principais
      if (item.type !== 'category') return true
      
      // Para categorias, manter apenas as que não estão na lista de categorias principais
      // ou que são as categorias principais que estamos adicionando
      return !mainCategoryIds.includes(item.id)
    })
    
    // Adicionar as categorias principais corretas
    mainCategories.forEach(category => {
      this.allItems.push({
        id: category.id,
        type: category.type as ProductID['type'],
        name: category.name,
        description: `Categoria de ${category.name}`,
        price: 0,
        originalPrice: 0,
        image: '', // We could add category images here if needed
        category: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [category.name.toLowerCase(), category.id.toLowerCase()],
        metadata: {},
        productCount: category.productCount // Adicionado para mostrar a contagem de produtos
      })
    })
    
    // Clear cache when loading new data
    this.cache.clear()
    this.cacheTimeout.clear()
  }
  
  // Detectar tipo baseado no ID e nos dados do item
  private detectType(id: string, item: any): ProductID['type'] {
    // First try to detect from ID prefix
    const validation = validateID(id)
    if (validation.type) {
      return validation.type
    }
    
    // If ID validation fails, try to detect from item data
    if (item.categories || item.sizes || item.price) {
      return 'product'
    }
    
    if (item.imageUrl || item.title) {
      return 'banner'
    }
    
    return 'product' // Default to product
  }
  
  // Gerar tags para busca
  private generateTags(item: any): string[] {
    const tags: string[] = []
    
    if (item.name) tags.push(item.name.toLowerCase())
    if (item.title) tags.push(item.title.toLowerCase())
    if (item.description) tags.push(item.description.toLowerCase())
    if (item.category) tags.push(item.category.toLowerCase())
    if (item.brand) tags.push(item.brand.toLowerCase())
    if (item.id) tags.push(item.id.toLowerCase())
    if (item.color) tags.push(item.color.toLowerCase())
    
    // Add categories as tags
    if (item.categories && Array.isArray(item.categories)) {
      item.categories.forEach((cat: string) => tags.push(cat.toLowerCase()))
    }
    
    // Add sizes as tags
    if (item.sizes && Array.isArray(item.sizes)) {
      item.sizes.forEach((size: string) => tags.push(size.toLowerCase()))
    }
    
    return [...new Set(tags)]
  }
  
  // Buscar itens com caching
  public search(query: string, limit: number = 20): SearchResult[] {
    if (!query.trim()) return []
    
    const cacheKey = `${query}-${limit}`
    const now = Date.now()
    
    // Check if we have a valid cached result (less than 30 seconds old)
    if (this.cache.has(cacheKey) && this.cacheTimeout.has(cacheKey)) {
      const timeout = this.cacheTimeout.get(cacheKey)!
      if (now < timeout) {
        return this.cache.get(cacheKey)!
      } else {
        // Remove expired cache
        this.cache.delete(cacheKey)
        this.cacheTimeout.delete(cacheKey)
      }
    }
    
    const searchTerm = query.toLowerCase().trim()
    const results: SearchResult[] = []
    
    this.allItems.forEach(item => {
      if (!item.isActive) return
      
      let relevanceScore = 0
      
      // Busca exata no ID (maior relevância)
      if (item.id.toLowerCase() === searchTerm) {
        relevanceScore += 100
      } else if (item.id.toLowerCase().includes(searchTerm)) {
        relevanceScore += 80
      }
      
      // Busca no nome
      if (item.name.toLowerCase().includes(searchTerm)) {
        relevanceScore += 60
      }
      
      // Busca na descrição
      if (item.description?.toLowerCase().includes(searchTerm)) {
        relevanceScore += 40
      }
      
      // Busca na categoria
      if (item.category?.toLowerCase().includes(searchTerm)) {
        relevanceScore += 30
      }
      
      // Busca nas tags
      if (item.tags?.some(tag => tag.includes(searchTerm))) {
        relevanceScore += 20
      }
      
      if (relevanceScore > 0) {
        results.push({
          id: item.id,
          type: item.type,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          relevanceScore,
          productCount: item.productCount // Incluir a contagem de produtos
        })
      }
    })
    
    // Ordenar por relevância
    let sortedResults = results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
    
    // Remover duplicatas mantendo apenas o item com maior relevância para cada ID
    const uniqueResults: SearchResult[] = []
    const seenIds = new Set<string>()
    
    for (const result of sortedResults) {
      if (!seenIds.has(result.id)) {
        seenIds.add(result.id)
        uniqueResults.push(result)
      }
    }
    
    // Limitar resultados
    const finalResults = uniqueResults.slice(0, limit)
    
    // Cache the results for 30 seconds
    this.cache.set(cacheKey, finalResults)
    this.cacheTimeout.set(cacheKey, now + 30000) // 30 seconds
    
    return finalResults
  }
  
  // Atualizar cache
  public refreshCache(): void {
    this.loadAllItems()
  }
  
  // Obter estatísticas
  public getStats(): { total: number; byType: Record<string, number> } {
    const stats = { total: this.allItems.length, byType: {} as Record<string, number> }
    
    this.allItems.forEach(item => {
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1
    })
    
    return stats
  }
  
  // Obter item por ID
  public getItemById(id: string): ProductID | null {
    return this.allItems.find(item => item.id === id) || null
  }
  
  // Obter todos os itens
  public getAllItems(): ProductID[] {
    return [...this.allItems]
  }
  
  // Método para contar produtos ativos por categoria principal
  private getActiveProductCountByMainCategory(mainCategory: string): number {
    // Carregar produtos do localStorage
    const sections = [
      'gang-boyz-products', // Produtos principais
      'gang-boyz-test-products' // Produtos do admin
    ]
    
    let allProducts: any[] = []
    
    sections.forEach(section => {
      const data = localStorage.getItem(section)
      if (data) {
        try {
          const items = JSON.parse(data)
          if (Array.isArray(items)) {
            allProducts = [...allProducts, ...items]
          }
        } catch (error) {
          console.error(`Erro ao carregar ${section}:`, error)
        }
      }
    })
    
    // Contar produtos ativos que pertencem à categoria principal
    const activeProducts = allProducts.filter(product => {
      if (!product.status || product.status !== 'ativo') return false
      
      if (!product.categories || !Array.isArray(product.categories)) return false
      
      return product.categories.some((category: string) => {
        const normalizedCategory = category.toLowerCase().trim()
        const normalizedMainCategory = mainCategory.toLowerCase().trim()
        
        // Correspondência direta
        if (normalizedCategory === normalizedMainCategory) return true
        
        // Correspondência parcial
        if (normalizedCategory.includes(normalizedMainCategory)) return true
        
        // Correspondência com hífens
        if (normalizedCategory.replace(/\s+/g, '-') === normalizedMainCategory) return true
        if (normalizedCategory === normalizedMainCategory.replace(/-/g, ' ')) return true
        
        return false
      })
    })
    
    return activeProducts.length
  }
}

// Hook para usar o sistema de busca
export function useUnifiedSearch() {
  const searchSystem = UnifiedSearchSystem.getInstance()
  
  const search = (query: string, limit?: number) => {
    return searchSystem.search(query, limit)
  }
  
  const refreshCache = () => {
    searchSystem.refreshCache()
  }
  
  const getStats = () => {
    return searchSystem.getStats()
  }
  
  const getItemById = (id: string) => {
    return searchSystem.getItemById(id)
  }
  
  return {
    search,
    refreshCache,
    getStats,
    getItemById
  }
}

// Utilitários para sincronização com Firebase
export interface FirebaseSyncData {
  id: string
  type: string
  data: any
  lastSync: string
  version: number
}

export function prepareForFirebaseSync(item: ProductID): FirebaseSyncData {
  return {
    id: item.id,
    type: item.type,
    data: {
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
      isActive: item.isActive,
      tags: item.tags,
      metadata: item.metadata
    },
    lastSync: new Date().toISOString(),
    version: 1
  }
}

export function parseFromFirebaseSync(firebaseData: FirebaseSyncData): ProductID {
  return {
    id: firebaseData.id,
    type: firebaseData.type as ProductID['type'],
    name: firebaseData.data.name,
    description: firebaseData.data.description,
    price: firebaseData.data.price,
    originalPrice: firebaseData.data.originalPrice,
    image: firebaseData.data.image,
    category: firebaseData.data.category,
    isActive: firebaseData.data.isActive,
    createdAt: firebaseData.lastSync,
    updatedAt: firebaseData.lastSync,
    tags: firebaseData.data.tags,
    metadata: firebaseData.data.metadata
  }
}