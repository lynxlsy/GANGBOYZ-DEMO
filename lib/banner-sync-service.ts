"use client"

import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { db } from './firebase-config'
import { BannerData, BannerStripData } from '@/hooks/use-banner'
import { FirebaseErrorHandler } from './firebase-error-handler'

export interface FirebaseBanner {
  id: string
  name: string
  description: string
  imageUrl: string
  position: string
  isActive: boolean
  order: number
  category?: string
  linkUrl?: string
  targetBlank?: boolean
  cropMetadata?: {
    tx: number
    ty: number
    scale: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseBannerStrip {
  id: string
  text: string
  isActive: boolean
  emoji: string
  bgColor: string
  height: number
  speed: number
  repetitions: number
  position?: string
  textAnimation?: string
  createdAt: Date
  updatedAt: Date
}

class BannerSyncService {
  private isSyncing = false
  private syncQueue: string[] = []
  private broadcastChannel: BroadcastChannel | null = null

  constructor() {
    // Inicializar BroadcastChannel para comunicação entre abas
    if (typeof window !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('banner-sync')
      this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage.bind(this))
    }
  }

  private handleBroadcastMessage(event: MessageEvent) {
    if (event.data.type === 'bannerUpdate') {
      console.log('📡 Atualização recebida via BroadcastChannel:', event.data)
      // Disparar evento local para atualizar componentes
      window.dispatchEvent(new CustomEvent('bannerSyncUpdate', {
        detail: event.data.payload
      }))
    }
  }

  // Função auxiliar para validar e limpar dados
  private validateBannerData(banner: BannerData): any {
    const bannerData: any = {
      name: banner.name || '',
      description: banner.description || '',
      imageUrl: banner.currentImage || '',
      position: 'hero',
      isActive: true,
      order: banner.id === 'hero-banner-1' ? 1 : banner.id === 'hero-banner-2' ? 2 : 0,
      category: 'homepage',
      linkUrl: '',
      targetBlank: false
    }

    // Adicionar cropMetadata apenas se existir e for válido
    if (banner.cropMetadata && typeof banner.cropMetadata === 'object' && banner.cropMetadata !== null) {
      const cropData = {
        tx: Number(banner.cropMetadata.tx || 0),
        ty: Number(banner.cropMetadata.ty || 0),
        scale: Number(banner.cropMetadata.scale || 1)
      }
      
      // Verificar se todos os valores são números válidos
      if (!isNaN(cropData.tx) && !isNaN(cropData.ty) && !isNaN(cropData.scale)) {
        bannerData.cropMetadata = cropData
      }
    }

    // Remover campos undefined/null
    return Object.fromEntries(
      Object.entries(bannerData).filter(([_, value]) => 
        value !== undefined && value !== null
      )
    )
  }

  // Sincronizar banner individual do localStorage para Firebase
  async syncBannerToFirebase(banner: BannerData, position: string = 'hero'): Promise<void> {
    // Evitar múltiplas sincronizações simultâneas
    if (this.isSyncing) {
      console.log(`⏳ Sincronização já em andamento para ${banner.id}. Adicionando à fila.`)
      this.syncQueue.push(banner.id)
      return
    }

    this.isSyncing = true

    try {
      // Verificar se Firebase está disponível (não excedeu quota)
      const bannerRef = doc(db, 'banners', banner.id)
      
      // Validar e limpar dados do banner
      const cleanBannerData = this.validateBannerData(banner)
      
      console.log(`🔄 Sincronizando banner ${banner.id}:`, cleanBannerData)

      // Timeout reduzido para resposta mais rápida
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Firebase não respondeu')), 3000)
      })

      await Promise.race([
        setDoc(bannerRef, {
          ...cleanBannerData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true }),
        timeoutPromise
      ])

      console.log(`✅ Banner ${banner.id} sincronizado com Firebase`)
    } catch (error: any) {
      // Usar o novo sistema de tratamento de erro
      FirebaseErrorHandler.handleAddCategoryError(error, { bannerId: banner.id });
      
      // Se for erro de quota ou timeout, usar fallback para localStorage compartilhado
      if (error?.code === 'resource-exhausted' || 
          error?.message?.includes('quota') || 
          error?.message?.includes('Timeout')) {
        console.warn(`⚠️ Firebase indisponível. Usando fallback para banner ${banner.id}`)
        await this.syncBannerToLocalStorage(banner)
        return
      }
      
      // Não re-throw o erro para evitar quebrar a aplicação
      console.warn(`⚠️ Erro ao sincronizar banner ${banner.id}, usando fallback`)
      await this.syncBannerToLocalStorage(banner)
    } finally {
      this.isSyncing = false
      
      // Processar fila se houver itens pendentes
      if (this.syncQueue.length > 0) {
        const nextBannerId = this.syncQueue.shift()
        if (nextBannerId) {
          console.log(`🔄 Processando próximo item da fila: ${nextBannerId}`)
          // Recarregar dados do localStorage e sincronizar
          const savedBanners = localStorage.getItem('gang-boyz-homepage-banners')
          if (savedBanners) {
            const banners = JSON.parse(savedBanners)
            const banner = banners.find((b: any) => b.id === nextBannerId)
            if (banner) {
              this.syncBannerToFirebase(banner, 'hero')
            }
          }
        }
      }
    }
  }

  // Fallback: Sincronizar para localStorage compartilhado
  private async syncBannerToLocalStorage(banner: BannerData): Promise<void> {
    try {
      // Salvar em localStorage com timestamp para sincronização
      const syncData = {
        ...banner,
        lastSync: new Date().toISOString(),
        syncSource: 'localStorage'
      }
      
      // Salvar no localStorage para sincronização entre abas
      localStorage.setItem(`banner-sync-${banner.id}`, JSON.stringify(syncData))
      
      // Atualizar o localStorage principal dos banners
      const savedBanners = localStorage.getItem('gang-boyz-homepage-banners')
      if (savedBanners) {
        const banners = JSON.parse(savedBanners)
        const bannerIndex = banners.findIndex((b: any) => b.id === banner.id)
        if (bannerIndex !== -1) {
          banners[bannerIndex] = { ...banners[bannerIndex], ...syncData }
          localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(banners))
        }
      }
      
      // Disparar evento para outras abas com timestamp para cache busting
      window.dispatchEvent(new CustomEvent('bannerSyncUpdate', { 
        detail: { 
          bannerId: banner.id, 
          data: syncData,
          timestamp: Date.now(),
          cacheBust: true
        } 
      }))
      
      // Disparar evento específico para atualizar a homepage
      window.dispatchEvent(new CustomEvent('homepageBannerUpdate', {
        detail: { 
          bannerId: banner.id, 
          data: syncData,
          timestamp: Date.now(),
          cacheBust: true
        }
      }))

      // Enviar via BroadcastChannel para outras abas
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'bannerUpdate',
          payload: { bannerId: banner.id, data: syncData }
        })
      }
      
      console.log(`✅ Banner ${banner.id} sincronizado via localStorage`)
    } catch (error) {
      console.error(`❌ Erro no fallback localStorage para banner ${banner.id}:`, error)
      throw error
    }
  }

  // Sincronizar todos os banners da homepage
  async syncHomepageBannersToFirebase(): Promise<void> {
    try {
      // Verificar se estamos no cliente
      if (typeof window === 'undefined') return

      const savedBanners = localStorage.getItem('gang-boyz-homepage-banners')
      if (!savedBanners) {
        console.log('Nenhum banner encontrado no localStorage')
        return
      }

      const banners: BannerData[] = JSON.parse(savedBanners)
      
      // Filtrar apenas banners hero
      const heroBanners = banners.filter(banner => 
        banner.id === 'hero-banner-1' || banner.id === 'hero-banner-2'
      )

      // Verificar se Firebase está disponível primeiro
      const firebaseAvailable = await this.checkFirebaseAvailability()
      
      if (!firebaseAvailable) {
        console.log('⚠️ Firebase indisponível. Usando sincronização local.')
        // Sincronizar via localStorage para todas as abas
        for (const banner of heroBanners) {
          await this.syncBannerToLocalStorage(banner)
        }
        return
      }

      // Sincronizar cada banner com Firebase
      for (const banner of heroBanners) {
        await this.syncBannerToFirebase(banner, 'hero')
      }

      // Sincronizar via localStorage para todas as abas
      for (const banner of heroBanners) {
        await this.syncBannerToLocalStorage(banner)
      }

      console.log(`✅ ${heroBanners.length} banners sincronizados com Firebase`)
    } catch (error) {
      console.error('❌ Erro ao sincronizar banners da homepage:', error)
      throw error
    }
  }

  // Verificar se Firebase está disponível
  private async checkFirebaseAvailability(): Promise<boolean> {
    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const { db } = await import('./firebase-config')
      
      const testRef = doc(db, 'banners', 'test-connection')
      await Promise.race([
        getDoc(testRef),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ])
      
      return true
    } catch (error: any) {
      if (error?.code === 'resource-exhausted' || 
          error?.message?.includes('quota') || 
          error?.message?.includes('Timeout')) {
        return false
      }
      return false
    }
  }

  // Verificar se há banners no Firebase
  async checkFirebaseBanners(): Promise<boolean> {
    try {
      const heroBanner1Ref = doc(db, 'banners', 'hero-banner-1')
      const heroBanner2Ref = doc(db, 'banners', 'hero-banner-2')
      
      const [banner1Doc, banner2Doc] = await Promise.all([
        getDoc(heroBanner1Ref),
        getDoc(heroBanner2Ref)
      ])

      return banner1Doc.exists() || banner2Doc.exists()
    } catch (error) {
      console.error('❌ Erro ao verificar banners do Firebase:', error)
      return false
    }
  }

  // Migrar banners do localStorage para Firebase (se Firebase estiver vazio)
  async migrateLocalStorageToFirebase(): Promise<void> {
    try {
      const hasFirebaseBanners = await this.checkFirebaseBanners()
      
      if (!hasFirebaseBanners) {
        console.log('🔄 Migrando banners do localStorage para Firebase...')
        await this.syncHomepageBannersToFirebase()
        console.log('✅ Migração concluída!')
      } else {
        console.log('ℹ️ Firebase já possui banners, pulando migração')
      }
    } catch (error) {
      console.error('❌ Erro na migração:', error)
      throw error
    }
  }

  // Sincronizar banner strip do localStorage para Firebase
  async syncBannerStripToFirebase(stripData: BannerStripData, stripId: string = 'homepage-banner-strip'): Promise<void> {
    // Evitar múltiplas sincronizações simultâneas
    if (this.isSyncing) {
      console.log(`⏳ Sincronização já em andamento para strip ${stripId}.`)
      return
    }

    this.isSyncing = true

    try {
      // Verificar se Firebase está disponível (não excedeu quota)
      const stripRef = doc(db, 'bannerStrips', stripId)
      
      // Validar e limpar dados do banner strip
      const cleanStripData = {
        id: stripId,
        text: stripData.text || '',
        isActive: stripData.isActive ?? true,
        emoji: stripData.emoji || '',
        bgColor: stripData.bgColor || 'black',
        height: stripData.height || 38,
        speed: stripData.speed || 50,
        repetitions: stripData.repetitions || 4,
        position: stripData.position || 'current',
        textAnimation: stripData.textAnimation || 'scroll',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      console.log(`🔄 Sincronizando banner strip ${stripId}:`, cleanStripData)

      // Timeout reduzido para resposta mais rápida
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Firebase não respondeu')), 3000)
      })

      await Promise.race([
        setDoc(stripRef, cleanStripData, { merge: true }),
        timeoutPromise
      ])

      console.log(`✅ Banner strip ${stripId} sincronizado com Firebase`)
    } catch (error: any) {
      // Usar o novo sistema de tratamento de erro
      FirebaseErrorHandler.handleAddCategoryError(error, { stripId });
      
      // Se for erro de quota ou timeout, usar fallback para localStorage compartilhado
      if (error?.code === 'resource-exhausted' || 
          error?.message?.includes('quota') || 
          error?.message?.includes('Timeout')) {
        console.warn(`⚠️ Firebase indisponível. Usando fallback para banner strip ${stripId}`)
        await this.syncBannerStripToLocalStorage(stripData, stripId)
        return
      }
      
      // Não re-throw o erro para evitar quebrar a aplicação
      console.warn(`⚠️ Erro ao sincronizar banner strip ${stripId}, usando fallback`)
      await this.syncBannerStripToLocalStorage(stripData, stripId)
    } finally {
      this.isSyncing = false
    }
  }

  // Fallback: Sincronizar banner strip para localStorage compartilhado
  private async syncBannerStripToLocalStorage(stripData: BannerStripData, stripId: string): Promise<void> {
    try {
      // Salvar em localStorage com timestamp para sincronização
      const syncData = {
        ...stripData,
        lastSync: new Date().toISOString(),
        syncSource: 'localStorage'
      }
      
      // Salvar no localStorage para sincronização entre abas
      localStorage.setItem(`banner-strip-sync-${stripId}`, JSON.stringify(syncData))
      
      // Disparar evento para outras abas com timestamp para cache busting
      window.dispatchEvent(new CustomEvent('bannerStripSyncUpdate', { 
        detail: { 
          stripId: stripId, 
          data: syncData,
          timestamp: Date.now(),
          cacheBust: true
        } 
      }))
      
      console.log(`✅ Banner strip ${stripId} sincronizado via localStorage`)
    } catch (error) {
      console.error(`❌ Erro no fallback localStorage para banner strip ${stripId}:`, error)
      throw error
    }
  }

  // Sincronizar todos os banners e strips da homepage
  async syncHomepageBannersAndStripsToFirebase(): Promise<void> {
    try {
      // Verificar se estamos no cliente
      if (typeof window === 'undefined') return

      // Sincronizar banners
      await this.syncHomepageBannersToFirebase()
      
      // Sincronizar banner strip
      const stripConfig = {
        storageKey: "gang-boyz-homepage-banner-strip",
        id: "homepage-banner-strip"
      };
      
      const savedStripData = localStorage.getItem(stripConfig.storageKey)
      if (savedStripData) {
        const stripData: BannerStripData = JSON.parse(savedStripData)
        await this.syncBannerStripToFirebase(stripData, stripConfig.id)
      }

      console.log(`✅ Banners e strips da homepage sincronizados com Firebase`)
    } catch (error) {
      console.error('❌ Erro ao sincronizar banners e strips da homepage:', error)
      throw error
    }
  }

  // Listen to banner strip changes from Firebase
  listenToBannerStripChanges(stripId: string = 'homepage-banner-strip', callback: (data: BannerStripData | null) => void): () => void {
    const stripRef = doc(db, 'bannerStrips', stripId);
    
    const unsubscribe = onSnapshot(stripRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          text: data.text || '',
          isActive: data.isActive ?? true,
          emoji: data.emoji || '',
          bgColor: data.bgColor || 'black',
          height: data.height || 38,
          speed: data.speed || 50,
          repetitions: data.repetitions || 4,
          position: data.position || 'current',
          textAnimation: data.textAnimation || 'scroll'
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to banner strip changes:', error);
      callback(null);
    });

    return unsubscribe;
  }

  // Forçar sincronização imediata entre abas
  forceSyncBetweenTabs(): void {
    if (typeof window === 'undefined') return

    // Disparar evento para todas as abas
    window.dispatchEvent(new CustomEvent('forceBannerSync', {
      detail: { timestamp: new Date().toISOString() }
    }))

    // Enviar via BroadcastChannel
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'forceSync',
        payload: { timestamp: new Date().toISOString() }
      })
    }

    console.log('🔄 Sincronização forçada entre abas')
  }
}

export const bannerSyncService = new BannerSyncService()

// Hook para sincronização automática
export function useBannerSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const syncToFirebase = async () => {
    setIsSyncing(true)
    try {
      await bannerSyncService.syncHomepageBannersToFirebase()
      console.log('Sincronização com Firebase desativada')
      setLastSync(new Date())
    } catch (error) {
      console.error('Erro na sincronização:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const migrateToFirebase = async () => {
    setIsSyncing(true)
    try {
      await bannerSyncService.migrateLocalStorageToFirebase()
      console.log('Migração para Firebase desativada')
      setLastSync(new Date())
    } catch (error) {
      console.error('Erro na migração:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return {
    syncToFirebase,
    migrateToFirebase,
    isSyncing,
    lastSync
  }
}
