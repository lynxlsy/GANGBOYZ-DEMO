"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TestCarouselSimplePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const banners = [
    {
      id: "banner-1",
      imageSrc: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
      alt: "Banner 1 - Hoodie"
    },
    {
      id: "banner-2",
      imageSrc: "/black-streetwear-hoodie-with-white-logo.jpg", 
      alt: "Banner 2 - Logo"
    }
  ]

  const goToNext = () => {
    console.log(`🔄 Passando de ${currentIndex} para ${(currentIndex + 1) % banners.length}`)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const goToPrevious = () => {
    console.log(`🔄 Voltando de ${currentIndex} para ${currentIndex === 0 ? banners.length - 1 : currentIndex - 1}`)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    console.log(`🎯 Indo direto para banner ${index + 1}`)
    setCurrentIndex(index)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Teste Simples - Carrossel</h1>
        <p className="mb-8">Teste básico para verificar se a navegação funciona corretamente.</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Status Atual:</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Banner Atual</h3>
              <p className="text-2xl font-bold text-red-400">{currentIndex + 1}</p>
            </Card>
            <Card className="p-4 bg-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Total</h3>
              <p className="text-2xl font-bold text-blue-400">{banners.length}</p>
            </Card>
            <Card className="p-4 bg-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Imagem</h3>
              <p className="text-sm text-gray-400">{banners[currentIndex].imageSrc}</p>
            </Card>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Controles:</h2>
          <div className="flex gap-4">
            <Button onClick={goToPrevious} className="bg-blue-600 hover:bg-blue-700">
              ← Anterior (Esquerda)
            </Button>
            <Button onClick={goToNext} className="bg-green-600 hover:bg-green-700">
              Próximo (Direita) →
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Indicadores:</h2>
          <div className="flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-red-500 w-8' 
                    : 'bg-white/50 hover:bg-white/70 w-6'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Carrossel Simples */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${banners.length * 100}%`
          }}
        >
          {banners.map((banner, index) => (
            <div 
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative"
              style={{ width: `${100 / banners.length}%` }}
            >
              <img
                src={banner.imageSrc}
                alt={banner.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`❌ Erro: ${banner.imageSrc}`)
                  e.currentTarget.src = "/placeholder.jpg"
                }}
                onLoad={() => {
                  console.log(`✅ Carregada: ${banner.imageSrc}`)
                }}
              />
              
              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-6xl font-bold text-white mb-4">{banner.alt}</h3>
                  <p className="text-2xl text-gray-300">Banner {index + 1}</p>
                  <p className="text-lg text-gray-400 mt-4">Index: {index}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicadores na parte inferior */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-red-500 w-8' 
                  : 'bg-white/50 hover:bg-white/70 w-6'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Instruções:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Botão "Próximo (Direita)"</strong>: Deve ir para a segunda imagem</li>
          <li><strong>Botão "Anterior (Esquerda)"</strong>: Deve voltar para a primeira imagem</li>
          <li><strong>Indicadores</strong>: Clique nos traços para ir direto ao banner</li>
          <li><strong>Console</strong>: Abra o console para ver os logs de navegação</li>
          <li><strong>Verificação</strong>: O "Banner Atual" deve mudar de 1 para 2</li>
        </ul>
      </div>
    </div>
  )
}

