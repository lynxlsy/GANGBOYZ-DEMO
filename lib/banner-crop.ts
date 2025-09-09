// Sistema completo de crop para banners
export interface CropData {
  x: number      // Posição X em pixels
  y: number      // Posição Y em pixels
  width: number  // Largura do crop em pixels
  height: number // Altura do crop em pixels
  scale: number  // Escala/zoom (0.1 a 3.0)
  rotation: number // Rotação em graus
}

export interface BannerConfig {
  id: string
  src: string
  cropData: CropData
  containerWidth: number
  containerHeight: number
  imageWidth: number
  imageHeight: number
}

export class BannerCropManager {
  private static instance: BannerCropManager
  private configs: Map<string, BannerConfig> = new Map()

  static getInstance(): BannerCropManager {
    if (!BannerCropManager.instance) {
      BannerCropManager.instance = new BannerCropManager()
    }
    return BannerCropManager.instance
  }

  // Salvar configuração de crop
  saveCropConfig(bannerId: string, config: BannerConfig): void {
    this.configs.set(bannerId, config)
    this.persistToStorage(bannerId, config)
  }

  // Carregar configuração de crop
  loadCropConfig(bannerId: string): BannerConfig | null {
    if (this.configs.has(bannerId)) {
      return this.configs.get(bannerId)!
    }
    return this.loadFromStorage(bannerId)
  }

  // Calcular transform CSS baseado no crop
  calculateTransform(config: BannerConfig): string {
    const { cropData, containerWidth, containerHeight, imageWidth, imageHeight } = config
    
    // Para valores do sistema antigo (já em porcentagem)
    if (typeof cropData.x === 'number' && cropData.x <= 1 && cropData.x >= -1) {
      // Valores já estão em formato relativo (-1 a 1)
      const translateX = cropData.x * 50 // Usar mesmo multiplicador do preview
      const translateY = cropData.y * 50
      const scale = Math.max(0.1, cropData.scale) // Permitir escala menor para mostrar imagem inteira
      
      return `translate3d(${translateX}%, ${translateY}%, 0) scale(${scale})`
    }
    
    // Para valores em pixels (sistema novo)
    const scaleX = containerWidth / cropData.width
    const scaleY = containerHeight / cropData.height
    const scale = Math.max(scaleX, scaleY) * cropData.scale

    const translateX = -cropData.x * scale
    const translateY = -cropData.y * scale

    const rotation = cropData.rotation !== 0 ? ` rotate(${cropData.rotation}deg)` : ''

    return `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})${rotation}`
  }

  // Calcular crop baseado em coordenadas relativas
  calculateCropFromRelative(
    relativeX: number,    // -1 a 1
    relativeY: number,   // -1 a 1
    relativeScale: number, // 0.1 a 3.0
    imageWidth: number,
    imageHeight: number,
    containerWidth: number,
    containerHeight: number
  ): CropData {
    // Converter coordenadas relativas para pixels
    const centerX = imageWidth / 2
    const centerY = imageHeight / 2
    
    const cropWidth = containerWidth / relativeScale
    const cropHeight = containerHeight / relativeScale
    
    const x = centerX + (relativeX * imageWidth / 2) - cropWidth / 2
    const y = centerY + (relativeY * imageHeight / 2) - cropHeight / 2

    return {
      x: Math.max(0, Math.min(x, imageWidth - cropWidth)),
      y: Math.max(0, Math.min(y, imageHeight - cropHeight)),
      width: cropWidth,
      height: cropHeight,
      scale: relativeScale,
      rotation: 0
    }
  }

  // Converter crop para coordenadas relativas
  cropToRelative(cropData: CropData, imageWidth: number, imageHeight: number): {
    x: number
    y: number
    scale: number
  } {
    const centerX = imageWidth / 2
    const centerY = imageHeight / 2
    
    const relativeX = (cropData.x + cropData.width / 2 - centerX) / (imageWidth / 2)
    const relativeY = (cropData.y + cropData.height / 2 - centerY) / (imageHeight / 2)
    
    return {
      x: Math.max(-1, Math.min(1, relativeX)),
      y: Math.max(-1, Math.min(1, relativeY)),
      scale: cropData.scale
    }
  }

  // Persistir no localStorage
  private persistToStorage(bannerId: string, config: BannerConfig): void {
    try {
      const key = `banner-crop-${bannerId}`
      localStorage.setItem(key, JSON.stringify(config))
    } catch (error) {
      console.error('Erro ao salvar crop no localStorage:', error)
    }
  }

  // Carregar do localStorage
  private loadFromStorage(bannerId: string): BannerConfig | null {
    try {
      const key = `banner-crop-${bannerId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const config = JSON.parse(stored)
        this.configs.set(bannerId, config)
        return config
      }
    } catch (error) {
      console.error('Erro ao carregar crop do localStorage:', error)
    }
    return null
  }

  // Limpar configuração
  clearCropConfig(bannerId: string): void {
    this.configs.delete(bannerId)
    try {
      const key = `banner-crop-${bannerId}`
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Erro ao limpar crop do localStorage:', error)
    }
  }
}

// Hook para usar o sistema de crop
export function useBannerCrop(bannerId: string) {
  const manager = BannerCropManager.getInstance()
  
  const saveCrop = (config: BannerConfig) => {
    manager.saveCropConfig(bannerId, config)
  }
  
  const loadCrop = () => {
    return manager.loadCropConfig(bannerId)
  }
  
  const getTransform = (config: BannerConfig) => {
    return manager.calculateTransform(config)
  }
  
  return {
    saveCrop,
    loadCrop,
    getTransform,
    manager
  }
}
