"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BannersPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)

  const pages = [
    {
      id: "homepage",
      name: "Menu Inicial",
      description: "Todos os banners da página principal (Hero, HOT, Footer)",
      icon: Globe,
      color: "bg-green-100",
      iconColor: "text-green-600",
      available: true
    }
  ]

  if (selectedPage) {
    // Redirecionar para a página específica de edição
    if (selectedPage === "homepage") {
      window.location.href = "/admin/banners/homepage"
      return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Admin
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Image 
                  src="/logo-gang-boyz-new.svg" 
                  alt="Gang BoyZ" 
                  width={80} 
                  height={32} 
                  className="h-8 w-auto filter brightness-110"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Gerenciar Banners
                </h1>
                <p className="text-gray-400 text-sm md:text-lg">Selecione a página para gerenciar os banners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pages.map((page) => {
            const IconComponent = page.icon
            return (
              <Card 
                key={page.id} 
                className={`group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20 ${
                  page.available ? '' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => page.available && setSelectedPage(page.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-4 md:p-6 text-center">
                  <div className="mb-4 md:mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-gray-300 transition-colors">{page.name}</h2>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      {page.description}
                    </p>
                  </div>
                  
                  {page.available ? (
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25 text-sm md:text-base">
                      Gerenciar Banners
                    </Button>
                  ) : (
                    <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed py-2 md:py-3 rounded-xl text-sm md:text-base">
                      Em Breve
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sobre o Gerenciamento de Banners</h3>
            <p className="text-gray-400 mb-6">
              Gerencie todos os banners da homepage em um só lugar. Inclui o banner principal (Hero), 
              banner da seção HOT e banner do footer, todos com dimensões e formatos otimizados.
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Funcionalidades Disponíveis:</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Banner Principal (Hero) - Background da página inicial
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Banner HOT - Seção de produtos em destaque
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Banner Footer - Antes do rodapé
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Suporte a imagens, vídeos e GIFs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  Sincronização automática entre todos os banners
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
