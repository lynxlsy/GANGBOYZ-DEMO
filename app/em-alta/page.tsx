"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductTemplate } from "@/components/product-template"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"
import { Flame } from "lucide-react"
import Link from "next/link"
import { eventManager } from "@/lib/event-manager"

export default function EmAltaPage() {
  const { products } = useProducts()
  const { addItem } = useCart()

  // Filtrar produtos marcados como "Promoção" ou com label "HOT" ou destacados para "Em Alta"
  const emAlta = products.filter(product => 
    product.isPromotion === true || 
    product.destacarEmAlta === true ||
    product.categories?.some(cat => cat.toLowerCase().includes("em alta"))
  )

  // Escutar eventos de produtos criados e carregar automaticamente
  useEffect(() => {
    const handleProductCreated = () => {
      // Removido console.log para evitar loop de logs
      // Forçar atualização do contexto
      eventManager.emit('forceProductsReload')
    }

    eventManager.subscribe('testProductCreated', handleProductCreated)
    
    return () => {
      eventManager.unsubscribe('testProductCreated', handleProductCreated)
    }
  }, [])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Espaçamento para mover a faixa mais 2cm para baixo */}
      <div className="h-[180px]"></div>
      
      <main className="pt-0">
        <div className="flex min-h-screen">
          {/* Conteúdo Principal */}
          <div className="flex-1 bg-black">
            {/* Header da Categoria */}
            <div className="px-8 py-8">
              <div className="mb-4 flex items-center">
                <Flame className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Em Alta</h1>
                  <p className="text-gray-400">Produtos encontrados: {emAlta.length}</p>
                </div>
              </div>
            </div>

            {/* Grid de Cards */}
            <div className="py-4 pl-8">
              {emAlta.length > 0 ? (
                <div className="flex flex-wrap gap-8">
                  {emAlta.map((product) => (
                    <ProductTemplate
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-lg">
                    Nenhum produto encontrado nesta categoria.
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    Os produtos aparecerão aqui quando forem adicionados.
                  </div>
                </div>
              )}
            </div>

            {/* Estatísticas */}
            {emAlta.length > 0 && (
              <div className="px-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">{emAlta.length}</div>
                    <div className="text-gray-400">Produtos em Alta</div>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {emAlta.filter(p => p.isPromotion).length}
                    </div>
                    <div className="text-gray-400">Em Promoção</div>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {emAlta.filter(p => p.isNew).length}
                    </div>
                    <div className="text-gray-400">Novos</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}