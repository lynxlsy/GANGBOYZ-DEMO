"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function TestMoletonsSemCapuzPage() {
  const config = getCategoryConfig('sem-capuz')
  
  console.log("Config:", config)
  
  if (!config) {
    return <div>Error: Invalid category configuration</div>
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="sem-capuz" />
    </div>
  )
}