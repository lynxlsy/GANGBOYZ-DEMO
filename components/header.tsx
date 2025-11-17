"use client"

import { usePathname } from "next/navigation"
import { HeaderHomepage } from "@/components/header-homepage"
import { HeaderSubcategory } from "@/components/header-subcategory"

export function Header() {
  const pathname = usePathname()
  
  // Verificar se estamos em uma página de subcategoria ou categoria principal
  const isSubcategoryPage = pathname && (
    pathname.startsWith('/explore/') || 
    pathname === '/explore' ||
    pathname.startsWith('/camisetas/') ||
    pathname.startsWith('/moletons/') ||
    pathname.startsWith('/jaquetas/') ||
    pathname.startsWith('/calcas/') ||
    pathname.startsWith('/shorts-bermudas/') ||
    pathname === '/camisetas' ||
    pathname === '/moletons' ||
    pathname === '/jaquetas' ||
    pathname === '/calcas' ||
    pathname === '/shorts-bermudas'
  )
  
  // Verificar se estamos em uma página de detalhe de produto
  const isProductDetailPage = pathname && pathname.startsWith('/produto/')
  
  // Renderizar o header apropriado com base na página
  if (isSubcategoryPage) {
    return <HeaderSubcategory />
  }
  
  if (isProductDetailPage) {
    // For product detail pages, we use HeaderHomepage with mobile header visible
    return <HeaderHomepage />
  }
  
  return <HeaderHomepage />
}