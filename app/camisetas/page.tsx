"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CamisetasPage() {
  const config = getCategoryConfig('manga-curta') // Using manga-curta as base config
  
  // All subcategory keys for camisetas
  const subcategoryKeys = ['manga-curta', 'manga-longa', 'basica', 'regata', 'tank-top', 'polo']
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage 
        config={{
          ...config,
          category: 'Camisetas',
          subcategory: 'Todas',
          displayName: 'Camisetas',
          breadcrumb: 'Início . CAMISETAS',
          description: 'Todos os produtos de camisetas'
        }} 
        subcategoryKey="camisetas" 
        isMainCategory={true}
        subcategoryKeys={subcategoryKeys}
      />
    </div>
  )
}