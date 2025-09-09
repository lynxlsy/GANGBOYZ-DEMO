"use client"

import { Instagram, CreditCard } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"

export function Footer() {
  const { activeTheme } = useTheme()
  return (
    <footer className="bg-neutral-800 border-t border-neutral-700">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex justify-start">
              <Image src="/logo-gang-boyz-new.svg" alt="Gang BoyZ" width={400} height={160} className="h-32 w-auto" />
            </div>
            <p className="text-neutral-400 mb-6 max-w-md">
              Streetwear premium para os corajosos. Expresse sua individualidade com nossa coleção exclusiva de moda
              urbana.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">LINKS RÁPIDOS</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Novidades
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Roupas
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Acessórios
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="transition-colors font-semibold"
                  style={{ 
                    color: `var(--primary-color)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = `var(--primary-hover)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = `var(--primary-color)`
                  }}
                >
                  Promoção
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Guia de Tamanhos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">SUPORTE</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Nosso Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <span className="text-white font-semibold">MÉTODOS DE PAGAMENTO:</span>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                {/* Primeira linha - Cartões principais */}
                <div className="flex items-center space-x-3 justify-start">
                  <Image src="/visa@2x.png" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                  <Image src="/mastercard@2x.png" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                  <Image src="/elo@2x.png" alt="Elo" width={40} height={25} className="h-6 w-auto" />
                </div>
                {/* Segunda linha - Cartões adicionais e PIX */}
                <div className="flex items-center space-x-3 justify-start">
                  <Image src="/amex@2x.png" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                  <Image src="/hipercard@2x.png" alt="Hipercard" width={40} height={25} className="h-6 w-auto" />
                  <div className="bg-green-600 rounded px-3 py-1">
                    <span className="text-white text-sm font-medium">PIX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              © 2025 Gang BoyZ. Todos os direitos reservados. Desenvolvido pela equipe da CodeForge
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                Termos de Serviço
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
