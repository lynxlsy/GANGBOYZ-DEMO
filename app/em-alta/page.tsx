"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function EmAltaPage() {
  const config = getCategoryConfig('em-alta')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage 
        config={config} 
        subcategoryKey="em-alta" 
      />
    </div>
  )
}