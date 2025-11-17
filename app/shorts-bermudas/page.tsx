"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function ShortsBermudasPage() {
  const config = getCategoryConfig('esportivo') // Using esportivo as base config
  
  // All subcategory keys for shorts-bermudas
  const subcategoryKeys = ['esportivo', 'casual-short', 'praia']
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage 
        config={{
          ...config,
          category: 'Shorts/Bermudas',
          subcategory: 'Todas',
          displayName: 'Shorts/Bermudas',
          breadcrumb: 'Início . SHORTS/BERMUDAS',
          description: 'Todos os produtos de shorts/bermudas'
        }} 
        subcategoryKey="shorts-bermudas" 
        isMainCategory={true}
        subcategoryKeys={subcategoryKeys}
      />
    </div>
  )
}