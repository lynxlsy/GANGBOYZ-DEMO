"use client"

import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"
import { CardsProvider } from "@/lib/cards-context"
import { ProductsProvider } from "@/lib/products-context-simple"
import { UserProvider } from "@/lib/user-context"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as CustomToaster } from "@/components/ui/toaster"
import { OngoingPurchaseWrapper } from "@/components/ongoing-purchase-wrapper"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CardsProvider>
              <ProductsProvider>
                {children}
                <CartDrawer />
                <Toaster />
                <CustomToaster />
                <OngoingPurchaseWrapper />
              </ProductsProvider>
            </CardsProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </UserProvider>
  )
}