export interface CategoryConfig {
  category: string
  subcategory: string
  displayName: string
  breadcrumb: string
  description: string
  adminTitle: string
  adminDescription: string
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  // Camisetas
  'manga-curta': {
    category: 'Camisetas',
    subcategory: 'Manga Curta',
    displayName: 'Camisetas Manga Curta',
    breadcrumb: 'Início . CAMISETAS / MANGA CURTA',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Camisetas Manga Curta',
    adminDescription: 'Gerencie os produtos da categoria Manga Curta'
  },
  'manga-longa': {
    category: 'Camisetas',
    subcategory: 'Manga Longa',
    displayName: 'Camisetas Manga Longa',
    breadcrumb: 'Início . CAMISETAS / MANGA LONGA',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Camisetas Manga Longa',
    adminDescription: 'Gerencie os produtos da categoria Manga Longa'
  },
  'basica': {
    category: 'Camisetas',
    subcategory: 'Básica',
    displayName: 'Camisetas Básica',
    breadcrumb: 'Início . CAMISETAS / BÁSICA',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Camisetas Básica',
    adminDescription: 'Gerencie os produtos da categoria Básica'
  },
  'regata': {
    category: 'Camisetas',
    subcategory: 'Regata',
    displayName: 'Camisetas Regata',
    breadcrumb: 'Início . CAMISETAS / REGATA',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Camisetas Regata',
    adminDescription: 'Gerencie os produtos da categoria Regata'
  },
  'tank-top': {
    category: 'Camisetas',
    subcategory: 'Tank Top',
    displayName: 'Camisetas Tank Top',
    breadcrumb: 'Início . CAMISETAS / TANK TOP',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Camisetas Tank Top',
    adminDescription: 'Gerencie os produtos da categoria Tank Top'
  },
  'polo': {
    category: 'Camisetas',
    subcategory: 'Polo',
    displayName: 'Camisetas Polo',
    breadcrumb: 'Início . CAMISETAS / POLO',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Camisetas Polo',
    adminDescription: 'Gerencie os produtos da categoria Polo'
  },
  
  // Moletons
  'com-capuz': {
    category: 'Moletons',
    subcategory: 'Com Capuz',
    displayName: 'Moletons Com Capuz',
    breadcrumb: 'Início . MOLETONS / COM CAPUZ',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Moletons Com Capuz',
    adminDescription: 'Gerencie os produtos da categoria Com Capuz'
  },
  'sem-capuz': {
    category: 'Moletons',
    subcategory: 'Sem Capuz',
    displayName: 'Moletons Sem Capuz',
    breadcrumb: 'Início . MOLETONS / SEM CAPUZ',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Moletons Sem Capuz',
    adminDescription: 'Gerencie os produtos da categoria Sem Capuz'
  },
  'ziper': {
    category: 'Moletons',
    subcategory: 'Zíper',
    displayName: 'Moletons Zíper',
    breadcrumb: 'Início . MOLETONS / ZÍPER',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Moletons Zíper',
    adminDescription: 'Gerencie os produtos da categoria Zíper'
  },
  
  // Jaquetas
  'casual': {
    category: 'Jaquetas',
    subcategory: 'Casual',
    displayName: 'Jaquetas Casual',
    breadcrumb: 'Início . JAQUETAS / CASUAL',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Jaquetas Casual',
    adminDescription: 'Gerencie os produtos da categoria Casual'
  },
  'esportiva': {
    category: 'Jaquetas',
    subcategory: 'Esportiva',
    displayName: 'Jaquetas Esportiva',
    breadcrumb: 'Início . JAQUETAS / ESPORTIVA',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Jaquetas Esportiva',
    adminDescription: 'Gerencie os produtos da categoria Esportiva'
  },
  'social': {
    category: 'Jaquetas',
    subcategory: 'Social',
    displayName: 'Jaquetas Social',
    breadcrumb: 'Início . JAQUETAS / SOCIAL',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Jaquetas Social',
    adminDescription: 'Gerencie os produtos da categoria Social'
  },
  
  // Calças
  'jeans': {
    category: 'Calças',
    subcategory: 'Jeans',
    displayName: 'Calças Jeans',
    breadcrumb: 'Início . CALÇAS / JEANS',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Calças Jeans',
    adminDescription: 'Gerencie os produtos da categoria Jeans'
  },
  'moletom': {
    category: 'Calças',
    subcategory: 'Moletom',
    displayName: 'Calças Moletom',
    breadcrumb: 'Início . CALÇAS / MOLETOM',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Calças Moletom',
    adminDescription: 'Gerencie os produtos da categoria Moletom'
  },
  'social-calca': {
    category: 'Calças',
    subcategory: 'Social',
    displayName: 'Calças Social',
    breadcrumb: 'Início . CALÇAS / SOCIAL',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Calças Social',
    adminDescription: 'Gerencie os produtos da categoria Social'
  },
  
  // Shorts/Bermudas
  'esportivo': {
    category: 'Shorts/Bermudas',
    subcategory: 'Esportivo',
    displayName: 'Shorts/Bermudas Esportivo',
    breadcrumb: 'Início . SHORTS/BERMUDAS / ESPORTIVO',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Shorts/Bermudas Esportivo',
    adminDescription: 'Gerencie os produtos da categoria Esportivo'
  },
  'casual-short': {
    category: 'Shorts/Bermudas',
    subcategory: 'Casual',
    displayName: 'Shorts/Bermudas Casual',
    breadcrumb: 'Início . SHORTS/BERMUDAS / CASUAL',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Shorts/Bermudas Casual',
    adminDescription: 'Gerencie os produtos da categoria Casual'
  },
  'praia': {
    category: 'Shorts/Bermudas',
    subcategory: 'Praia',
    displayName: 'Shorts/Bermudas Praia',
    breadcrumb: 'Início . SHORTS/BERMUDAS / PRAIA',
    description: 'Produtos encontrados',
    adminTitle: 'Admin - Shorts/Bermudas Praia',
    adminDescription: 'Gerencie os produtos da categoria Praia'
  },
  
  // Em Alta
  'em-alta': {
    category: 'Em Alta',
    subcategory: 'Todas',
    displayName: 'Em Alta',
    breadcrumb: 'Início . EM ALTA',
    description: 'Produtos em alta',
    adminTitle: 'Admin - Em Alta',
    adminDescription: 'Gerencie os produtos da categoria Em Alta'
  }
}

export function getCategoryConfig(subcategoryKey: string): CategoryConfig {
  return CATEGORY_CONFIGS[subcategoryKey] || CATEGORY_CONFIGS['manga-curta']
}
