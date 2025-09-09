"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { state, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    closeCart()
    router.push("/checkout")
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-neutral-900 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-xl font-semibold text-white">Carrinho de Compras ({totalItems})</h2>
            <Button variant="ghost" size="icon" onClick={closeCart} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-neutral-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Seu carrinho está vazio</h3>
                <p className="text-neutral-400 mb-6">Adicione alguns itens para começar</p>
                <Button onClick={closeCart} className="red-gradient text-white hover:bg-red-700">
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-neutral-800 p-4 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-neutral-400">${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 text-white hover:bg-white/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="text-white font-medium w-8 text-center">{item.quantity}</span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 text-white hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-red-400 hover:bg-red-400/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-neutral-800 p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold text-white">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full red-gradient text-white hover:bg-red-700 font-semibold py-3 red-glow"
              >
                FINALIZAR COMPRA
              </Button>

              <Button
                variant="outline"
                className="w-full red-border-dynamic red-text red-bg-hover hover:text-white bg-transparent"
                onClick={closeCart}
              >
                Continuar Comprando
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
