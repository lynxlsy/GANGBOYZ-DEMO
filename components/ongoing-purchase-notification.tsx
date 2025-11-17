"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface SavedCheckoutData {
  items: any[]
  formData: any
  timestamp: number
  subtotal: number
}

export function OngoingPurchaseNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [savedCheckoutData, setSavedCheckoutData] = useState<SavedCheckoutData | null>(null)
  const { clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    // Check for saved checkout data on component mount
    const checkSavedCheckout = () => {
      if (typeof window === 'undefined') return
      
      const savedData = localStorage.getItem('gang-boyz-ongoing-checkout')
      if (savedData) {
        try {
          const parsedData: SavedCheckoutData = JSON.parse(savedData)
          // Check if the saved data is less than 1 hour old
          const now = Date.now()
          const minutesDiff = (now - parsedData.timestamp) / (1000 * 60)
          
          if (minutesDiff < 60) {
            setSavedCheckoutData(parsedData)
            setShowNotification(true)
          } else {
            // Remove expired data
            localStorage.removeItem('gang-boyz-ongoing-checkout')
          }
        } catch (error) {
          console.error('Error parsing saved checkout data:', error)
          localStorage.removeItem('gang-boyz-ongoing-checkout')
        }
      }
    }

    checkSavedCheckout()
  }, [])

  const handleResumeCheckout = () => {
    if (savedCheckoutData) {
      // Store the items in localStorage for the checkout page
      localStorage.setItem('gang-boyz-checkout-items', JSON.stringify(savedCheckoutData.items))
      // Redirect to checkout page
      router.push('/checkout')
    }
    setShowNotification(false)
  }

  const handleDiscardCheckout = () => {
    // Remove saved checkout data
    localStorage.removeItem('gang-boyz-ongoing-checkout')
    setShowNotification(false)
  }

  if (!showNotification || !savedCheckoutData) {
    return null
  }

  const itemCount = savedCheckoutData.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="fixed bottom-4 right-4 z-[10000] w-full max-w-sm">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white">Compra em Andamento</h3>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-neutral-300 text-sm mb-3">
          Você tem uma compra em andamento com {itemCount} {itemCount === 1 ? 'item' : 'itens'} 
          (Total: R$ {savedCheckoutData.subtotal.toFixed(2).replace('.', ',')})
        </p>
        <p className="text-yellow-300 text-xs mb-3">
          Tempo restante para pagamento: 1 hora
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handleResumeCheckout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2"
          >
            Retomar Compra
          </Button>
          <Button
            onClick={handleDiscardCheckout}
            variant="outline"
            className="flex-1 border-neutral-600 text-black hover:bg-neutral-800 text-sm py-2"
          >
            Descartar
          </Button>
        </div>
      </div>
    </div>
  )
}