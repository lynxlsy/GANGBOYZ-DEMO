"use client"

import { useState, useEffect } from 'react'
import { BannerConfig, getBannerConfig, BANNER_STRIP_CONFIGS } from '@/lib/banner-config'

export interface BannerData {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: {
    src: string
    ratio: string
    scale: number
    tx: number
    ty: number
  }
}

export interface BannerStripData {
  text: string
  isActive: boolean
  emoji: string
  bgColor: string
  height: number
  speed: number
  repetitions: number
  position?: string
  textAnimation?: string
}

export function useBanner(bannerId: string) {
  const [banner, setBanner] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const config = getBannerConfig(bannerId)
  
  useEffect(() => {
    if (!config) {
      setError(`Banner config not found for ID: ${bannerId}`)
      setLoading(false)
      return
    }

    const loadBanner = () => {
      try {
        const savedBanners = localStorage.getItem(config.storageKey)
        if (savedBanners) {
          const banners: BannerData[] = JSON.parse(savedBanners)
          const bannerData = banners.find(b => b.id === bannerId)
          if (bannerData) {
            setBanner(bannerData)
          } else {
            // Criar banner padrão se não existir
            const defaultBanner: BannerData = {
              id: bannerId,
              name: config.name,
              description: config.description,
              currentImage: config.defaultImage,
              mediaType: 'image',
              dimensions: config.dimensions,
              format: config.mediaTypes.join(', '),
              position: config.position
            }
            setBanner(defaultBanner)
            
            // Add the default banner to localStorage
            banners.push(defaultBanner)
            localStorage.setItem(config.storageKey, JSON.stringify(banners))
          }
        } else {
          // Criar banner padrão se não houver dados salvos
          const defaultBanner: BannerData = {
            id: bannerId,
            name: config.name,
            description: config.description,
            currentImage: config.defaultImage,
            mediaType: 'image',
            dimensions: config.dimensions,
            format: config.mediaTypes.join(', '),
            position: config.position
          }
          setBanner(defaultBanner)
          
          // Save the default banner to localStorage
          localStorage.setItem(config.storageKey, JSON.stringify([defaultBanner]))
        }
        setError(null)
      } catch (err) {
        console.error(`Erro ao carregar banner ${bannerId}:`, err)
        setError(`Erro ao carregar banner: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    // Carregar inicialmente
    loadBanner()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === config.storageKey) {
        loadBanner()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadBanner()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(config.eventName, handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(config.eventName, handleCustomStorageChange)
    }
  }, [bannerId, config])

  const updateBanner = (updates: Partial<BannerData>) => {
    if (!config || !banner) return

    try {
      const savedBanners = localStorage.getItem(config.storageKey)
      let banners: BannerData[] = savedBanners ? JSON.parse(savedBanners) : []
      
      const bannerIndex = banners.findIndex(b => b.id === bannerId)
      const updatedBanner = { ...banner, ...updates }
      
      if (bannerIndex >= 0) {
        banners[bannerIndex] = updatedBanner
      } else {
        banners.push(updatedBanner)
      }
      
      localStorage.setItem(config.storageKey, JSON.stringify(banners))
      setBanner(updatedBanner)
      
      // Log the update for debugging
      console.log(`Banner ${bannerId} updated:`, updatedBanner)
      
      // Disparar evento customizado
      window.dispatchEvent(new CustomEvent(config.eventName))
      
      // For homepage banners, also dispatch a general update event
      if (config.storageKey === "gang-boyz-homepage-banners") {
        window.dispatchEvent(new CustomEvent("homepageBannerUpdate"))
      }
      
      return true
    } catch (err) {
      console.error(`Erro ao atualizar banner ${bannerId}:`, err)
      return false
    }
  }

  const deleteBanner = () => {
    if (!config) return

    try {
      const savedBanners = localStorage.getItem(config.storageKey)
      if (savedBanners) {
        const banners: BannerData[] = JSON.parse(savedBanners)
        const filteredBanners = banners.filter(b => b.id !== bannerId)
        localStorage.setItem(config.storageKey, JSON.stringify(filteredBanners))
        setBanner(null)
        
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent(config.eventName))
      }
      return true
    } catch (err) {
      console.error(`Erro ao deletar banner ${bannerId}:`, err)
      return false
    }
  }

  return {
    banner,
    loading,
    error,
    config,
    updateBanner,
    deleteBanner
  }
}

export function useBannerStrip(stripType: 'homepage' | 'categoryPages') {
  const [stripData, setStripData] = useState<BannerStripData | null>(null)
  const [loading, setLoading] = useState(true)

  const config = stripType === 'homepage' 
    ? BANNER_STRIP_CONFIGS.homepage 
    : BANNER_STRIP_CONFIGS.categoryPages

  useEffect(() => {
    const loadStripData = () => {
      try {
        const savedData = localStorage.getItem(config.storageKey)
        if (savedData) {
          setStripData(JSON.parse(savedData))
        } else {
          setStripData(config.defaultSettings)
        }
      } catch (err) {
        console.error(`Erro ao carregar strip ${stripType}:`, err)
        setStripData(config.defaultSettings)
      } finally {
        setLoading(false)
      }
    }

    loadStripData()

    // Escutar mudanças
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === config.storageKey) {
        loadStripData()
      }
    }

    const handleCustomChange = () => {
      loadStripData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(config.eventName, handleCustomChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(config.eventName, handleCustomChange)
    }
  }, [stripType, config])

  const updateStripData = (updates: Partial<BannerStripData>) => {
    try {
      const newData = { ...stripData, ...updates } as BannerStripData
      localStorage.setItem(config.storageKey, JSON.stringify(newData))
      setStripData(newData)
      
      // Disparar evento customizado
      window.dispatchEvent(new CustomEvent(config.eventName))
      
      return true
    } catch (err) {
      console.error(`Erro ao atualizar strip ${stripType}:`, err)
      return false
    }
  }

  return {
    stripData,
    loading,
    config,
    updateStripData
  }
}
