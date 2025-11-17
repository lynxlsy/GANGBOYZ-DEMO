"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ProductCategoryPageProps {
  config: any
  subcategoryKey: string
}

export function MinimalProductCategoryPage({ config, subcategoryKey }: ProductCategoryPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="h-[180px]"></div>
      <main className="pt-0">
        <div className="flex">
          <div className="flex-1 py-4 pl-0 md:pl-8">
            <div className="px-4 md:px-8 py-8">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{config.displayName}</h1>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}