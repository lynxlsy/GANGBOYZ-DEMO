"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useProducts } from "@/lib/products-context-simple"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AvailableCouponsList } from "@/components/available-coupons-list"
import { CartItem } from "@/lib/cart-context"

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart()
  const { products } = useProducts()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get checkout items from localStorage
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  
  useEffect(() => {
    // Load checkout items from localStorage
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('gang-boyz-checkout-items')
      if (savedItems) {
        try {
          setCheckoutItems(JSON.parse(savedItems))
        } catch (error) {
          console.error('Error parsing checkout items:', error)
          setCheckoutItems([])
        }
      }
    }
  }, [])
  
  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    couponCode: "",
    promoCode: "",
    cep: "",
    city: "",
    neighborhood: "",
    street: "",
    streetNumber: "",
    referencePoint: "",
    complement: ""
  })
  
  // Shipping information
  const [shippingInfo, setShippingInfo] = useState({
    city: "",
    state: "",
    shippingCost: 0,
    deliveryTime: 0,
    isValidCep: false
  })
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  
  // Discount states
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState("") // 'coupon' or 'promo'
  
  // Calculate subtotal
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Calculate total items
  const totalItems = checkoutItems.reduce((sum, item) => sum + item.quantity, 0)
  
  // Calculate total with discount and shipping
  const totalWithDiscount = subtotal - discount + shippingInfo.shippingCost
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Calculate shipping based on ZIP code
  const calculateShipping = async () => {
    if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
      toast.error("Por favor, informe um CEP válido com 8 dígitos")
      return
    }
    
    setIsCalculatingShipping(true)
    
    try {
      // Fetch real address data from ViaCEP API
      const cleanCep = formData.cep.replace(/\D/g, '')
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data')
      }
      
      const addressData = await response.json()
      
      // Check if CEP is valid
      if (addressData.erro) {
        toast.error("CEP não encontrado. Por favor, verifique o CEP informado.")
        setIsCalculatingShipping(false)
        return
      }
      
      // Update form data with address information
      setFormData(prev => ({
        ...prev,
        city: addressData.localidade,
        neighborhood: addressData.bairro,
        street: addressData.logradouro,
        state: addressData.uf
      }))
      
      // Calculate shipping cost based on state
      const state = addressData.uf
      let shippingCost = 0
      let deliveryTime = 3
      
      if (state !== "SP") {
        // Base cost for other states
        shippingCost = 15
        
        // Increase cost based on region
        switch (state) {
          case "RJ":
          case "MG":
          case "ES":
            shippingCost = 20
            deliveryTime = 5
            break
          case "PR":
          case "SC":
          case "RS":
            shippingCost = 25
            deliveryTime = 7
            break
          case "MS":
          case "MT":
          case "GO":
          case "DF":
            shippingCost = 30
            deliveryTime = 8
            break
          case "BA":
          case "SE":
          case "AL":
          case "PE":
          case "PB":
          case "RN":
            shippingCost = 35
            deliveryTime = 10
            break
          case "CE":
          case "PI":
          case "MA":
            shippingCost = 40
            deliveryTime = 12
            break
          case "PA":
          case "AP":
          case "AM":
          case "RR":
          case "AC":
          case "RO":
          case "TO":
            shippingCost = 50
            deliveryTime = 15
            break
        }
      }
      
      setShippingInfo({
        city: addressData.localidade,
        state: addressData.uf,
        shippingCost,
        deliveryTime,
        isValidCep: true
      })
      
      toast.success(`Frete calculado para ${addressData.localidade}/${addressData.uf}`)
    } catch (error) {
      console.error("Error calculating shipping:", error)
      toast.error("Erro ao calcular frete. Por favor, tente novamente.")
    } finally {
      setIsCalculatingShipping(false)
    }
  }
  
  // Apply coupon code
  const applyCouponCode = () => {
    if (!formData.couponCode.trim()) {
      toast.error("Por favor, insira um código de desconto")
      return
    }
    
    // Load coupons from localStorage
    const savedCoupons = localStorage.getItem("gang-boyz-coupons")
    let coupons = []
    if (savedCoupons) {
      try {
        coupons = JSON.parse(savedCoupons)
      } catch (error) {
        console.error("Error parsing coupons:", error)
      }
    }
    
    // Find matching active coupon
    const matchingCoupon = coupons.find((coupon: any) => 
      coupon.code === formData.couponCode && coupon.isActive
    )
    
    if (matchingCoupon) {
      if (matchingCoupon.discountType === "free_shipping") {
        // Apply free shipping
        setShippingInfo(prev => ({
          ...prev,
          shippingCost: 0
        }))
        setDiscountType("free_shipping")
        toast.success(`Cupom de frete grátis aplicado com sucesso! ${matchingCoupon.name}`)
      } else {
        // Apply regular discount
        let couponDiscount = 0
        if (matchingCoupon.discountType === "percentage") {
          couponDiscount = subtotal * (matchingCoupon.discountValue / 100)
        } else {
          // Fixed discount
          couponDiscount = matchingCoupon.discountValue
        }
        
        // Ensure discount doesn't exceed subtotal
        couponDiscount = Math.min(couponDiscount, subtotal)
        
        setDiscount(couponDiscount)
        setDiscountType("coupon")
        toast.success(`Cupom aplicado com sucesso! ${matchingCoupon.name}`)
      }
    } else {
      toast.error("Código de desconto inválido")
    }
  }
  
  // Handle checkout completion
  const handleCompleteCheckout = () => {
    if (checkoutItems.length === 0) {
      toast.error("Seu carrinho está vazio")
      return
    }
    
    if (!formData.fullName.trim()) {
      toast.error("Por favor, informe seu nome completo")
      return
    }
    
    if (!formData.city.trim()) {
      toast.error("Por favor, informe sua cidade")
      return
    }
    
    if (!formData.neighborhood.trim()) {
      toast.error("Por favor, informe seu bairro")
      return
    }
    
    if (!formData.street.trim()) {
      toast.error("Por favor, informe o nome da rua")
      return
    }
    
    // Combine address fields into a single address string
    const fullAddress = `${formData.street}${formData.streetNumber ? `, ${formData.streetNumber}` : ''}${formData.complement ? `, ${formData.complement}` : ''}${formData.neighborhood ? `, ${formData.neighborhood}` : ''}${formData.city ? `, ${formData.city}` : ''}${formData.referencePoint ? ` (Ponto de referência: ${formData.referencePoint})` : ''}`;
    
    // Update the address field with the combined address
    setFormData(prev => ({
      ...prev,
      address: fullAddress
    }));
    
    if (!shippingInfo.isValidCep) {
      toast.error("Por favor, calcule o frete antes de finalizar a compra")
      return
    }
    
    // Save checkout data to localStorage with 1-hour expiration
    const checkoutData = {
      items: checkoutItems,
      formData: {
        ...formData,
        shippingCost: shippingInfo.shippingCost,
        deliveryTime: shippingInfo.deliveryTime
      },
      timestamp: Date.now(),
      subtotal: subtotal
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('gang-boyz-ongoing-checkout', JSON.stringify(checkoutData))
    }
    
    // Redirect to payment page
    router.push("/payment")
  }
  
  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/")
  }
  
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
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
    <div className="min-h-screen bg-black text-white p-4 md:p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Finalizar Compra</h1>
        
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
                  <span className="text-neutral-400 text-sm">Desconto ({discountType === 'coupon' ? 'Cupom' : 'Promoção'})</span>
                  <span className="text-green-500 text-sm">- R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-400 text-sm">Frete</span>
                <span className="text-sm">
                  {discountType === "free_shipping" 
                    ? "Grátis" 
                    : `R$ ${shippingInfo.shippingCost.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-neutral-800">
                <span>Total</span>
                <span>R$ {totalWithDiscount.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </div>
          
          {/* Coupon/Promo Codes - Top Right */}
          <div className="bg-neutral-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Código de Desconto</h2>
            
            <div className="space-y-4">
              {/* Discount Code */}
              <div>
                <label className="block text-sm font-medium mb-2">Código de Desconto</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Digite seu código de desconto"
                  />
                  <Button 
                    onClick={applyCouponCode}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-lg"
                  >
                    Aplicar
                  </Button>
                </div>
                
                {/* Available Coupons */}
                <AvailableCouponsList hidden={true} />
              </div>
            </div>
          </div>
          
          {/* Payment Information - Bottom Left */}
          <div className="bg-neutral-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Informações de Pagamento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Digite seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">CEP</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="cep"
                    value={formData.cep}
                    onChange={(e) => {
                      // Format CEP as XXXXX-XXX
                      let value = e.target.value.replace(/\D/g, '')
                      if (value.length > 5) {
                        value = value.substring(0, 5) + '-' + value.substring(5, 8)
                      }
                      setFormData(prev => ({
                        ...prev,
                        cep: value
                      }))
                    }}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="XXXXX-XXX"
                    maxLength={9}
                  />
                  <Button 
                    onClick={calculateShipping}
                    disabled={isCalculatingShipping}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-lg disabled:opacity-50"
                  >
                    {isCalculatingShipping ? "Calculando..." : "Calcular Frete"}
                  </Button>
                </div>
                
                {/* Shipping Info Display */}
                {shippingInfo.isValidCep && (
                  <div className="mt-3 p-3 bg-neutral-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{shippingInfo.city}/{shippingInfo.state}</p>
                        <p className="text-xs text-neutral-400">Entrega em até {shippingInfo.deliveryTime} dias úteis</p>
                      </div>
                      <p className="text-sm font-medium">R$ {shippingInfo.shippingCost.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
                
                {/* City Field */}
                <div className="mb-3">
                  <label className="block text-xs text-neutral-400 mb-1">Cidade</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-neutral-500"
                      placeholder="Digite sua cidade"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Street Field */}
                <div className="mb-3">
                  <label className="block text-xs text-neutral-400 mb-1">Rua</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street || ''}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-neutral-500"
                    placeholder="Nome da rua"
                  />
                </div>
                
                {/* Neighborhood, Number and Complement Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Bairro</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood || ''}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-neutral-500"
                      placeholder="Bairro"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Número</label>
                    <input
                      type="text"
                      name="streetNumber"
                      value={formData.streetNumber || ''}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-neutral-500"
                      placeholder="Nº ou S/N"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Complemento</label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement || ''}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-neutral-500"
                      placeholder="Complemento (opcional)"
                    />
                  </div>
                </div>
                
                <p className="mt-2 text-xs text-neutral-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Seu endereço está seguro e será usado apenas para entrega
                </p>
              </div>
              

            </div>
          </div>
          
          {/* Black Bar */}
          <div className="w-full h-2 bg-black rounded-lg"></div>
          
          {/* Action Buttons - Bottom Right (Hidden on mobile since we have fixed button) */}
          <div className="bg-neutral-900 rounded-lg p-4 md:p-6 hidden md:block">
            <h2 className="text-xl font-bold mb-4">Finalizar Compra</h2>
            
            <div className="space-y-4">
              <div className="bg-neutral-800 rounded-lg p-4">
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
                  <span className="text-sm">R$ {shippingInfo.shippingCost.toFixed(2).replace(".", ",")}</span>
                </div>
                {shippingInfo.isValidCep && (
                  <div className="flex justify-between items-center mb-2 text-xs text-neutral-400">
                    <span>Entrega para {shippingInfo.city}/{shippingInfo.state}</span>
                    <span>em até {shippingInfo.deliveryTime} dias úteis</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-lg font-bold mt-3 pt-3 border-t border-neutral-700">
                  <span>Total</span>
                  <span>R$ {totalWithDiscount.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={handleCompleteCheckout}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isProcessing ? "Processando..." : `Finalizar Compra (R$ ${totalWithDiscount.toFixed(2).replace(".", ",")})`}
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
      </div>
      
      {/* Fixed Checkout Button for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 p-4 border-t border-neutral-800 shadow-lg">
        <div className="space-y-3">
          <Button
            onClick={() => {
              if (!shippingInfo.isValidCep) {
                toast.error("Por favor, calcule o frete antes de finalizar a compra")
                return
              }
              handleCompleteCheckout()
            }}
            disabled={isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isProcessing ? "Processando..." : `Finalizar Compra (R$ ${totalWithDiscount.toFixed(2).replace(".", ",")})`}
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full border border-gray-600 text-black hover:bg-gray-200 py-3 rounded-lg bg-white font-semibold"
          >
            Continuar Comprando
          </Button>
        </div>
      </div>
    </div>
  )
}