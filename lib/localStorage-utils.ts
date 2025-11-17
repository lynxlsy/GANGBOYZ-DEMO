"use client"

import { runDuringIdle, runWithIdleFallback } from "@/lib/idle-callback"

// Debounce timers for localStorage operations
const debounceTimers: Map<string, NodeJS.Timeout> = new Map();

// Função para verificar se há espaço suficiente no localStorage
export function checkLocalStorageQuota(): { available: boolean; used: number; total: number } {
  if (typeof window === 'undefined') {
    return { available: true, used: 0, total: 0 }
  }

  try {
    // Estimativa do tamanho usado
    let used = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Limite típico do localStorage é ~5-10MB
    const total = 5 * 1024 * 1024 // 5MB
    const available = used < total * 0.8 // Usar apenas 80% do limite para margem de segurança

    return { available, used, total }
  } catch (error) {
    console.error('Erro ao verificar quota do localStorage:', error)
    return { available: false, used: 0, total: 0 }
  }
}

// Função para salvar no localStorage com verificação de quota e debouncing
export function safeSetItem(key: string, value: string, debounceDelay: number = 300): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Clear existing timer for this key
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key)!)
  }

  // If debounceDelay is 0, save immediately
  if (debounceDelay === 0) {
    return performSetItem(key, value)
  }

  // Set new timer
  const timer = setTimeout(() => {
    performSetItem(key, value)
    debounceTimers.delete(key)
  }, debounceDelay)

  debounceTimers.set(key, timer)
  return true
}

// Função auxiliar para realizar a operação de salvar no localStorage
function performSetItem(key: string, value: string): boolean {
  try {
    const { available, used, total } = checkLocalStorageQuota()
    
    // Verificar se a operação vai exceder o limite
    const newItemSize = key.length + value.length
    const projectedUsage = used + newItemSize
    
    if (projectedUsage > total * 0.8) {
      console.warn('Quota do localStorage próxima do limite. Limpando dados antigos...')
      cleanupLocalStorage()
    }

    // Tentar salvar
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Quota excedida. Tentando limpar dados antigos...')
      cleanupLocalStorage()
      
      try {
        localStorage.setItem(key, value)
        return true
      } catch (retryError) {
        console.error('Falha ao salvar após limpeza:', retryError)
        return false
      }
    }
    
    console.error('Erro ao salvar no localStorage:', error)
    return false
  }
}

// Função para limpar dados antigos do localStorage com idle callback
export async function cleanupLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  await runDuringIdle(() => {
    try {
      const keysToKeep = [
        'gang-boyz-active-theme',
        'gang-boyz-about-info',
        'gang-boyz-test-products',
        'gang-boyz-products',
        'gang-boyz-recommendations',
        'gang-boyz-editable-contents',
        'gang-boyz-user-preferences',
        'gang-boyz-banner-strip-config',
        'gang-boyz-contacts',
        'gang-boyz-contact-info',
        'gang-boyz-useful-links'
      ]

      // Coletar todas as chaves
      const allKeys = Object.keys(localStorage)
      
      // Remover chaves que não estão na lista de manter
      allKeys.forEach(key => {
        // Manter apenas as chaves essenciais e remover dados temporários ou duplicados
        if (key.startsWith('gang-boyz-') && !keysToKeep.includes(key)) {
          // Remover chaves que parecem ser temporárias ou duplicadas
          if (key.includes('temp') || key.includes('cache') || key.includes('backup') || key.includes('debug')) {
            localStorage.removeItem(key)
          }
        }
      })

      // Limpar dados duplicados ou muito antigos no gang-boyz-test-products
      const testProducts = localStorage.getItem('gang-boyz-test-products')
      if (testProducts) {
        try {
          const products = JSON.parse(testProducts)
          // Manter apenas os últimos 30 produtos para evitar acumulo (reduced from 50)
          if (products.length > 30) {
            const recentProducts = products.slice(-30)
            localStorage.setItem('gang-boyz-test-products', JSON.stringify(recentProducts))
          }
        } catch (error) {
          console.error('Erro ao limpar produtos:', error)
          // Se houver erro no parse, remover o item corrompido
          localStorage.removeItem('gang-boyz-test-products')
        }
      }

      // Limpar dados duplicados ou muito antigos no gang-boyz-recommendations
      const recommendations = localStorage.getItem('gang-boyz-recommendations')
      if (recommendations) {
        try {
          const recs = JSON.parse(recommendations)
          // Manter apenas os últimos 20 recomendações para evitar acumulo (reduced from 30)
          if (recs.length > 20) {
            const recentRecs = recs.slice(-20)
            localStorage.setItem('gang-boyz-recommendations', JSON.stringify(recentRecs))
          }
        } catch (error) {
          console.error('Erro ao limpar recomendações:', error)
          // Se houver erro no parse, remover o item corrompido
          localStorage.removeItem('gang-boyz-recommendations')
        }
      }

      // Removido console.log para evitar loop de logs
    } catch (error) {
      console.error('Erro durante limpeza do localStorage:', error)
    }
  }, 3000) // Increased timeout
}

// Função para monitorar o uso do localStorage
let lastCleanupTime = 0
export async function monitorLocalStorageUsage(): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  const { used, total, available } = checkLocalStorageQuota()
  const percentage = (used / total) * 100

  // Removido console.log para evitar loop de logs
  // console.log(`📊 LocalStorage Usage: ${(used / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB (${percentage.toFixed(1)}%)`)
  
  if (!available) {
    console.warn('⚠️ LocalStorage quase cheio! Considerando limpeza...')
    // Evitar limpeza muito frequente (mínimo de 60 segundos entre limpezas)
    const now = Date.now()
    if (now - lastCleanupTime > 60000) {
      await cleanupLocalStorage()
      lastCleanupTime = now
    }
  }
}

// Função para executar limpeza periódica
let cleanupInterval: NodeJS.Timeout | null = null
export function setupPeriodicCleanup(): void {
  if (typeof window === 'undefined') {
    return
  }

  // Evitar múltiplas inicializações
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
  }

  // Executar limpeza a cada 15 minutos (increased frequency)
  cleanupInterval = setInterval(() => {
    monitorLocalStorageUsage()
  }, 15 * 60 * 1000) // 15 minutos em milissegundos
}

// Função para obter dados do localStorage com fallback
export function safeGetItem(key: string, defaultValue: string = ''): string {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  try {
    return localStorage.getItem(key) || defaultValue
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error)
    return defaultValue
  }
}

// Função para remover item do localStorage com segurança
export function safeRemoveItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error)
    return false
  }
}

// Função para limpar todos os timers de debounce
export function clearDebounceTimers(): void {
  debounceTimers.forEach(timer => clearTimeout(timer))
  debounceTimers.clear()
}