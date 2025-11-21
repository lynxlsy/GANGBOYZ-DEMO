export interface BannerConfig {
  id: string
  name: string
  description: string
  aspectRatio: string // "16:9", "3:1", "2:1", etc.
  dimensions: string // "1920x1080px", "1248x624px", etc.
  position: string // "Hero Section", "Footer", "Category Pages", etc.
  defaultImage: string
  mediaTypes: ('image' | 'video' | 'gif')[]
  maxFileSize: {
    image: string // "5MB"
    video: string // "10MB"
  }
  cropEnabled: boolean
  storageKey: string // localStorage key
  eventName: string // custom event name for updates
}

export const BANNER_CONFIGS: BannerConfig[] = [
  {
    id: "hero-banner-1",
    name: "Banner Principal 1 (Hero)",
    description: "Primeiro banner do carrossel principal da página inicial",
    aspectRatio: "16:9",
    dimensions: "1920x1080px",
    position: "Background da seção hero (abaixo da faixa de aviso)",
    defaultImage: "/placeholder-default.svg",
    mediaTypes: ['image', 'video', 'gif'],
    maxFileSize: {
      image: "5MB",
      video: "10MB"
    },
    cropEnabled: true,
    storageKey: "gang-boyz-homepage-banners",
    eventName: "bannerUpdated"
  },
  {
    id: "hero-banner-2",
    name: "Banner Principal 2 (Hero)",
    description: "Segundo banner do carrossel principal da página inicial",
    aspectRatio: "1507:1333",
    dimensions: "1507x1333px",
    position: "Background da seção hero (abaixo da faixa de aviso)",
    defaultImage: "/placeholder-default.svg",
    mediaTypes: ['image', 'video', 'gif'],
    maxFileSize: {
      image: "5MB",
      video: "10MB"
    },
    cropEnabled: true,
    storageKey: "gang-boyz-homepage-banners",
    eventName: "bannerUpdated"
  },
  {
    id: "offers-banner",
    name: "Banner de Ofertas Especiais",
    description: "Banner de ofertas especiais, exibido acima dos produtos em destaque",
    aspectRatio: "2:1",
    dimensions: "1248x624px",
    position: "Seção HOT (abaixo do header)",
    defaultImage: "/placeholder-default.svg",
    mediaTypes: ['image', 'video', 'gif'],
    maxFileSize: {
      image: "5MB",
      video: "10MB"
    },
    cropEnabled: true,
    storageKey: "gang-boyz-homepage-banners",
    eventName: "bannerUpdated"
  },
  {
    id: "footer-banner",
    name: "Banner Footer",
    description: "Banner que aparece antes do footer em todas as páginas",
    aspectRatio: "2:1",
    dimensions: "1248x624px",
    position: "Antes do Footer (em todas as páginas)",
    defaultImage: "/placeholder-default.svg",
    mediaTypes: ['image', 'video', 'gif'],
    maxFileSize: {
      image: "5MB",
      video: "10MB"
    },
    cropEnabled: true,
    storageKey: "gang-boyz-homepage-banners",
    eventName: "bannerUpdated"
  }
]

export const BANNER_STRIP_CONFIGS = {
  homepage: {
    id: "homepage-banner-strip",
    name: "Faixa de Aviso Superior",
    description: "Faixa de aviso que aparece no topo da homepage",
    storageKey: "gang-boyz-homepage-banner-strip",
    eventName: "bannerStripUpdated",
    defaultSettings: {
      text: "SITE DEMONSTRATIVO",
      isActive: true,
      emoji: "",
      bgColor: "black",
      height: 38,
      speed: 50,
      repetitions: 4,
      textAnimation: "scroll"
    }
  },
  categoryPages: {
    id: "category-banner-strip",
    name: "Faixa das Páginas de Categoria",
    description: "Faixa de aviso que aparece nas páginas de categoria",
    storageKey: "demo-banner-settings",
    eventName: "demoBannerSettingsUpdated",
    defaultSettings: {
      text: "SITE DEMONSTRATIVO",
      isActive: true,
      emoji: "",
      bgColor: "black",
      height: 38,
      speed: 50,
      repetitions: 4,
      textAnimation: "scroll"
    }
  }
}

// Função para criar um novo banner config rapidamente
export function createBannerConfig(
  id: string,
  name: string,
  description: string,
  aspectRatio: string,
  dimensions: string,
  position: string,
  options: Partial<BannerConfig> = {}
): BannerConfig {
  const [width, height] = dimensions.replace('px', '').split('x').map(Number)
  const ratio = `${width}:${height}`
  
  return {
    id,
    name,
    description,
    aspectRatio: ratio,
    dimensions,
    position,
    defaultImage: "/placeholder-default.svg",
    mediaTypes: ['image', 'video', 'gif'],
    maxFileSize: {
      image: "5MB",
      video: "10MB"
    },
    cropEnabled: true,
    storageKey: "gang-boyz-homepage-banners",
    eventName: "bannerUpdated",
    ...options
  }
}

// Função para obter configuração de banner por ID
export function getBannerConfig(id: string): BannerConfig | undefined {
  return BANNER_CONFIGS.find(config => config.id === id)
}

// Função para obter todos os banners de uma storage key
export function getBannersByStorageKey(storageKey: string): BannerConfig[] {
  return BANNER_CONFIGS.filter(config => config.storageKey === storageKey)
}
