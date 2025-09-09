'use client'

import { useState, useEffect } from 'react'
import { BannerRenderer } from '@/components/banner-renderer'
import { useBanner, BannerBroadcastChannel } from '@/hooks/use-banners'

export function FooterBanner() {
  const { banner, mutate } = useBanner('footer')
  const [broadcastChannel, setBroadcastChannel] = useState<BannerBroadcastChannel | null>(null)

  // Inicializar BroadcastChannel
  useEffect(() => {
    const channel = new BannerBroadcastChannel()
    setBroadcastChannel(channel)

    // Escutar atualizações
    const cleanup = channel.onUpdate((id, version) => {
      if (id === 'footer') {
        mutate() // Refetch do SWR
      }
    })

    return () => {
      cleanup()
      channel.close()
    }
  }, [mutate])

  if (!banner) {
    return null // Não renderizar se não houver banner
  }

  return (
    <div className="relative w-full h-[650px] overflow-hidden">
      <BannerRenderer banner={banner} className="w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              FOOTER BANNER
            </h2>
            <p className="text-xl md:text-2xl text-gray-200">
              Última chance antes do footer
            </p>
          </div>
        </div>
      </BannerRenderer>
    </div>
  )
}
