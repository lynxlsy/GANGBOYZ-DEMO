"use client"

import { 
  Clock, Package, Truck, CreditCard, Save, Shield, Star, Heart, Award, Headphones, 
  RefreshCw, Tag, Gift, Smartphone, Mail, MapPin, User, ShoppingBag, Zap, Wifi, 
  Camera, Music, Book, Coffee, Bike, Car, Home, Calendar, DollarSign, Percent, 
  CheckCircle, XCircle, Info, HelpCircle, AlertTriangle, Lock, Unlock, Eye, EyeOff, 
  Search, Filter, Settings, Bell, MessageCircle, Phone, Globe 
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { editableContentSyncService } from '@/lib/editable-content-sync';

interface Service {
  id: string
  icon: string
  title: string
  subtitle: string
  isActive: boolean
}

export function ServicesSection({ isEditMode = false }: { isEditMode?: boolean }) {
  const [services, setServices] = useState<Service[]>([
    {
      id: "atendimento",
      icon: "Clock",
      title: "ATENDIMENTO",
      subtitle: "Segunda à sexta das 9h00 às 17h00",
      isActive: true
    },
    {
      id: "trocas",
      icon: "Package",
      title: "TROCAS E DEVOLUÇÕES",
      subtitle: "Primeira troca é grátis",
      isActive: true
    },
    {
      id: "frete",
      icon: "Truck",
      title: "FRETE",
      subtitle: "Grátis acima de R$349",
      isActive: true
    },
    {
      id: "parcelamento",
      icon: "CreditCard",
      title: "PARCELAMENTO",
      subtitle: "Em até 10x sem juros no cartão",
      isActive: true
    }
  ])
  const [editableServices, setEditableServices] = useState([
    {
      id: "atendimento",
      title: "ATENDIMENTO",
      subtitle: "Segunda à sexta das 9h00 às 17h00",
      icon: "Clock"
    },
    {
      id: "trocas",
      title: "TROCAS E DEVOLUÇÕES",
      subtitle: "Primeira troca é grátis",
      icon: "Package"
    },
    {
      id: "frete",
      title: "FRETE",
      subtitle: "Grátis acima de R$349",
      icon: "Truck"
    },
    {
      id: "parcelamento",
      title: "PARCELAMENTO",
      subtitle: "Em até 10x sem juros no cartão",
      icon: "CreditCard"
    }
  ])
  const [editingServices, setEditingServices] = useState([
    {
      id: "atendimento",
      title: "ATENDIMENTO",
      subtitle: "Segunda à sexta das 9h00 às 17h00",
      icon: "Clock"
    },
    {
      id: "trocas",
      title: "TROCAS E DEVOLUÇÕES",
      subtitle: "Primeira troca é grátis",
      icon: "Package"
    },
    {
      id: "frete",
      title: "FRETE",
      subtitle: "Grátis acima de R$349",
      icon: "Truck"
    },
    {
      id: "parcelamento",
      title: "PARCELAMENTO",
      subtitle: "Em até 10x sem juros no cartão",
      icon: "CreditCard"
    }
  ])
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    loadServices()
    loadEditableServices()
    
    // Escutar eventos de atualização
    const handleServicesUpdate = () => {
      loadServices()
    }
    
    const handleEditableContentsUpdate = () => {
      loadEditableServices()
    }
    
    window.addEventListener('servicesUpdated', handleServicesUpdate)
    window.addEventListener('editableContentsUpdated', handleEditableContentsUpdate)
    
    // Firebase real-time listener (now handles both text and icons)
    const unsubscribeFirebase = editableContentSyncService.listenToContentChanges("services", (content) => {
      if (content) {
        // Parse and update services when Firebase content changes (including icons)
        const lines = content.split('\n\n')
        if (lines.length >= 4) {
          const updatedServices = []
          
          // Parse each service block (3 lines per service: title, subtitle, ICON:icon)
          for (let i = 0; i < lines.length && updatedServices.length < 4; i++) {
            const serviceLines = lines[i].split('\n')
            if (serviceLines.length >= 3) {
              const title = serviceLines[0] || ""
              const subtitle = serviceLines[1] || ""
              const iconLine = serviceLines[2] || ""
              const icon = iconLine.startsWith('ICON:') ? iconLine.substring(5) : "Clock"
              
              // Map to the correct service ID based on title
              let serviceId = "atendimento" // default
              if (title.includes("TROCA") || title.includes("troca")) {
                serviceId = "trocas"
              } else if (title.includes("FRET") || title.includes("fret")) {
                serviceId = "frete"
              } else if (title.includes("PARCEL") || title.includes("parcel") || title.includes("PAGAMENT") || title.includes("pagament")) {
                serviceId = "parcelamento"
              }
              
              updatedServices.push({
                id: serviceId,
                title: title,
                subtitle: subtitle,
                icon: icon,
                isActive: true
              })
            }
          }
          
          if (updatedServices.length > 0) {
            // Save to localStorage
            localStorage.setItem("gang-boyz-services", JSON.stringify(updatedServices))
            setServices(updatedServices)
            window.dispatchEvent(new Event('servicesUpdated'))
          }
        }
      }
    })
    
    return () => {
      window.removeEventListener('servicesUpdated', handleServicesUpdate)
      window.removeEventListener('editableContentsUpdated', handleEditableContentsUpdate)
      // Clean up Firebase listener
      unsubscribeFirebase()
    }
  }, []) // Run only once on mount

  const loadServices = () => {
    if (typeof window !== 'undefined') {
      const savedServices = localStorage.getItem("gang-boyz-services")
      if (savedServices) {
        try {
          const parsedServices = JSON.parse(savedServices)
          setServices(parsedServices)
        } catch (error) {
          console.error('Erro ao fazer parse dos serviços:', error)
        }
      } else {
        // Initialize with default services if none exist
        const defaultServices = [
          {
            id: "atendimento",
            icon: "Clock",
            title: "ATENDIMENTO",
            subtitle: "Segunda à sexta das 9h00 às 17h00",
            isActive: true
          },
          {
            id: "trocas",
            icon: "Package",
            title: "TROCAS E DEVOLUÇÕES",
            subtitle: "Primeira troca é grátis",
            isActive: true
          },
          {
            id: "frete",
            icon: "Truck",
            title: "FRETE",
            subtitle: "Grátis acima de R$349",
            isActive: true
          },
          {
            id: "parcelamento",
            icon: "CreditCard",
            title: "PARCELAMENTO",
            subtitle: "Em até 10x sem juros no cartão",
            isActive: true
          }
        ]
        localStorage.setItem("gang-boyz-services", JSON.stringify(defaultServices))
        setServices(defaultServices)
      }
    }
  }

  const loadEditableServices = () => {
    if (typeof window !== 'undefined') {
      // Try to get services from Firebase first (now includes icons)
      const servicesContent = getContentById("services")
      if (servicesContent) {
        const lines = servicesContent.split('\n\n')
        if (lines.length >= 4) {
          const parsedServices = []
          
          // Parse each service block (3 lines per service: title, subtitle, ICON:icon)
          for (let i = 0; i < lines.length && parsedServices.length < 4; i++) {
            const serviceLines = lines[i].split('\n')
            if (serviceLines.length >= 3) {
              const title = serviceLines[0] || ""
              const subtitle = serviceLines[1] || ""
              const iconLine = serviceLines[2] || ""
              const icon = iconLine.startsWith('ICON:') ? iconLine.substring(5) : "Clock"
              
              // Map to the correct service ID based on title
              let serviceId = "atendimento" // default
              if (title.includes("TROCA") || title.includes("troca")) {
                serviceId = "trocas"
              } else if (title.includes("FRET") || title.includes("fret")) {
                serviceId = "frete"
              } else if (title.includes("PARCEL") || title.includes("parcel") || title.includes("PAGAMENT") || title.includes("pagament")) {
                serviceId = "parcelamento"
              }
              
              parsedServices.push({
                id: serviceId,
                title: title,
                subtitle: subtitle,
                icon: icon
              })
            }
          }
          
          if (parsedServices.length > 0) {
            setEditableServices(parsedServices)
            return
          }
        }
      }
      
      // Fallback to localStorage if Firebase content is not available
      const savedServices = localStorage.getItem("gang-boyz-services")
      if (savedServices) {
        try {
          const parsedServices = JSON.parse(savedServices)
          setEditableServices(parsedServices)
        } catch (error) {
          console.error('Erro ao fazer parse dos serviços editáveis:', error)
        }
      }
    }
  }

  const handleSaveServices = async () => {
    // Format services for saving (including icons for Firebase sync)
    const servicesContent = editingServices.map(service => 
      `${service.title}\n${service.subtitle}\nICON:${service.icon}` // Include icon in the format
    ).join('\n\n')
    
    // Update content in Firebase and localStorage (now including icons)
    await updateContentById("services", servicesContent)
    setEditableServices(editingServices)
    
    // Save the complete service data with icons to localStorage
    const updatedServices = editingServices.map(service => ({
      id: service.id,
      icon: service.icon, // Preserve the icon
      title: service.title,
      subtitle: service.subtitle,
      isActive: true
    }))
    
    localStorage.setItem("gang-boyz-services", JSON.stringify(updatedServices))
    
    // Remove separate icon storage since icons are now in main storage
    localStorage.removeItem("gang-boyz-services-icons")
    
    setServices(updatedServices)
    window.dispatchEvent(new Event('servicesUpdated'))
    
    toast({
      title: "Serviços atualizados",
      description: "Os serviços foram salvos com sucesso.",
    })
  }

  const handleCancelEdit = () => {
    setEditingServices(editableServices)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return Clock
      case 'Package': return Package
      case 'Truck': return Truck
      case 'CreditCard': return CreditCard
      case 'Shield': return Shield
      case 'Star': return Star
      case 'Heart': return Heart
      case 'Award': return Award
      case 'Headphones': return Headphones
      case 'RefreshCw': return RefreshCw
      case 'Tag': return Tag
      case 'Gift': return Gift
      case 'Smartphone': return Smartphone
      case 'Mail': return Mail
      case 'MapPin': return MapPin
      case 'User': return User
      case 'ShoppingBag': return ShoppingBag
      case 'Zap': return Zap
      case 'Wifi': return Wifi
      case 'Camera': return Camera
      case 'Music': return Music
      case 'Book': return Book
      case 'Coffee': return Coffee
      case 'Bike': return Bike
      case 'Car': return Car
      case 'Home': return Home
      case 'Calendar': return Calendar
      case 'DollarSign': return DollarSign
      case 'Percent': return Percent
      case 'CheckCircle': return CheckCircle
      case 'XCircle': return XCircle
      case 'Info': return Info
      case 'HelpCircle': return HelpCircle
      case 'AlertTriangle': return AlertTriangle
      case 'Lock': return Lock
      case 'Unlock': return Unlock
      case 'Eye': return Eye
      case 'EyeOff': return EyeOff
      case 'Search': return Search
      case 'Filter': return Filter
      case 'Settings': return Settings
      case 'Bell': return Bell
      case 'MessageCircle': return MessageCircle
      case 'Phone': return Phone
      case 'Globe': return Globe
      default: return Clock
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alterações salvas com sucesso!</DialogTitle>
              <DialogDescription>
                As alterações nos serviços foram salvas com sucesso.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setShowSuccessModal(false)}>OK</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {isEditMode ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-black">Editar Serviços</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {editingServices.map((service, index) => (
                <div key={service.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Ícone</label>
                    <select
                      value={service.icon}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newServices = [...editingServices]
                        newServices[index].icon = e.target.value
                        setEditingServices(newServices)
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-black shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    >
                      <option value="Clock">Relógio</option>
                      <option value="Package">Pacote</option>
                      <option value="Truck">Caminhão</option>
                      <option value="CreditCard">Cartão de Crédito</option>
                      <option value="Shield">Escudo</option>
                      <option value="Star">Estrela</option>
                      <option value="Heart">Coração</option>
                      <option value="Award">Prêmio</option>
                      <option value="Headphones">Fones de Ouvido</option>
                      <option value="RefreshCw">Atualizar</option>
                      <option value="Tag">Etiqueta</option>
                      <option value="Gift">Presente</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Mail">E-mail</option>
                      <option value="MapPin">Localização</option>
                      <option value="User">Usuário</option>
                      <option value="ShoppingBag">Sacola de Compras</option>
                      <option value="Zap">Raio</option>
                      <option value="Wifi">Wi-Fi</option>
                      <option value="Camera">Câmera</option>
                      <option value="Music">Música</option>
                      <option value="Book">Livro</option>
                      <option value="Coffee">Café</option>
                      <option value="Bike">Bicicleta</option>
                      <option value="Car">Carro</option>
                      <option value="Home">Casa</option>
                      <option value="Calendar">Calendário</option>
                      <option value="DollarSign">Dólar</option>
                      <option value="Percent">Porcentagem</option>
                      <option value="CheckCircle">Círculo de Verificação</option>
                      <option value="XCircle">Círculo X</option>
                      <option value="Info">Informação</option>
                      <option value="HelpCircle">Ajuda</option>
                      <option value="AlertTriangle">Alerta</option>
                      <option value="Lock">Fechadura</option>
                      <option value="Unlock">Destravar</option>
                      <option value="Eye">Olho</option>
                      <option value="EyeOff">Olho Fechado</option>
                      <option value="Search">Pesquisar</option>
                      <option value="Filter">Filtro</option>
                      <option value="Settings">Configurações</option>
                      <option value="Bell">Sino</option>
                      <option value="MessageCircle">Mensagem</option>
                      <option value="Phone">Telefone</option>
                      <option value="Globe">Globo</option>
                    </select>
                  </div>
                  <Input
                    value={service.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newServices = [...editingServices]
                      newServices[index].title = e.target.value
                      setEditingServices(newServices)
                    }}
                    placeholder="Título do serviço"
                    className="mb-2 text-black bg-white border-gray-300"
                  />
                  <Input
                    value={service.subtitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newServices = [...editingServices]
                      newServices[index].subtitle = e.target.value
                      setEditingServices(newServices)
                    }}
                    placeholder="Descrição do serviço"
                    className="text-gray-700 bg-white border-gray-300"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <Button onClick={handleSaveServices} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-1" />
                Salvar Todos
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancelar
              </Button>
            </div>
          </div>
        ) : null}
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.filter(service => service.isActive).map((service) => {
            // The service object now contains the icon information from Firebase
            const IconComponent = getIconComponent(service.icon || "Clock")
            return (
              <div key={service.id} className="text-center">
                <div className="flex justify-center mb-4">
                  <IconComponent className="h-12 w-12 text-gray-800" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 uppercase">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.subtitle}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}



