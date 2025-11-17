"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminProductModal } from "@/components/admin-product-modal"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  color: string
  category: string
  subcategory?: string
  label?: string
  labelType?: 'promocao' | 'esgotado' | 'personalizada'
  // Adicionando campos de estoque
  stock?: number
  sizeStock?: Record<string, number>
  // Adicionando campos para recomendações
  availableUnits?: number
  availableSizes?: string[]
  sizeQuantities?: Record<string, number>
  recommendationCategory?: string
  recommendationSubcategory?: string
  // Adicionando campos para destacar em diferentes seções
  destacarEmRecomendacoes?: boolean
  destacarEmOfertas?: boolean
  destacarEmAlta?: boolean
  destacarLancamentos?: boolean
  // Adicionando campo de descrição opcional
  description?: string
  // Adicionando campos de informações do produto
  freeShippingText?: string
  freeShippingThreshold?: string
  pickupText?: string
  pickupStatus?: string
  material?: string
  weight?: string
  dimensions?: string
  origin?: string
  care?: string
  warranty?: string
}

interface AdminEditModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSave: (product: Product) => void
  title: string
  subcategory: string
  mode: 'create' | 'edit'
}

export function AdminEditModal({ 
  isOpen, 
  onClose, 
  product, 
  onSave, 
  title, 
  subcategory,
  mode 
}: AdminEditModalProps) {
  if (!isOpen) return null

  return (
    <AdminProductModal
      isOpen={isOpen}
      onClose={onClose}
      product={product}
      onSave={onSave}
      title={title}
      subcategory={subcategory}
      mode={mode}
    />
  )
}