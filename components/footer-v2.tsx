"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram } from "lucide-react"
import Image from "next/image"
import { BannerTemplate } from "@/components/banner-template"
import { useState, useEffect } from "react"

interface Contact {
  id: string
  platform: string
  url: string
  isActive: boolean
  displayText?: string
}

export function Footer() {
  const [socialContacts, setSocialContacts] = useState<Contact[]>([])

  useEffect(() => {
    loadContactData()
    
    // Escutar eventos de atualização
    const handleContactsUpdate = () => {
      loadContactData()
    }
    
    window.addEventListener('contactsUpdated', handleContactsUpdate)
    return () => window.removeEventListener('contactsUpdated', handleContactsUpdate)
  }, [])

  const loadContactData = () => {
    // Carregar contatos sociais
    const savedSocialContacts = localStorage.getItem("gang-boyz-contacts")
    if (savedSocialContacts) {
      const parsedContacts = JSON.parse(savedSocialContacts)
      setSocialContacts(parsedContacts)
    }
  }

  return (
    <footer className="bg-black text-white">
      {/* Banner Template 1891x100 */}
      <BannerTemplate 
        src="/banner-template-1891x100.jpg"
        alt="Banner Promocional"
        className="mb-0"
      />

      {/* Footer Principal */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo e Descrição */}
            <div className="md:col-span-1">
              <div className="mb-6">
                <Image
                  src="/logo-gang-boyz-new.svg"
                  alt="Gang Boyz Logo"
                  width={120}
                  height={40}
                  className="mb-4"
                />
                <p className="text-gray-400 text-sm">
                  A marca de streetwear que representa a cultura urbana brasileira com estilo e autenticidade.
                </p>
              </div>
            </div>

            {/* Links Úteis */}
            <div className="md:col-span-1">
              <h3 className="text-white font-semibold mb-4">LINKS ÚTEIS</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div className="md:col-span-1">
              <h3 className="text-white font-semibold mb-4">REDES SOCIAIS</h3>
              <div className="flex items-center space-x-4">
                {socialContacts
                  .filter(contact => contact.isActive)
                  .map((contact) => (
                    <a 
                      key={contact.id}
                      href={contact.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {contact.id === 'instagram' ? (
                        <>
                          <Instagram className="h-5 w-5" />
                          {contact.displayText && (
                            <span className="text-sm">{contact.displayText}</span>
                          )}
                        </>
                      ) : contact.id === 'whatsapp' ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">W</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">?</span>
                        </div>
                      )}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Linha Divisória */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Gang Boyz. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Formas de pagamento:</span>
                <div className="flex items-center space-x-3">
                  <Image
                    src="/visa@2x.png"
                    alt="Visa"
                    width={40}
                    height={25}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/mastercard@2x.png"
                    alt="Mastercard"
                    width={40}
                    height={25}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/pix@2x.png"
                    alt="PIX"
                    width={40}
                    height={25}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/elo@2x.png"
                    alt="Elo"
                    width={40}
                    height={25}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/amex@2x.png"
                    alt="American Express"
                    width={40}
                    height={25}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/hipercard@2x.png"
                    alt="Hipercard"
                    width={40}
                    height={25}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
