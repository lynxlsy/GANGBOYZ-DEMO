"use client"

import { TestProductCategoryPage } from "@/components/test-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function Test2MoletonsSemCapuzPage() {
  const config = getCategoryConfig('sem-capuz')
  
  console.log("Config:", config)
  
  if (!config) {
    return <div>Error: Invalid category configuration</div>
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <TestProductCategoryPage config={config} subcategoryKey="sem-capuz" />
    </div>
  )
}