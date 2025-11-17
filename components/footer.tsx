"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, Mail, Phone, MapPin, Edit3, Save } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useEditMode } from "@/lib/edit-mode-context"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { toast } from "@/hooks/use-toast"
import { eventManager } from "@/lib/event-manager"

interface Contact {
  id: string
  platform: string
  url: string
  isActive: boolean
  displayText: string
  order: number
}

interface ContactInfo {
  id: string
  type: string
  label: string
  value: string
  isActive: boolean
  order: number
}

interface UsefulLink {
  id: string
  name: string
  url: string
  order: number
}

export function Footer() {
  const [socialContacts, setSocialContacts] = useState<Contact[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const { isEditMode, toggleEditMode } = useEditMode()
  const [editableDescription, setEditableDescription] = useState("A marca de streetwear que representa a cultura urbana brasileira com estilo e autenticidade.")
  const [editingDescription, setEditingDescription] = useState("A marca de streetwear que representa a cultura urbana brasileira com estilo e autenticidade.")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingLinks, setIsEditingLinks] = useState(false)
  const [isEditingSocial, setIsEditingSocial] = useState(false)
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false)
  const [editingSocialContacts, setEditingSocialContacts] = useState<Contact[]>([])
  const [editingContactInfo, setEditingContactInfo] = useState<ContactInfo[]>([])
  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([
    { id: 'sobre', name: 'Sobre Nós', url: '/sobre-nos', order: 1 },
    { id: 'privacidade', name: 'Política de Privacidade', url: '/politica-privacidade', order: 2 },
    { id: 'termos', name: 'Termos de Uso', url: '/termos-uso', order: 3 },
    { id: 'faq', name: 'FAQ', url: '/faq', order: 4 }
  ])
  const [editingLinks, setEditingLinks] = useState<UsefulLink[]>([])

  // Load contact data
  const loadContactData = () => {
    // Verificar se estamos no cliente antes de acessar localStorage
    if (typeof window !== 'undefined') {
      try {
        // Carregar contatos sociais
        const savedSocialContacts = localStorage.getItem("gang-boyz-contacts")
        if (savedSocialContacts) {
          try {
            const parsedContacts = JSON.parse(savedSocialContacts)
            setSocialContacts(parsedContacts)
          } catch (error) {
            console.error('Erro ao fazer parse dos contatos:', error)
          }
        }

        // Carregar informações de contato
        const savedContactInfo = localStorage.getItem("gang-boyz-contact-info")
        if (savedContactInfo) {
          try {
            const parsedContactInfo = JSON.parse(savedContactInfo)
            setContactInfo(parsedContactInfo)
          } catch (error) {
            console.error('Erro ao fazer parse das informações de contato:', error)
          }
        }
        
        // Carregar links úteis
        loadUsefulLinks()
      } catch (error) {
        console.error('Erro ao carregar contatos:', error)
        // Fallback to localStorage if fails
        loadContactDataFromLocalStorage()
      }
    }
  }

  const loadContactDataFromLocalStorage = () => {
    // Carregar contatos sociais
    const savedSocialContacts = localStorage.getItem("gang-boyz-contacts")
    if (savedSocialContacts) {
      try {
        const parsedContacts = JSON.parse(savedSocialContacts)
        setSocialContacts(parsedContacts)
      } catch (error) {
        console.error('Erro ao fazer parse dos contatos:', error)
      }
    }

    // Carregar informações de contato
    const savedContactInfo = localStorage.getItem("gang-boyz-contact-info")
    if (savedContactInfo) {
      try {
        const parsedContactInfo = JSON.parse(savedContactInfo)
        setContactInfo(parsedContactInfo)
      } catch (error) {
        console.error('Erro ao fazer parse das informações de contato:', error)
      }
    }
    
    // Carregar links úteis
    loadUsefulLinks()
  }

  const loadUsefulLinks = () => {
    const savedLinks = localStorage.getItem("gang-boyz-useful-links")
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks)
        setUsefulLinks(parsedLinks)
        setEditingLinks(parsedLinks)
      } catch (error) {
        console.error('Erro ao fazer parse dos links úteis:', error)
      }
    } else {
      // Save default links if none exist
      const defaultLinks = [
        { id: 'sobre', name: 'Sobre Nós', url: '/sobre-nos', order: 1 },
        { id: 'privacidade', name: 'Política de Privacidade', url: '/politica-privacidade', order: 2 },
        { id: 'termos', name: 'Termos de Uso', url: '/termos-uso', order: 3 },
        { id: 'faq', name: 'FAQ', url: '/faq', order: 4 }
      ]
      localStorage.setItem("gang-boyz-useful-links", JSON.stringify(defaultLinks))
      setUsefulLinks(defaultLinks)
      setEditingLinks(defaultLinks)
    }
  }

  // Load footer description
  const loadFooterDescription = () => {
    try {
      // Carregar descrição editável
      const descriptionContent = getContentById("footer-description")
      if (descriptionContent) {
        setEditableDescription(descriptionContent)
        setEditingDescription(descriptionContent)
      }
    } catch (error) {
      console.error('Erro ao carregar descrição do footer:', error)
      // Fall back to localStorage if fails
      const descriptionContent = getContentById("footer-description")
      if (descriptionContent) {
        setEditableDescription(descriptionContent)
        setEditingDescription(descriptionContent)
      }
    }
  }

  useEffect(() => {
    loadContactData()
    
    // Carregar descrição editável
    loadFooterDescription()
    
    // Escutar eventos de atualização
    const handleContactsUpdate = () => {
      loadContactDataFromLocalStorage()
    }
    
    const handleEditableContentsUpdate = () => {
      // This is for backward compatibility with localStorage
      const descriptionContent = getContentById("footer-description")
      if (descriptionContent) {
        setEditableDescription(descriptionContent)
        setEditingDescription(descriptionContent)
      }
    }
    
    window.addEventListener('contactsUpdated', handleContactsUpdate)
    window.addEventListener('editableContentsUpdated', handleEditableContentsUpdate)
    
    return () => {
      window.removeEventListener('contactsUpdated', handleContactsUpdate)
      window.removeEventListener('editableContentsUpdated', handleEditableContentsUpdate)
    }
  }, [])

  const handleSaveDescription = async () => {
    try {
      // Save to localStorage
      updateContentById("footer-description", editingDescription)
      
      setEditableDescription(editingDescription)
      setIsEditingDescription(false)
      
      toast({
        title: "Descrição atualizada",
        description: "A descrição do rodapé foi atualizada com sucesso."
      })
      
      // Emit event to notify other components with throttling
      eventManager.emitThrottled('editableContentsUpdated')
    } catch (error) {
      console.error('Erro ao salvar descrição do footer:', error)
      // Fallback to localStorage only if fails
      updateContentById("footer-description", editingDescription)
      setEditableDescription(editingDescription)
      setIsEditingDescription(false)
      
      toast({
        title: "Erro ao atualizar descrição",
        description: "Ocorreu um erro ao salvar a descrição do rodapé. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleSaveAllContacts = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("gang-boyz-contacts", JSON.stringify(editingSocialContacts))
      localStorage.setItem("gang-boyz-contact-info", JSON.stringify(editingContactInfo))
      localStorage.setItem("gang-boyz-useful-links", JSON.stringify(editingLinks))
      
      // Dispatch event to notify other components with throttling
      eventManager.emitThrottled('contactsUpdated')
      
      setSocialContacts(editingSocialContacts)
      setContactInfo(editingContactInfo)
      setUsefulLinks(editingLinks)
      
      setIsEditingSocial(false)
      setIsEditingContactInfo(false)
      setIsEditingLinks(false)
      
      toast({
        title: "Contatos atualizados",
        description: "As informações de contato do rodapé foram atualizadas com sucesso."
      })
    } catch (error) {
      console.error('Erro ao salvar contatos do footer:', error)
      // Fallback to localStorage only if fails
      localStorage.setItem("gang-boyz-contacts", JSON.stringify(editingSocialContacts))
      localStorage.setItem("gang-boyz-contact-info", JSON.stringify(editingContactInfo))
      localStorage.setItem("gang-boyz-useful-links", JSON.stringify(editingLinks))
      
      // Dispatch event to notify other components with throttling
      eventManager.emitThrottled('contactsUpdated')
      
      setSocialContacts(editingSocialContacts)
      setContactInfo(editingContactInfo)
      setUsefulLinks(editingLinks)
      
      setIsEditingSocial(false)
      setIsEditingContactInfo(false)
      setIsEditingLinks(false)
      
      toast({
        title: "Erro ao atualizar contatos",
        description: "Ocorreu um erro ao salvar as informações de contato do rodapé. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingDescription(editableDescription)
    setIsEditingDescription(false)
  }

  const handleSaveLinks = () => {
    handleSaveAllContacts()
  }

  const handleCancelLinksEdit = () => {
    setEditingLinks([...usefulLinks])
    setIsEditingLinks(false)
  }

  const addNewLink = () => {
    const newLink: UsefulLink = {
      id: `link-${Date.now()}`,
      name: 'Novo Link',
      url: '#',
      order: editingLinks.length + 1
    }
    setEditingLinks([...editingLinks, newLink])
  }

  const updateLink = (id: string, field: string, value: string) => {
    setEditingLinks(editingLinks.map(link => 
      link.id === id ? {...link, [field]: value} : link
    ))
  }

  const removeLink = (id: string) => {
    setEditingLinks(editingLinks.filter(link => link.id !== id))
  }

  const handleEditSocialContacts = () => {
    setIsEditingSocial(true)
    setEditingSocialContacts([...socialContacts])
  }

  const handleCancelSocialEdit = () => {
    setEditingSocialContacts([...socialContacts])
    setIsEditingSocial(false)
  }

  const handleEditContactInfo = () => {
    setIsEditingContactInfo(true)
    setEditingContactInfo([...contactInfo])
  }

  const handleCancelContactInfoEdit = () => {
    setEditingContactInfo([...contactInfo])
    setIsEditingContactInfo(false)
  }

  const addSocialContact = () => {
    const newContact: Contact = {
      id: `social-${Date.now()}`,
      platform: 'instagram',
      url: '',
      isActive: true,
      displayText: '',
      order: editingSocialContacts.length + 1
    }
    setEditingSocialContacts([...editingSocialContacts, newContact])
  }

  const updateSocialContact = (id: string, field: string, value: string | boolean) => {
    setEditingSocialContacts(editingSocialContacts.map(contact => 
      contact.id === id ? {...contact, [field]: value} : contact
    ))
  }

  const removeSocialContact = (id: string) => {
    setEditingSocialContacts(editingSocialContacts.filter(contact => contact.id !== id))
  }

  const addContactInfo = () => {
    const newContactInfo: ContactInfo = {
      id: `info-${Date.now()}`,
      type: 'email',
      label: '',
      value: '',
      isActive: true,
      order: editingContactInfo.length + 1
    }
    setEditingContactInfo([...editingContactInfo, newContactInfo])
  }

  const updateContactInfo = (id: string, field: string, value: string | boolean) => {
    setEditingContactInfo(editingContactInfo.map(info => 
      info.id === id ? {...info, [field]: value} : info
    ))
  }

  const removeContactInfo = (id: string) => {
    setEditingContactInfo(editingContactInfo.filter(info => info.id !== id))
  }

  return (
    <footer className="bg-black text-white">
      {/* Footer Principal */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo e Descrição */}
            <div className="md:col-span-1">
              <div className="mb-6 relative">
                <div className="relative inline-block">
                  <Image
                    src="/logo-gang-boyz-new.svg"
                    alt="Gang Boyz Logo"
                    width={120}
                    height={40}
                    className="mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={toggleEditMode}
                  />
                  {isEditMode && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      ✎
                    </div>
                  )}
                </div>
                <div className="relative">
                  {isEditMode && isEditingDescription ? (
                    <div className="mb-2">
                      <Textarea
                        value={editingDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingDescription(e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveDescription} 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Salvar
                        </Button>
                        <Button 
                          onClick={handleCancelEdit} 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : isEditMode ? (
                    <div 
                      className="text-gray-400 text-sm cursor-pointer hover:bg-gray-800 p-2 rounded"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      <div className="flex items-start gap-1">
                        <Edit3 className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span>{editableDescription}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      {editableDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Links Úteis */}
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">LINKS ÚTEIS</h3>
                {isEditMode && (
                  <button 
                    onClick={() => {
                      setIsEditingLinks(true)
                      setEditingLinks([...usefulLinks])
                    }}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {isEditMode && isEditingLinks ? (
                <div className="space-y-3">
                  {editingLinks.map((link) => (
                    <div key={link.id} className="flex items-center gap-2">
                      <Input
                        value={link.name}
                        onChange={(e) => updateLink(link.id, 'name', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                        placeholder="Nome do link"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                        placeholder="URL"
                      />
                      <button
                        onClick={() => removeLink(link.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={addNewLink}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Adicionar Link
                    </Button>
                    <Button 
                      onClick={handleSaveLinks} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Salvar
                    </Button>
                    <Button 
                      onClick={handleCancelLinksEdit} 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2 text-gray-400 text-sm">
                  {usefulLinks.map((link) => (
                    <li key={link.id}>
                      <a href={link.url} className="hover:text-white transition-colors">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Redes Sociais */}
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">REDES SOCIAIS</h3>
                {isEditMode && (
                  <button 
                    onClick={handleEditSocialContacts}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {isEditMode && isEditingSocial ? (
                <div className="space-y-3">
                  {editingSocialContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-2">
                      <select
                        value={contact.platform}
                        onChange={(e) => updateSocialContact(contact.id, 'platform', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                      <Input
                        value={contact.displayText || ''}
                        onChange={(e) => updateSocialContact(contact.id, 'displayText', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                        placeholder="Nome de usuário"
                      />
                      <Input
                        value={contact.url}
                        onChange={(e) => updateSocialContact(contact.id, 'url', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                        placeholder="URL"
                      />
                      <button
                        onClick={() => removeSocialContact(contact.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={addSocialContact}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Adicionar Rede Social
                    </Button>
                    <Button 
                      onClick={handleSaveAllContacts} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Salvar
                    </Button>
                    <Button 
                      onClick={handleCancelSocialEdit} 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
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
                        {contact.platform === 'instagram' && <Instagram className="h-5 w-5" />}
                        {contact.platform === 'facebook' && <Instagram className="h-5 w-5" />}
                        {contact.platform === 'twitter' && <Instagram className="h-5 w-5" />}
                        {contact.platform === 'youtube' && <Instagram className="h-5 w-5" />}
                        {contact.platform === 'tiktok' && <Instagram className="h-5 w-5" />}
                        {contact.platform === 'whatsapp' && <Instagram className="h-5 w-5" />}
                        {contact.displayText && (
                          <span className="text-sm">{contact.displayText}</span>
                        )}
                      </a>
                    ))}
                </div>
              )}
            </div>

            {/* Contatos */}
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">CONTATOS</h3>
                {isEditMode && (
                  <button 
                    onClick={handleEditContactInfo}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {isEditMode && isEditingContactInfo ? (
                <div className="space-y-3">
                  {editingContactInfo.map((info) => (
                    <div key={info.id} className="flex items-center gap-2">
                      <select
                        value={info.type}
                        onChange={(e) => updateContactInfo(info.id, 'type', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Telefone</option>
                        <option value="address">Endereço</option>
                      </select>
                      <Input
                        value={info.label}
                        onChange={(e) => updateContactInfo(info.id, 'label', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                        placeholder="Rótulo"
                      />
                      <Input
                        value={info.value}
                        onChange={(e) => updateContactInfo(info.id, 'value', e.target.value)}
                        className="text-gray-400 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                        placeholder="Valor"
                      />
                      <button
                        onClick={() => removeContactInfo(info.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={addContactInfo}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Adicionar Contato
                    </Button>
                    <Button 
                      onClick={handleSaveAllContacts} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Salvar
                    </Button>
                    <Button 
                      onClick={handleCancelContactInfoEdit} 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactInfo.filter(info => info.isActive).length > 0 ? (
                    contactInfo.filter(info => info.isActive).map((info) => (
                      <div key={info.id} className="flex items-start space-x-3 text-gray-400 text-sm">
                        <div className="text-gray-500 mt-0.5">
                          {info.type === 'email' ? (
                            <Mail className="h-4 w-4" />
                          ) : info.type === 'phone' ? (
                            <Phone className="h-4 w-4" />
                          ) : info.type === 'address' ? (
                            <MapPin className="h-4 w-4" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs uppercase tracking-wide">{info.label}</div>
                          <div className="text-white text-sm font-medium">{info.value}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Nenhuma informação de contato disponível
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Linha Divisória */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                © 2024 Gang Boyz. Todos os direitos reservados.
                {/* Hidden edit mode toggle - activates on logo click */}
                <button 
                  onClick={toggleEditMode}
                  className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  title="Ativar modo de edição"
                >
                  <Edit3 className="h-3 w-3 text-gray-500 hover:text-white" />
                </button>
              </p>
              <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-gray-400 text-sm">Formas de pagamento:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <Image
                    src="/visa@2x.png"
                    alt="Visa"
                    width={35}
                    height={22}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/mastercard@2x.png"
                    alt="Mastercard"
                    width={35}
                    height={22}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/pix@2x.png"
                    alt="PIX"
                    width={35}
                    height={22}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/elo@2x.png"
                    alt="Elo"
                    width={35}
                    height={22}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/amex@2x.png"
                    alt="American Express"
                    width={35}
                    height={22}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/hipercard@2x.png"
                    alt="Hipercard"
                    width={35}
                    height={22}
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