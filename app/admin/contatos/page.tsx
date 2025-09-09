"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, RefreshCw, Instagram } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Contact {
  id: string
  platform: string
  url: string
  isActive: boolean
}

export default function ContatosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [saving, setSaving] = useState(false)

  // Carregar contatos do localStorage
  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = () => {
    const savedContacts = localStorage.getItem("gang-boyz-contacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    } else {
      // Contatos padrão
      const defaultContacts: Contact[] = [
        {
          id: "instagram",
          platform: "Instagram",
          url: "https://instagram.com/gangboyz",
          isActive: true
        }
      ]
      setContacts(defaultContacts)
      localStorage.setItem("gang-boyz-contacts", JSON.stringify(defaultContacts))
    }
  }

  const updateContact = (id: string, field: keyof Contact, value: string | boolean) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ))
  }

  const saveContacts = async () => {
    setSaving(true)
    try {
      localStorage.setItem("gang-boyz-contacts", JSON.stringify(contacts))
      
      // Disparar evento para atualizar o footer
      window.dispatchEvent(new CustomEvent('contactsUpdated'))
      
      toast.success("Contatos salvos com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar contatos")
    } finally {
      setSaving(false)
    }
  }

  const resetContacts = () => {
    const defaultContacts: Contact[] = [
      {
        id: "instagram",
        platform: "Instagram",
        url: "https://instagram.com/gangboyz",
        isActive: true
      }
    ]
    setContacts(defaultContacts)
    toast.success("Contatos resetados para o padrão!")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
              <p className="text-gray-600">Gerencie os links de contato das redes sociais</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={resetContacts}
              disabled={saving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button 
              onClick={saveContacts}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{contact.platform}</h3>
                  <p className="text-gray-600">Link do perfil oficial</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`url-${contact.id}`}>URL do Perfil</Label>
                  <Input
                    id={`url-${contact.id}`}
                    value={contact.url}
                    onChange={(e) => updateContact(contact.id, 'url', e.target.value)}
                    placeholder="https://instagram.com/seuperfil"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`active-${contact.id}`}>Status</Label>
                  <select
                    id={`active-${contact.id}`}
                    value={contact.isActive ? 'active' : 'inactive'}
                    onChange={(e) => updateContact(contact.id, 'isActive', e.target.value === 'active')}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8">
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Informações</h3>
            <p className="text-blue-800">
              Os links configurados aqui aparecerão no footer do site. 
              Ao clicar no ícone do Instagram, o usuário será direcionado para o link configurado.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}


