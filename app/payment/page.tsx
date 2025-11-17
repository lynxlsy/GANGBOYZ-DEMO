"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CartItem } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { MobileHeaderSubcategory } from "@/components/mobile-header-subcategory"
import { Footer } from "@/components/footer"
import { Lock } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<any>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds

  // Load checkout data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('gang-boyz-checkout-items')
      const savedData = localStorage.getItem('gang-boyz-ongoing-checkout')
      
      if (savedItems) {
        try {
          setCheckoutItems(JSON.parse(savedItems))
        } catch (error) {
          console.error('Error parsing checkout items:', error)
          setCheckoutItems([])
        }
      }
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setFormData(parsedData.formData || {})
        } catch (error) {
          console.error('Error parsing checkout data:', error)
        }
      }
    }
  }, [])

  // Timer for payment expiration
  useEffect(() => {
    if (timeLeft <= 0) {
      // Payment time expired
      localStorage.removeItem('gang-boyz-ongoing-checkout')
      localStorage.removeItem('gang-boyz-checkout-items')
      toast.error("Tempo de pagamento expirado. Por favor, refaça sua compra.")
      router.push("/")
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, router])

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate totals
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = formData.shippingCost || 0
  const discount = formData.discount || 0
  const total = subtotal - discount + shippingCost

  // Handle payment completion
  const handleCompletePayment = () => {
    if (!paymentMethod) {
      toast.error("Por favor, selecione um método de pagamento")
      return
    }

    setIsProcessing(true)
    
    try {
      // In a real implementation, this would process the payment
      // For now, we'll just simulate a successful payment
      
      // Clear cart and saved checkout data
      clearCart()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gang-boyz-ongoing-checkout')
        localStorage.removeItem('gang-boyz-checkout-items')
      }
      
      toast.success("Pagamento realizado com sucesso!")
      
      // Redirect to success page
      setTimeout(() => {
        router.push("/payment/success")
      }, 2000)
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error("Erro ao processar o pagamento. Por favor, tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/")
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Nenhum item para pagamento</h1>
          <p className="text-gray-400 mb-6">Adicione alguns produtos antes de finalizar a compra.</p>
          <Button 
            onClick={handleContinueShopping}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Continuar Comprando
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Mobile Header for Payment Page */}
      <MobileHeaderSubcategory />
      
      {/* Black spacer for desktop header separation */}
      <div className="hidden md:block h-20 bg-black"></div>
      
      <main className="pt-0">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Pagamento</h1>
          
          {/* Timer Alert */}
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6 text-center">
            <p className="text-yellow-200 font-medium">
              Tempo restante para pagamento: <span className="font-bold text-yellow-100">{formatTime(timeLeft)}</span>
            </p>
            <p className="text-yellow-300 text-sm mt-1">
              Após o tempo expirar, sua compra será cancelada
            </p>
          </div>
          
          {/* Responsive 2x2 Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary - Top Left */}
            <div className="bg-neutral-900 rounded-lg p-4 md:p-6 md:row-span-2 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="flex-grow overflow-hidden flex flex-col">
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                  <div className="space-y-4 mb-6">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="border-b border-neutral-800 pb-4">
                        <div className="flex gap-4">
                          <img 
                            src={item.image || "/placeholder-default.svg"} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm md:text-base truncate">{item.name}</h3>
                            <p className="text-neutral-400 text-xs md:text-sm">Tamanho: {item.size || "único"}</p>
                            {item.color && (
                              <p className="text-neutral-400 text-xs md:text-sm">Cor: {item.color}</p>
                            )}
                            <p className="text-neutral-400 text-xs md:text-sm">Quantidade: {item.quantity}</p>
                          </div>
                          <div className="font-medium text-sm">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-neutral-800 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-400 text-sm">Subtotal</span>
                  <span className="text-sm">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-400 text-sm">Desconto</span>
                    <span className="text-green-500 text-sm">- R$ {discount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-400 text-sm">Frete</span>
                  <span className="text-sm">R$ {shippingCost.toFixed(2).replace(".", ",")}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-neutral-800">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Methods - Top Right */}
            <div className="bg-neutral-900 rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4">Método de Pagamento</h2>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center p-3 bg-neutral-800 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={paymentMethod === "credit"}
                      onChange={() => setPaymentMethod("credit")}
                      className="h-4 w-4 text-red-600"
                    />
                    <span className="ml-3 text-sm">Cartão de Crédito</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-neutral-800 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit"
                      checked={paymentMethod === "debit"}
                      onChange={() => setPaymentMethod("debit")}
                      className="h-4 w-4 text-red-600"
                    />
                    <span className="ml-3 text-sm">Cartão de Débito</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-neutral-800 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={() => setPaymentMethod("pix")}
                      className="h-4 w-4 text-red-600"
                    />
                    <span className="ml-3 text-sm">PIX</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-neutral-800 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="boleto"
                      checked={paymentMethod === "boleto"}
                      onChange={() => setPaymentMethod("boleto")}
                      className="h-4 w-4 text-red-600"
                    />
                    <span className="ml-3 text-sm">Boleto Bancário</span>
                  </label>
                </div>
                
                {paymentMethod === "credit" || paymentMethod === "debit" ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Validade</label>
                        <input 
                          type="text" 
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="MM/AA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input 
                          type="text" 
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nome completo"
                      />
                    </div>
                  </div>
                ) : null}
                
                {paymentMethod === "pix" ? (
                  <div className="mt-4 p-4 bg-neutral-800 rounded-lg text-center">
                    <p className="text-sm text-neutral-300">Após confirmar o pagamento, você será redirecionado para a tela do PIX</p>
                  </div>
                ) : null}
                
                {paymentMethod === "boleto" ? (
                  <div className="mt-4 p-4 bg-neutral-800 rounded-lg text-center">
                    <p className="text-sm text-neutral-300">O boleto será gerado após a confirmação do pagamento</p>
                  </div>
                ) : null}
                
                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center">
                  <Lock className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-300">
                    Pagamento 100% seguro. Seus dados são protegidos com criptografia de ponta a ponta.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment Button - Bottom Left */}
            <div className="bg-neutral-900 rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Pagamento</h2>
              
              <div className="pt-2">
                <Button
                  onClick={handleCompletePayment}
                  disabled={isProcessing || !paymentMethod}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isProcessing ? "Processando..." : `Pagar R$ ${total.toFixed(2).replace(".", ",")}`}
                </Button>
                
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full mt-3 border border-gray-600 text-black hover:bg-gray-200 py-3 rounded-lg bg-white"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Payment Button for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 p-4 border-t border-neutral-800 shadow-lg">
          <div className="space-y-3">
            <Button
              onClick={handleCompletePayment}
              disabled={isProcessing || !paymentMethod}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isProcessing ? "Processando..." : `Pagar R$ ${total.toFixed(2).replace(".", ",")}`}
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border border-gray-600 text-black hover:bg-gray-200 py-3 rounded-lg bg-white font-semibold"
            >
              Voltar
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}