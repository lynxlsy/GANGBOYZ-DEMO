"use client"

import { usePathname } from "next/navigation"

export function useProductPage() {
  const pathname = usePathname()
  
  // Páginas que têm sidebar de produtos
  const productPages = [
    '/camisetas',
    '/moletons', 
    '/jaquetas',
    '/calcas',
    '/shorts-bermudas',
    '/lancamentos',
    '/em-alta'
  ]
  
  const isProductPage = pathname ? productPages.some(page => pathname.startsWith(page)) : false
  
  // Check if we're on a product detail page
  const isProductDetailPage = pathname ? pathname.startsWith('/produto/') : false
  
  return { isProductPage, isProductDetailPage, pathname }
}