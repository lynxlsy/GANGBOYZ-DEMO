'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Banner } from '@/lib/banner-types'
import { useBanners } from '@/hooks/use-banners'
import { InlineCropViewport } from '@/components/inline-crop-viewport-v2'

export default function HomepageBannersPage() {
  const { banners, isLoading, mutate } = useBanners(['hero', 'hot', 'footer'])
  const [saving, setSaving] = useState(false)

  // Função para atualizar banner
  const handleBannerUpdate = (updatedBanner: Banner) => {
    mutate()
  }

  // Resetar todos os banners
  const resetBanners = () => {
    // Implementar reset se necessário
    toast.success("Banners resetados!")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg">Carregando banners...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Gerenciar Banners
          </h1>
          <p className="text-gray-300 text-lg">
            Configure os banners da página inicial
          </p>
        </div>

        {/* Controles Globais */}
        <div className="mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Controles Globais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={resetBanners}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Resetar Todos
                </Button>
                <div className="text-sm text-gray-400">
                  {banners.length} banner(s) configurado(s)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Banners */}
        <div className="space-y-8">
          {banners.map((banner) => (
            <Card key={banner.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  {banner.id === 'hero' && 'Banner Principal (Hero)'}
                  {banner.id === 'hot' && 'Banner HOT'}
                  {banner.id === 'footer' && 'Banner Footer'}
                </CardTitle>
                <div className="text-gray-300 text-sm">
                  {banner.id === 'hero' && 'Banner principal da página inicial, exibido atrás da logo e botões'}
                  {banner.id === 'hot' && 'Banner da seção HOT, exibido acima dos produtos mais vendidos'}
                  {banner.id === 'footer' && 'Banner que aparece antes do footer em todas as páginas'}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Informações do Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-400">Dimensões</Label>
                      <p className="text-white">{banner.ratio}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Formato</Label>
                      <p className="text-white">{banner.mime}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Versão</Label>
                      <p className="text-white">{banner.version}</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <Label className="font-semibold text-gray-300 text-sm md:text-base mb-3 md:mb-4 block">
                      Preview:
                    </Label>
                    
                    <InlineCropViewport
                      banner={banner}
                      onBannerUpdate={handleBannerUpdate}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Última atualização: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
