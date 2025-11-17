"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useEditMode } from "@/lib/edit-mode-context"
import { Edit3 } from "lucide-react"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from '@/lib/editable-content-sync';

interface WhatsAppButtonProps {
  className?: string
}

export function WhatsAppButton({ className = "" }: WhatsAppButtonProps) {
  const { isEditMode } = useEditMode()
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/5511999999999")
  const [isEditing, setIsEditing] = useState(false)
  const [editLink, setEditLink] = useState("")
  const whatsappLinkRef = useRef(whatsappLink);

  // Keep the ref updated with the latest whatsappLink
  useEffect(() => {
    whatsappLinkRef.current = whatsappLink;
  }, [whatsappLink]);

  useEffect(() => {
    // Carregar link do WhatsApp dos contatos ou Firebase
    const loadWhatsAppLink = () => {
      if (typeof window !== 'undefined') {
        // Try localStorage first
        const savedContacts = localStorage.getItem("gang-boyz-contacts")
        if (savedContacts) {
          try {
            const contacts = JSON.parse(savedContacts)
            const whatsappContact = contacts.find((contact: any) => contact.id === 'whatsapp')
            if (whatsappContact && whatsappContact.isActive) {
              setWhatsappLink(whatsappContact.url)
              setEditLink(whatsappContact.url)
              return;
            }
          } catch (error) {
            console.error('Erro ao fazer parse dos contatos:', error)
          }
        }
        
        // Try Firebase as fallback
        const firebaseContent = getContentById("whatsapp-link")
        if (firebaseContent) {
          setWhatsappLink(firebaseContent)
          setEditLink(firebaseContent)
          // Also save to localStorage for offline access
          const contacts = [{
            id: 'whatsapp',
            url: firebaseContent,
            isActive: true
          }]
          localStorage.setItem("gang-boyz-contacts", JSON.stringify(contacts))
        }
      }
    }

    loadWhatsAppLink()

    // Firebase real-time listener for WhatsApp link
    const unsubscribeWhatsApp = editableContentSyncService.listenToContentChanges("whatsapp-link", (content) => {
      if (content) {
        setWhatsappLink(content)
        setEditLink(content)
        // Also save to localStorage for offline access
        const contacts = [{
          id: 'whatsapp',
          url: content,
          isActive: true
        }]
        localStorage.setItem("gang-boyz-contacts", JSON.stringify(contacts))
      }
    });

    // Escutar atualizações de contatos
    const handleContactsUpdate = () => {
      loadWhatsAppLink()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('contactsUpdated', handleContactsUpdate)
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('contactsUpdated', handleContactsUpdate)
      }
      // Clean up Firebase listener
      unsubscribeWhatsApp()
    }
  }, [])

  const handleWhatsAppClick = () => {
    if (isEditMode) {
      // No modo de edição, permitir editar o link
      setIsEditing(true)
      setEditLink(whatsappLink)
    } else {
      // Abrir WhatsApp em nova aba
      window.open(whatsappLink, "_blank")
    }
  }

  const handleSaveLink = () => {
    // Atualizar o link do WhatsApp nos contatos
    if (typeof window !== 'undefined') {
      const savedContacts = localStorage.getItem("gang-boyz-contacts")
      if (savedContacts) {
        try {
          const contacts = JSON.parse(savedContacts)
          const updatedContacts = contacts.map((contact: any) => 
            contact.id === 'whatsapp' ? {...contact, url: editLink} : contact
          )
          localStorage.setItem("gang-boyz-contacts", JSON.stringify(updatedContacts))
          
          // Dispatch event to notify other components
          window.dispatchEvent(new Event('contactsUpdated'))
          
          setWhatsappLink(editLink)
        } catch (error) {
          console.error('Erro ao atualizar contatos:', error)
        }
      }
      
      // Save to Firebase
      updateContentById("whatsapp-link", editLink)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditLink(whatsappLink)
    setIsEditing(false)
  }

  return (
    <>
      <button
        onClick={handleWhatsAppClick}
        className={`fixed bottom-8 left-8 z-50 p-2 transition-all duration-300 hover:scale-110 group ${className} ${isEditMode ? 'ring-2 ring-yellow-400 rounded-full' : ''}`}
        title={isEditMode ? "Editar link do WhatsApp" : "Fale conosco no WhatsApp"}
      >
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={54}
          height={54}
          className="text-white"
        />
        
        {/* Tooltip */}
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {isEditMode ? "Editar link do WhatsApp" : "Fale conosco no WhatsApp"}
          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
        </div>
        
        {/* Ícone de edição no modo de edição */}
        {isEditMode && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
            <Edit3 className="h-3 w-3 text-gray-900" />
          </div>
        )}
      </button>

      {/* Modal de edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Editar Link do WhatsApp</h3>
            <p className="text-gray-300 text-sm mb-4">
              Insira o link completo do WhatsApp Business ou número com o formato wa.me
            </p>
            
            <input
              type="text"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 mb-6 border border-gray-600 focus:border-yellow-400 focus:outline-none"
              placeholder="https://wa.me/5511999999999"
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveLink}
                className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}