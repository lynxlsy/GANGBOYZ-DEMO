"use client"

import { MinimalProductCategoryPage } from "@/components/minimal-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MinimalTestMoletonsSemCapuzPage() {
  const config = getCategoryConfig('sem-capuz')
  
  if (!config) {
    return <div>Error: Invalid category configuration</div>
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <MinimalProductCategoryPage config={config} subcategoryKey="sem-capuz" />
    </div>
  )
}