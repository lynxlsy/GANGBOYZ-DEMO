"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Palette, Eye, Save, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useTheme } from "@/lib/theme-context"

interface ThemeConfig {
  id: string
  name: string
  description: string
  primaryColor: string
  primaryHover: string
  gradientFrom: string
  gradientTo: string
  glowColor: string
  isActive: boolean
}

export default function GraficosPage() {
  const [themes, setThemes] = useState<ThemeConfig[]>([])
  const { activeTheme, applyTheme: applyThemeContext } = useTheme()

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = () => {
    const defaultThemes: ThemeConfig[] = [
      {
        id: "dark-red",
        name: "Vermelho Sangue",
        description: "Tema sóbrio e elegante com vermelho sangue escuro. Focado em descanso visual e sofisticação.",
        primaryColor: "#8B0000",
        primaryHover: "#660000",
        gradientFrom: "#8B0000",
        gradientTo: "#4A0000",
        glowColor: "rgba(139, 0, 0, 0.2)",
        isActive: activeTheme === "dark-red"
      },
      {
        id: "vibrant-red",
        name: "Vermelho Elétrico",
        description: "Tema energético com vermelho elétrico vibrante. Alta saturação, brilhos intensos e impacto visual máximo.",
        primaryColor: "#FF1744",
        primaryHover: "#E91E63",
        gradientFrom: "#FF1744",
        gradientTo: "#D50000",
        glowColor: "rgba(255, 23, 68, 0.8)",
        isActive: activeTheme === "vibrant-red"
      }
    ]

    setThemes(defaultThemes)
  }

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (!theme) return

    // Aplicar tema via contexto
    applyThemeContext(themeId)

    // Atualizar estado dos temas
    setThemes(prev => prev.map(t => ({
      ...t,
      isActive: t.id === themeId
    })))

    toast.success(`Tema "${theme.name}" aplicado com sucesso!`)
  }

  const resetToDefault = () => {
    applyTheme("dark-red")
    toast.success("Tema resetado para o padrão!")
  }

  const previewTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (!theme) return

    // Aplicar temporariamente para preview
    const root = document.documentElement
    root.style.setProperty('--primary-color', theme.primaryColor)
    root.style.setProperty('--primary-hover', theme.primaryHover)
    root.style.setProperty('--gradient-from', theme.gradientFrom)
    root.style.setProperty('--gradient-to', theme.gradientTo)
    root.style.setProperty('--glow-color', theme.glowColor)

    // Restaurar após 3 segundos
    setTimeout(() => {
      const currentTheme = themes.find(t => t.isActive)
      if (currentTheme) {
        root.style.setProperty('--primary-color', currentTheme.primaryColor)
        root.style.setProperty('--primary-hover', currentTheme.primaryHover)
        root.style.setProperty('--gradient-from', currentTheme.gradientFrom)
        root.style.setProperty('--gradient-to', currentTheme.gradientTo)
        root.style.setProperty('--glow-color', currentTheme.glowColor)
      }
    }, 3000)

    toast.info(`Preview do tema "${theme.name}" por 3 segundos`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gráficos e Temas</h1>
              <p className="text-gray-600">Personalize as cores e visual do site</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={resetToDefault}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar Padrão
            </Button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {themes.map((theme) => (
            <Card key={theme.id} className={`p-6 transition-all duration-300 ${
              theme.isActive ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-lg'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{theme.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
                </div>
                {theme.isActive && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ATIVO
                  </div>
                )}
              </div>

              {/* Color Preview */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Cor Primária</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <span className="text-sm text-gray-600 font-mono">{theme.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Gradiente</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-8 rounded border border-gray-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)` 
                      }}
                    />
                    <span className="text-sm text-gray-600 font-mono">
                      {theme.gradientFrom} → {theme.gradientTo}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Efeito Glow</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        boxShadow: `0 0 20px ${theme.glowColor}`
                      }}
                    />
                    <span className="text-sm text-gray-600">Brilho suave</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewTheme(theme.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={() => applyTheme(theme.id)}
                  className={`flex-1 ${
                    theme.isActive 
                      ? 'bg-gray-500 hover:bg-gray-600' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={theme.isActive}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {theme.isActive ? 'Ativo' : 'Aplicar'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Preview */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview ao Vivo</h3>
          <div className="bg-black rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button 
                size="lg" 
                className="red-gradient text-white hover:bg-red-700 font-semibold px-8 py-6 text-lg group red-glow"
              >
                COMPRAR AGORA
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-8 py-6 text-lg bg-transparent red-border"
              >
                NOVA COLEÇÃO
              </Button>
            </div>
            
            {/* Efeitos visuais */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-red-600 rounded-full mx-auto mb-2 red-pulse"></div>
                <p className="text-gray-400 text-xs">Efeito Pulse</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-red-600 rounded-full mx-auto mb-2 red-glow"></div>
                <p className="text-gray-400 text-xs">Efeito Glow</p>
              </div>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Estes elementos mostram como ficará o tema aplicado
            </p>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Como Funciona</h3>
          <div className="space-y-3 text-blue-800">
            <div>
              <h4 className="font-semibold">🎨 Temas Disponíveis:</h4>
              <p className="text-sm"><strong>Vermelho Sangue:</strong> Sóbrio e elegante, focado em descanso visual. <strong>Vermelho Elétrico:</strong> Energético com alta saturação e brilhos intensos.</p>
            </div>
            <div>
              <h4 className="font-semibold">👁️ Preview:</h4>
              <p className="text-sm">Use o botão "Preview" para ver como o tema ficará por 3 segundos antes de aplicar.</p>
            </div>
            <div>
              <h4 className="font-semibold">💾 Salvamento Automático:</h4>
              <p className="text-sm">As alterações são salvas automaticamente e aplicadas em todo o site.</p>
            </div>
            <div>
              <h4 className="font-semibold">🔄 Reset:</h4>
              <p className="text-sm">Use "Resetar Padrão" para voltar ao tema Vermelho Escuro original.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
