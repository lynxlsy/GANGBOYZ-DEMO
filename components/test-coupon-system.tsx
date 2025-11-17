"use client"

import { useEffect } from "react"
import { safeSetItem } from "@/lib/localStorage-utils"

// Test component to initialize some sample coupons for testing
export function TestCouponSystem() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      // Create sample coupons for testing
      const sampleCoupons = [
        {
          id: "1",
          code: "DESC10",
          name: "Desconto de 10%",
          discountType: "percentage",
          discountValue: 10,
          isActive: true
        },
        {
          id: "2",
          code: "DESC20",
          name: "Desconto de 20%",
          discountType: "percentage",
          discountValue: 20,
          isActive: true
        },
        {
          id: "3",
          code: "PROMO15",
          name: "R$15 OFF",
          discountType: "fixed",
          discountValue: 15,
          isActive: true
        },
        {
          id: "4",
          code: "PROMO30",
          name: "R$30 OFF",
          discountType: "fixed",
          discountValue: 30,
          isActive: true
        }
      ]
      
      // Save to localStorage
      safeSetItem("gang-boyz-coupons", JSON.stringify(sampleCoupons))
    }
  }, [])
  
  return null
}