"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MoletonsPage() {
  const config = getCategoryConfig('com-capuz') // Using com-capuz as base config
  
  // All subcategory keys for moletons
  const subcategoryKeys = ['com-capuz', 'sem-capuz', 'ziper']
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage 
        config={{
          ...config,
          category: 'Moletons',
          subcategory: 'Todas',
          displayName: 'Moletons',
          breadcrumb: 'Início . MOLETONS',
          description: 'Todos os produtos de moletons'
        }} 
        subcategoryKey="moletons" 
        isMainCategory={true}
        subcategoryKeys={subcategoryKeys}
      />
    </div>
  )
}