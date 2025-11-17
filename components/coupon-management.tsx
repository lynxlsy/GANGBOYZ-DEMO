"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Edit } from "lucide-react"
import { toast } from "sonner"
import { safeSetItem, safeGetItem } from "@/lib/localStorage-utils"

interface Coupon {
  id: string
  code: string
  name: string
  discountType: "percentage" | "fixed"
  discountValue: number
  isActive: boolean
}

export function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load coupons from localStorage on mount
  useEffect(() => {
    const savedCoupons = safeGetItem("gang-boyz-coupons")
    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons))
      } catch (error) {
        console.error("Error parsing coupons:", error)
        setCoupons([])
      }
    } else if (process.env.NODE_ENV === 'development') {
      // Add sample coupons for development
      const sampleCoupons: Coupon[] = [
        {
          id: "1",
          code: "DESC10",
          name: "Desconto de 10%",
          discountType: "percentage" as "percentage" | "fixed",
          discountValue: 10,
          isActive: true
        },
        {
          id: "2",
          code: "DESC20",
          name: "Desconto de 20%",
          discountType: "percentage" as "percentage" | "fixed",
          discountValue: 20,
          isActive: true
        }
      ]
      setCoupons(sampleCoupons)
      safeSetItem("gang-boyz-coupons", JSON.stringify(sampleCoupons))
    }
  }, [])

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    safeSetItem("gang-boyz-coupons", JSON.stringify(coupons))
  }, [coupons])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.code.trim()) {
      newErrors.code = "Código é obrigatório"
    } else if (coupons.some(coupon => coupon.code === formData.code && coupon.id !== isEditing)) {
      newErrors.code = "Código já existe"
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }
    
    if (formData.discountValue <= 0) {
      newErrors.discountValue = "Valor deve ser maior que zero"
    }
    
    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      newErrors.discountValue = "Percentual não pode ser maior que 100%"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    if (isEditing) {
      // Update existing coupon
      setCoupons(prev => prev.map(coupon => 
        coupon.id === isEditing 
          ? { 
              ...coupon, 
              code: formData.code,
              name: formData.name,
              discountType: formData.discountType,
              discountValue: formData.discountValue
            } 
          : coupon
      ))
      toast.success("Cupom atualizado com sucesso!")
    } else {
      // Create new coupon
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code,
        name: formData.name,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        isActive: true
      }
      setCoupons(prev => [...prev, newCoupon])
      toast.success("Cupom criado com sucesso!")
    }

    // Reset form
    setFormData({
      code: "",
      name: "",
      discountType: "percentage",
      discountValue: 0
    })
    setIsEditing(null)
    setErrors({})
  }

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    })
    setIsEditing(coupon.id)
  }

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id))
    if (isEditing === id) {
      setIsEditing(null)
      setFormData({
        code: "",
        name: "",
        discountType: "percentage",
        discountValue: 0
      })
    }
    toast.success("Cupom excluído com sucesso!")
  }

  const toggleActive = (id: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === id 
        ? { ...coupon, isActive: !coupon.isActive } 
        : coupon
    ))
  }

  const handleCancel = () => {
    setIsEditing(null)
    setFormData({
      code: "",
      name: "",
      discountType: "percentage",
      discountValue: 0
    })
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-gray-900">Gerenciamento de Cupons</span>
            <Button 
              onClick={() => {
                setIsEditing(null)
                setFormData({
                  code: "",
                  name: "",
                  discountType: "percentage",
                  discountValue: 0
                })
                setErrors({})
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Coupon Form */}
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              {isEditing ? "Editar Cupom" : "Criar Novo Cupom"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code" className="text-gray-800">Código do Cupom *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Ex: DESC10, PROMO20"
                  className="mt-1 bg-white text-gray-900 border-neutral-300 focus:ring-red-500 focus:ring-2"
                />
                {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
              </div>
              
              <div>
                <Label htmlFor="name" className="text-gray-800">Nome do Cupom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Desconto de 10%, Promoção Especial"
                  className="mt-1 bg-white text-gray-900 border-neutral-300 focus:ring-red-500 focus:ring-2"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="discountType" className="text-gray-800">Tipo de Desconto</Label>
                <select
                  id="discountType"
                  value={formData.discountType}
                  onChange={(e) => setFormData({...formData, discountType: e.target.value as "percentage" | "fixed"})}
                  className="w-full mt-1 bg-white border border-neutral-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="percentage" className="bg-white text-gray-900">Percentual (%)</option>
                  <option value="fixed" className="bg-white text-gray-900">Valor Fixo (R$)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="discountValue" className="text-gray-800">
                  {formData.discountType === "percentage" ? "Percentual (%)" : "Valor (R$)"} *
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue || ""}
                  onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value) || 0})}
                  placeholder={formData.discountType === "percentage" ? "10" : "20"}
                  className="mt-1 bg-white text-gray-900 border-neutral-300 focus:ring-red-500 focus:ring-2"
                  min="0"
                  step="0.01"
                />
                {errors.discountValue && <p className="text-red-600 text-sm mt-1">{errors.discountValue}</p>}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleSave}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isEditing ? "Atualizar" : "Criar"} Cupom
              </Button>
              {isEditing && (
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="border-neutral-300 text-gray-900 hover:bg-neutral-100"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
          
          {/* Coupons List */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Cupons Cadastrados</h3>
            
            {coupons.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Nenhum cupom cadastrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div 
                    key={coupon.id} 
                    className={`p-4 rounded-lg border ${
                      coupon.isActive 
                        ? "border-neutral-200 bg-white" 
                        : "border-neutral-300 bg-neutral-50 opacity-70"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{coupon.name}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            coupon.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-neutral-200 text-neutral-700"
                          }`}>
                            {coupon.isActive ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Código: <span className="font-mono text-gray-900">{coupon.code}</span> • 
                          Desconto: <span className="text-gray-900">{coupon.discountType === "percentage" 
                            ? `${coupon.discountValue}%` 
                            : `R$ ${coupon.discountValue.toFixed(2).replace(".", ",")}`}</span>
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleActive(coupon.id)}
                          variant="outline"
                          size="sm"
                          className="border-neutral-300 text-gray-900 hover:bg-neutral-100"
                        >
                          {coupon.isActive ? "Desativar" : "Ativar"}
                        </Button>
                        <Button
                          onClick={() => handleEdit(coupon)}
                          variant="outline"
                          size="sm"
                          className="border-neutral-300 text-gray-900 hover:bg-neutral-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(coupon.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
