"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Image as ImageIcon, Settings, Palette, BarChart3, Phone, Flame, Shirt, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image 
                src="/logo-gang-boyz-new.svg" 
                alt="Gang BoyZ" 
                width={120} 
                height={48} 
                className="h-16 w-auto filter brightness-110 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto px-4">
            Gerencie todos os aspectos do seu e-commerce Gang BoyZ com facilidade e precisão
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Ofertas Especiais */}
          <Link href="/admin/ofertas">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-red-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors">Ofertas Especiais</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Gerencie produtos promocionais e em destaque na seção "OFERTAS ESPECIAIS"
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25 text-sm md:text-base">
                  Acessar Ofertas
                </Button>
              </div>
            </Card>
          </Link>

          {/* Banners */}
          <Link href="/admin/banners">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ImageIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-blue-400 transition-colors">Banners</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Gerencie banners promocionais com suporte a imagens, vídeos e GIFs
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25 text-sm md:text-base">
                  Acessar Banners
                </Button>
              </div>
            </Card>
          </Link>

          {/* Coleções */}
          <Link href="/admin/colecoes">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Palette className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-purple-400 transition-colors">Coleções</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Gerencie coleções com banners promocionais e links personalizados
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25 text-sm md:text-base">
                  Acessar Coleções
                </Button>
              </div>
            </Card>
          </Link>

          {/* Gráficos */}
          <Link href="/admin/graficos">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-green-400 transition-colors">Gráficos</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Personalize cores e temas do site com diferentes atmosferas visuais
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/25 text-sm md:text-base">
                  Acessar Gráficos
                </Button>
              </div>
            </Card>
          </Link>

          {/* Contatos */}
          <Link href="/admin/contatos">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-orange-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-orange-400 transition-colors">Contatos</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Gerencie links de redes sociais e canais de comunicação
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/25 text-sm md:text-base">
                  Acessar Contatos
                </Button>
              </div>
            </Card>
          </Link>

          {/* Produtos HOT */}
          <Link href="/admin/hot">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-red-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Flame className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors">Produtos HOT</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Gerencie as peças mais em alta com IDs únicos na homepage
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25 text-sm md:text-base">
                  Acessar HOT
                </Button>
              </div>
            </Card>
          </Link>

          {/* Recomendações de Roupas */}
          <Link href="/admin/recomendacoes">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shirt className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-indigo-400 transition-colors">Recomendações</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Gerencie recomendações com carrossel infinito acima das coleções
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25 text-sm md:text-base">
                  Acessar Recomendações
                </Button>
              </div>
            </Card>
          </Link>

          {/* Inicialização de Produtos */}
          <Link href="/admin/init-products">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-yellow-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-yellow-400 transition-colors">Produtos Demo</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Adicione produtos demonstrativos automaticamente
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-500/25 text-sm md:text-base">
                  Adicionar Produtos
                </Button>
              </div>
            </Card>
          </Link>

          {/* Debug de Produtos */}
          <Link href="/debug-products">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-orange-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-orange-400 transition-colors">Debug Produtos</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Verifique e adicione produtos manualmente
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/25 text-sm md:text-base">
                  Debug Produtos
                </Button>
              </div>
            </Card>
          </Link>

          {/* Forçar Atualização */}
          <Link href="/force-update-products">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-red-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-4 md:p-8 text-center">
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors">Forçar Update</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Force atualização dos produtos e recarregue a página
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 md:py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25 text-sm md:text-base">
                  Forçar Update
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 md:mt-16 text-center">
          <Card className="p-6 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
            <div className="max-w-3xl mx-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Settings className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Sistema de Gerenciamento</h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-4 md:mb-6 px-4">
                Gerencie todos os aspectos do seu e-commerce Gang BoyZ com facilidade e precisão. 
                Todas as alterações são salvas automaticamente e aparecem imediatamente no site principal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                <div className="text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <span className="text-green-400 text-lg md:text-xl">⚡</span>
                  </div>
                  <h4 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Tempo Real</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Alterações aplicadas instantaneamente</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <span className="text-blue-400 text-lg md:text-xl">🔒</span>
                  </div>
                  <h4 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Seguro</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Dados protegidos e backup automático</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <span className="text-purple-400 text-lg md:text-xl">🎨</span>
                  </div>
                  <h4 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Personalizável</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Complete controle sobre o design</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}