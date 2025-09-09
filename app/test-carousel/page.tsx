"use client"

import { HeroCarousel } from "@/components/hero-carousel"

export default function TestCarouselPage() {
  const testBanners = [
    {
      id: "test-banner-1",
      imageSrc: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
      alt: "Test Banner 1"
    },
    {
      id: "test-banner-2",
      imageSrc: "/black-streetwear-hoodie-with-white-logo.jpg", 
      alt: "Test Banner 2"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Teste do Carrossel Hero</h1>
        <p className="mb-8">Esta página testa o carrossel de banners com:</p>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Alternância automática a cada 4 segundos</li>
          <li>Transição suave deslizando para o lado</li>
          <li>Setas para navegação manual</li>
          <li>Indicadores de página (pontos)</li>
          <li>Pausa automática ao passar o mouse</li>
        </ul>
      </div>
      
      <HeroCarousel banners={testBanners} autoPlayInterval={4000} />
      
      <div className="p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Instruções:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Observe a alternância automática dos banners com transição suave</li>
          <li>Use as setas laterais para navegar manualmente (com transição)</li>
          <li>Clique nos pontos na parte inferior para ir direto a um banner</li>
          <li>Passe o mouse sobre o carrossel para pausar a alternância automática</li>
          <li>Note a transição deslizando para o lado entre os banners</li>
        </ul>
      </div>
    </div>
  )
}
