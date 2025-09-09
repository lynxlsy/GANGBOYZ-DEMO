"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TestSimpleCarouselPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [banners] = useState([
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
  ])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Teste Simples - Carrossel</h1>
        <p className="mb-8">Teste básico para verificar se as imagens carregam corretamente.</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Controles:</h2>
          <div className="flex gap-4">
            <Button onClick={goToPrevious} className="bg-blue-600 hover:bg-blue-700">
              ← Anterior
            </Button>
            <Button onClick={goToNext} className="bg-blue-600 hover:bg-blue-700">
              Próximo →
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

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Status:</h2>
          <p>Banner atual: {currentIndex + 1} de {banners.length}</p>
          <p>Imagem: {banners[currentIndex].imageSrc}</p>
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
                  console.error(`Erro ao carregar imagem: ${banner.imageSrc}`)
                  e.currentTarget.src = "/placeholder.jpg"
                }}
                onLoad={() => {
                  console.log(`Imagem carregada: ${banner.imageSrc}`)
                }}
              />
              
              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-4">{banner.alt}</h3>
                  <p className="text-xl text-gray-300">Banner {index + 1}</p>
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
          <li>Use os botões "Anterior" e "Próximo" para navegar</li>
          <li>Clique nos indicadores (traços) na parte inferior</li>
          <li>Verifique se ambas as imagens carregam corretamente</li>
          <li>Observe a transição suave entre os banners</li>
        </ul>
      </div>
    </div>
  )
}

