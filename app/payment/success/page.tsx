"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()

  const handleContinueShopping = () => {
    router.push("/")
  }

  const handleViewOrders = () => {
    // In a real implementation, this would redirect to the user's order history
    router.push("/minha-conta/pedidos")
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-400 mb-6">
          Seu pagamento foi processado com sucesso. Em breve você receberá um e-mail com os detalhes do pedido.
        </p>
        
        <div className="bg-neutral-900 rounded-lg p-4 mb-6 text-left">
          <h2 className="font-bold mb-2">Detalhes do Pedido</h2>
          <div className="text-sm space-y-1">
            <p>Número do Pedido: <span className="text-neutral-400">#GBZ-2023-001</span></p>
            <p>Data: <span className="text-neutral-400">15/11/2025</span></p>
            <p>Total: <span className="text-neutral-400">R$ 129,90</span></p>
            <p>Status: <span className="text-green-500">Confirmado</span></p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleViewOrders}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex-1"
          >
            Ver Meus Pedidos
          </Button>
          <Button 
            onClick={handleContinueShopping}
            variant="outline"
            className="border border-gray-600 text-black hover:bg-gray-200 px-6 py-3 rounded-lg flex-1 bg-white"
          >
            Continuar Comprando
          </Button>
        </div>
      </div>
    </div>
  )
}