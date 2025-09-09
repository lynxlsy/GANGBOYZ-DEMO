"use client"

import { HeroCarousel } from "@/components/hero-carousel"

export default function TestCarouselFix() {
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Teste do Carrossel - Versão Corrigida
        </h1>
        
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instruções:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Clique na seta da direita para ir para o Banner 2</li>
            <li>Clique na seta da esquerda para voltar ao Banner 1</li>
            <li>Clique nos indicadores (traços) na parte inferior</li>
            <li>Verifique se as imagens aparecem inteiras (object-contain)</li>
            <li>Verifique se a transição funciona corretamente</li>
          </ul>
        </div>

        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Banners de Teste:</h2>
          <div className="grid grid-cols-2 gap-4">
            {testBanners.map((banner, index) => (
              <div key={banner.id} className="bg-gray-700 p-4 rounded">
                <h3 className="font-semibold">Banner {index + 1}</h3>
                <p className="text-sm text-gray-300">ID: {banner.id}</p>
                <p className="text-sm text-gray-300">Src: {banner.imageSrc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Carrossel:</h2>
          <div className="border-2 border-red-500 rounded-lg overflow-hidden">
            <HeroCarousel banners={testBanners} autoPlayInterval={4000} />
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Voltar para Homepage
          </a>
        </div>
      </div>
    </div>
  )
}

