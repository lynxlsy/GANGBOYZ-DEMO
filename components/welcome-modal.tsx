"use client"

import { useEffect, useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [neverShowAgain, setNeverShowAgain] = useState(false)
  const [config, setConfig] = useState({
    enabled: true,
    displayTime: 4,
    title: "Seja bem-vindo",
    description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
    buttonText: "Explorar Loja"
  })

  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    if (isOpen) {
      // Carregar configuração salva
      const savedConfig = localStorage.getItem('welcome-modal-config')
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig)
          setConfig(parsedConfig)
        
          // Verificar se o modal está desativado
          if (!parsedConfig.enabled) {
            onClose()
            return
          }
        } catch (error) {
          console.error('Erro ao fazer parse da configuração:', error)
        }
      }

      // Check if user has disabled the modal
      const modalDisabled = localStorage.getItem('welcome-modal-disabled')
      if (modalDisabled === 'true') {
        onClose()
        return
      }

      const timer = setTimeout(() => {
        onClose()
      }, config.displayTime * 1000) // Auto close after configured time

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, config.displayTime])

  const handleClose = () => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') {
      onClose()
      return
    }
    
    if (neverShowAgain) {
      localStorage.setItem('welcome-modal-disabled', 'true')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-neutral-900/95 to-black/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative p-8 md:p-10 text-center">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-600/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src="/IMG_2586 2.svg"
                  alt="Gang BoyZ"
                  width={160}
                  height={80}
                  className="drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                />
              </div>
            </div>

            {/* Welcome message */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                {config.title}
              </h1>
              <div className="w-16 h-1 red-bg mx-auto rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-base text-white/80 max-w-sm mx-auto leading-relaxed">
              {config.description}
            </p>

            {/* Action button */}
            <div className="pt-4">
              <Button
                onClick={handleClose}
                className="red-gradient hover:red-bg-hover text-white font-semibold px-8 py-3 text-base transition-all duration-300 hover:scale-105 shadow-lg red-glow"
              >
                {config.buttonText}
              </Button>
            </div>

            {/* Never show again option */}
            <div className="pt-4">
              <label className="flex items-center justify-center space-x-2 text-sm text-white/60 hover:text-white/80 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={neverShowAgain}
                  onChange={(e) => setNeverShowAgain(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                  neverShowAgain 
                    ? 'red-bg red-border-dynamic' 
                    : 'border-white/40 hover:border-white/60'
                }`}>
                  {neverShowAgain && <Check className="h-3 w-3 text-white" />}
                </div>
                <span>Nunca mais mostrar este modal</span>
              </label>
            </div>

            {/* Auto-close indicator */}
            <div className="pt-4">
              <div className="w-20 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full red-bg rounded-full"
                  style={{
                    animation: `shrink ${config.displayTime}s linear forwards`,
                  }}
                />
              </div>
              <p className="text-xs text-white/50 mt-2">
                Fechará automaticamente em {config.displayTime}s
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
