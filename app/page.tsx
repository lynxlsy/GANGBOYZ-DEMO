"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BannerGrid } from "@/components/banner-grid"
import { HotSection } from "@/components/hot-section"
import { RecommendationsSection } from "@/components/recommendations-section"
import { ExploreCategories } from "@/components/explore-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { FooterBanner } from "@/components/footer-banner"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { WelcomeModal } from "@/components/welcome-modal"

export default function HomePage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento inicial para evitar flash de conteúdo antigo
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowWelcomeModal(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="relative">
        <Hero />
        <BannerGrid />
        <ExploreCategories />
        <RecommendationsSection />
        <FeaturedProducts />
        <HotSection />
      </main>
      <FooterBanner />
      <Footer />
      <CartDrawer />
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
    </div>
  )
}
