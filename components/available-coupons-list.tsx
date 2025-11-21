"use client"

import { useState, useEffect } from "react"

interface Coupon {
  id: string
  code: string
  name: string
  discountType: "percentage" | "fixed"
  discountValue: number
  isActive: boolean
}

interface AvailableCouponsListProps {
  hidden?: boolean
}

export function AvailableCouponsList({ hidden = false }: AvailableCouponsListProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([])

  useEffect(() => {
    // Load coupons from localStorage
    const savedCoupons = localStorage.getItem("gang-boyz-coupons")
    if (savedCoupons) {
      try {
        const parsedCoupons = JSON.parse(savedCoupons)
        // Filter only active coupons
        const activeCoupons = parsedCoupons.filter((coupon: Coupon) => coupon.isActive)
        setCoupons(activeCoupons)
      } catch (error) {
        console.error("Error parsing coupons:", error)
        setCoupons([])
      }
    }
  }, [])

  // If hidden prop is true, don't render anything
  if (hidden) {
    return null
  }

  if (coupons.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <p className="text-sm text-neutral-400 mb-2">Cupons disponíveis:</p>
      <div className="flex flex-wrap gap-2">
        {coupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className="px-3 py-1 bg-neutral-800 rounded-full text-xs flex items-center gap-1"
          >
            <span className="font-medium">{coupon.code}</span>
            <span className="text-neutral-400">
              ({coupon.discountType === "percentage" 
                ? `${coupon.discountValue}%` 
                : `R$${coupon.discountValue.toFixed(2).replace(".", ",")}`})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}