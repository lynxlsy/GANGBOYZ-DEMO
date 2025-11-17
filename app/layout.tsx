import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Providers } from "@/components/providers"
import "./globals.css"
import "../styles/mobile-optimizations.css"
import "../styles/editable-button.css"
import "../styles/mobile-header.css"
import { EditModeProvider } from "@/lib/edit-mode-context"
import { setupPeriodicCleanup } from "@/lib/localStorage-utils"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Inicializar limpeza periódica do localStorage
  if (typeof window !== 'undefined') {
    setupPeriodicCleanup()
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <EditModeProvider>
          <Providers>
            {children}
          </Providers>
        </EditModeProvider>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "Zona Street - Gang Boyz", // Alterado de "GANG BOYZ" para "Zona Street - Gang Boyz"
  description: "Discover the latest in urban streetwear fashion. Premium quality, bold designs.",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: '/logo-gang-boyz-new.svg',
    shortcut: '/logo-gang-boyz-new.svg',
    apple: '/logo-gang-boyz-new.svg',
  },
}