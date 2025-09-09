'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BannerRenderer } from '@/components/banner-renderer'
import { useBanner, BannerBroadcastChannel } from '@/hooks/use-banners'

export function Hero() {
  const { banner, mutate } = useBanner('hero')
  const [broadcastChannel, setBroadcastChannel] = useState<BannerBroadcastChannel | null>(null)

  // Inicializar BroadcastChannel
  useEffect(() => {
    const channel = new BannerBroadcastChannel()
    setBroadcastChannel(channel)

    // Escutar atualizações
    const cleanup = channel.onUpdate((id, version) => {
      if (id === 'hero') {
        mutate() // Refetch do SWR
      }
    })

    return () => {
      cleanup()
      channel.close()
    }
  }, [mutate])

  if (!banner) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Carregando banner...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <BannerRenderer banner={banner} className="w-full h-full">
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 flex justify-center">
              <img 
                src="/logo-gangboyz.svg" 
                alt="Gang BoyZ Logo" 
                className="h-16 md:h-20 lg:h-24 w-auto"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              STREETWEAR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                AUTÊNTICO
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Descubra peças únicas que definem o estilo urbano. 
              Qualidade premium, design inovador e atitude que marca presença.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 text-lg"
              >
                EXPLORAR COLECION
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 text-lg"
              >
                VER LOOKBOOK
              </Button>
            </div>
          </div>
        </div>
      </BannerRenderer>
    </section>
  )
}
