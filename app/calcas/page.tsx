"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CalcasPage() {
  const config = getCategoryConfig('jeans') // Using jeans as base config
  
  // All subcategory keys for calcas
  const subcategoryKeys = ['jeans', 'moletom', 'social-calca']
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage 
        config={{
          ...config,
          category: 'Calças',
          subcategory: 'Todas',
          displayName: 'Calças',
          breadcrumb: 'Início . CALÇAS',
          description: 'Todos os produtos de calças'
        }} 
        subcategoryKey="calcas" 
        isMainCategory={true}
        subcategoryKeys={subcategoryKeys}
      />
    </div>
  )
}