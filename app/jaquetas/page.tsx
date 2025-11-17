"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function JaquetasPage() {
  const config = getCategoryConfig('casual') // Using casual as base config
  
  // All subcategory keys for jaquetas
  const subcategoryKeys = ['casual', 'esportiva', 'social']
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage 
        config={{
          ...config,
          category: 'Jaquetas',
          subcategory: 'Todas',
          displayName: 'Jaquetas',
          breadcrumb: 'Início . JAQUETAS',
          description: 'Todos os produtos de jaquetas'
        }} 
        subcategoryKey="jaquetas" 
        isMainCategory={true}
        subcategoryKeys={subcategoryKeys}
      />
    </div>
  )
}