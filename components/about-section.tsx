"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminEditButton } from "@/components/admin-edit-button"
import { AdminEditModal } from "@/components/admin-edit-modal"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { toast } from "@/components/ui/use-toast"
import { Edit3, Save } from "lucide-react"
import { useEditMode } from "@/lib/edit-mode-context"

interface AboutInfo {
  title: string
  description: string
  missionTitle: string
  missionDescription: string
  stats: {
    orders: {
      number: string
      title: string
      description: string
    }
    clients: {
      number: string
      title: string
      description: string
    }
    monthly: {
      number: string
      title: string
      description: string
    }
  }
}

const defaultAboutInfo: AboutInfo = {
  title: "SOBRE A GANG BOYZ",
  description: "Mais do que uma loja, uma referência no mercado quando falamos em excelência, trazemos as peças mais exclusivas e sempre estamos por dentro da moda atual para nossos clientes não ficarem para trás. Com +20 mil pedidos enviados, +15 mil clientes atendidos, +1000 envios todo mês, hoje não há dúvida que escolher a Gang Boyz é a escolha certa para seu guarda-roupa.",
  missionTitle: "NOSSA MISSÃO",
  missionDescription: "Ser a marca de streetwear mais autêntica do Brasil, representando a cultura urbana com qualidade, estilo e inovação. Queremos que cada peça conte uma história e que nossos clientes se sintam parte de uma comunidade que valoriza a expressão individual através da moda.",
  stats: {
    orders: {
      number: "+20K",
      title: "Pedidos Enviados",
      description: "Milhares de entregas realizadas"
    },
    clients: {
      number: "+15K",
      title: "Clientes Atendidos",
      description: "Pessoas que confiam na nossa marca"
    },
    monthly: {
      number: "+1K",
      title: "Envios por Mês",
      description: "Entregas mensais garantidas"
    }
  }
}

export function AboutSection({ isEditMode = false }: { isEditMode?: boolean }) {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(defaultAboutInfo)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editMode, setEditMode] = useState<'about' | 'stats-orders' | 'stats-clients' | 'stats-monthly' | 'mission' | null>(null)
  const [editableTitle, setEditableTitle] = useState("SOBRE A GANG BOYZ")
  const [editableDescription, setEditableDescription] = useState("Mais do que uma loja, uma referência no mercado quando falamos em excelência, trazemos as peças mais exclusivas e sempre estamos por dentro da moda atual para nossos clientes não ficarem para trás. Com +20 mil pedidos enviados, +15 mil clientes atendidos, +1000 envios todo mês, hoje não há dúvida que escolher a Gang Boyz é a escolha certa para seu guarda-roupa.")
  const [editableMissionTitle, setEditableMissionTitle] = useState("NOSSA MISSÃO")
  const [editableMissionDescription, setEditableMissionDescription] = useState("Ser a marca de streetwear mais autêntica do Brasil, representando a cultura urbana com qualidade, estilo e inovação. Queremos que cada peça conte uma história e que nossos clientes se sintam parte de uma comunidade que valoriza a expressão individual através da moda.")
  const [editableStats, setEditableStats] = useState({
    orders: {
      number: "+20K",
      title: "Pedidos Enviados",
      description: "Milhares de entregas realizadas"
    },
    clients: {
      number: "+15K",
      title: "Clientes Atendidos",
      description: "Pessoas que confiam na nossa marca"
    },
    monthly: {
      number: "+1K",
      title: "Envios por Mês",
      description: "Entregas mensais garantidas"
    }
  })
  const [editingTitle, setEditingTitle] = useState("")
  const [editingDescription, setEditingDescription] = useState("")
  const [editingMissionTitle, setEditingMissionTitle] = useState("")
  const [editingMissionDescription, setEditingMissionDescription] = useState("")
  const [editingStats, setEditingStats] = useState({
    orders: {
      number: "+20K",
      title: "Pedidos Enviados",
      description: "Milhares de entregas realizadas"
    },
    clients: {
      number: "+15K",
      title: "Clientes Atendidos",
      description: "Pessoas que confiam na nossa marca"
    },
    monthly: {
      number: "+1K",
      title: "Envios por Mês",
      description: "Entregas mensais garantidas"
    }
  })
  const { isEditMode: globalEditMode } = useEditMode()

  useEffect(() => {
    loadAboutInfo()
    loadEditableContents()
    
    // Escutar eventos de atualização
    const handleAboutInfoUpdate = () => {
      loadAboutInfo()
    }
    
    const handleEditableContentsUpdate = () => {
      loadEditableContents()
    }
    
    window.addEventListener('aboutInfoUpdated', handleAboutInfoUpdate)
    window.addEventListener('editableContentsUpdated', handleEditableContentsUpdate)
    return () => {
      window.removeEventListener('aboutInfoUpdated', handleAboutInfoUpdate)
      window.removeEventListener('editableContentsUpdated', handleEditableContentsUpdate)
    }
  }, [])

  const loadAboutInfo = () => {
    if (typeof window !== 'undefined') {
      const savedInfo = localStorage.getItem("gang-boyz-about-info")
      if (savedInfo) {
        try {
          setAboutInfo(JSON.parse(savedInfo))
        } catch (error) {
          console.error('Erro ao fazer parse das informações sobre:', error)
          setAboutInfo(defaultAboutInfo)
        }
      } else {
        setAboutInfo(defaultAboutInfo)
      }
    }
  }

  const loadEditableContents = () => {
    // Carregar título sobre
    const titleContent = getContentById("about-title")
    if (titleContent) {
      setEditableTitle(titleContent)
      setEditingTitle(titleContent)
    }
    
    // Carregar descrição sobre
    const descriptionContent = getContentById("about-description")
    if (descriptionContent) {
      setEditableDescription(descriptionContent)
      setEditingDescription(descriptionContent)
    }
    
    // Carregar título missão
    const missionTitleContent = getContentById("mission-title")
    if (missionTitleContent) {
      setEditableMissionTitle(missionTitleContent)
      setEditingMissionTitle(missionTitleContent)
    }
    
    // Carregar descrição missão
    const missionDescriptionContent = getContentById("mission-description")
    if (missionDescriptionContent) {
      setEditableMissionDescription(missionDescriptionContent)
      setEditingMissionDescription(missionDescriptionContent)
    }
    
    // Carregar estatísticas
    const ordersContent = getContentById("about-stats-orders")
    if (ordersContent) {
      const lines = ordersContent.split('\n')
      if (lines.length >= 3) {
        setEditableStats(prev => ({
          ...prev,
          orders: {
            number: lines[0],
            title: lines[1],
            description: lines[2]
          }
        }))
        setEditingStats(prev => ({
          ...prev,
          orders: {
            number: lines[0],
            title: lines[1],
            description: lines[2]
          }
        }))
      }
    }
    
    const clientsContent = getContentById("about-stats-clients")
    if (clientsContent) {
      const lines = clientsContent.split('\n')
      if (lines.length >= 3) {
        setEditableStats(prev => ({
          ...prev,
          clients: {
            number: lines[0],
            title: lines[1],
            description: lines[2]
          }
        }))
        setEditingStats(prev => ({
          ...prev,
          clients: {
            number: lines[0],
            title: lines[1],
            description: lines[2]
          }
        }))
      }
    }
    
    const monthlyContent = getContentById("about-stats-monthly")
    if (monthlyContent) {
      const lines = monthlyContent.split('\n')
      if (lines.length >= 3) {
        setEditableStats(prev => ({
          ...prev,
          monthly: {
            number: lines[0],
            title: lines[1],
            description: lines[2]
          }
        }))
        setEditingStats(prev => ({
          ...prev,
          monthly: {
            number: lines[0],
            title: lines[1],
            description: lines[2]
          }
        }))
      }
    }
  }

  const handleSaveAboutInfo = () => {
    // Salvar título e descrição
    updateContentById("about-title", editingTitle)
    updateContentById("about-description", editingDescription)
    updateContentById("mission-title", editingMissionTitle)
    updateContentById("mission-description", editingMissionDescription)
    
    // Salvar estatísticas
    const ordersContent = `${editingStats.orders.number}\n${editingStats.orders.title}\n${editingStats.orders.description}`
    updateContentById("about-stats-orders", ordersContent)
    
    const clientsContent = `${editingStats.clients.number}\n${editingStats.clients.title}\n${editingStats.clients.description}`
    updateContentById("about-stats-clients", clientsContent)
    
    const monthlyContent = `${editingStats.monthly.number}\n${editingStats.monthly.title}\n${editingStats.monthly.description}`
    updateContentById("about-stats-monthly", monthlyContent)
    
    // Atualizar estados
    setEditableTitle(editingTitle)
    setEditableDescription(editingDescription)
    setEditableMissionTitle(editingMissionTitle)
    setEditableMissionDescription(editingMissionDescription)
    setEditableStats(editingStats)
    
    // Disparar evento para garantir que outros componentes sejam atualizados
    window.dispatchEvent(new Event('editableContentsUpdated'));
    
    toast({
      title: "Conteúdo atualizado",
      description: "As informações da seção sobre foram atualizadas com sucesso."
    })
  }

  const handleCancelEdit = () => {
    setEditingTitle(editableTitle)
    setEditingDescription(editableDescription)
    setEditingMissionTitle(editableMissionTitle)
    setEditingMissionDescription(editableMissionDescription)
    setEditingStats({
      orders: editableStats.orders,
      clients: editableStats.clients,
      monthly: editableStats.monthly
    })
  }

  const openEditModal = (mode: 'about' | 'stats-orders' | 'stats-clients' | 'stats-monthly' | 'mission') => {
    setEditMode(mode)
    setIsEditModalOpen(true)
  }

  // Função para salvar estatísticas individuais
  const handleSaveStat = (statType: 'orders' | 'clients' | 'monthly') => {
    let content = "";
    let key = "";
    
    switch(statType) {
      case 'orders':
        content = `${editingStats.orders.number}\n${editingStats.orders.title}\n${editingStats.orders.description}`;
        key = "about-stats-orders";
        break;
      case 'clients':
        content = `${editingStats.clients.number}\n${editingStats.clients.title}\n${editingStats.clients.description}`;
        key = "about-stats-clients";
        break;
      case 'monthly':
        content = `${editingStats.monthly.number}\n${editingStats.monthly.title}\n${editingStats.monthly.description}`;
        key = "about-stats-monthly";
        break;
    }
    
    updateContentById(key, content);
    
    // Atualizar estado local imediatamente após salvar
    setEditableStats(prev => ({
      ...prev,
      [statType]: {...editingStats[statType]}
    }));
    
    // Disparar evento para garantir que outros componentes sejam atualizados
    window.dispatchEvent(new Event('editableContentsUpdated'));
    
    toast({
      title: "Estatística atualizada",
      description: "A estatística foi atualizada com sucesso."
    });
  }

  return (
    <section className="bg-black">
      {/* Seção Sobre */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            {globalEditMode ? (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Input
                    value={editingTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                    className="text-4xl md:text-5xl font-bold text-white text-center bg-gray-800 border-gray-600"
                  />
                  <Edit3 className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  {editableTitle}
                </h2>
                <div className="w-24 h-1 red-bg mx-auto"></div>
                {globalEditMode && (
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      onClick={() => {
                        setEditingTitle(editableTitle);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
                    >
                      <Edit3 className="h-5 w-5" />
                      Editar Seção
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="max-w-5xl mx-auto mb-20 relative">
            {globalEditMode ? (
              <div className="mb-6">
                <Textarea
                  value={editingDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingDescription(e.target.value)}
                  className="text-gray-200 text-lg md:text-xl leading-relaxed text-left bg-gray-800 border-gray-600"
                  rows={4}
                />
                <div className="flex justify-center gap-2 mt-2">
                  <Button onClick={handleSaveAboutInfo} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed text-left">
                  {editableDescription}
                </p>
                {globalEditMode && (
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      onClick={() => {
                        setEditingDescription(editableDescription);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
                    >
                      <Edit3 className="h-5 w-5" />
                      Editar Seção
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {/* Pedidos Enviados */}
            <div className="text-center relative">
              {globalEditMode ? (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <Input
                    value={editingStats.orders.number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        orders: {
                          ...prev.orders,
                          number: e.target.value
                        }
                      }))
                    }
                    className="text-4xl md:text-5xl font-bold red-text mb-2 text-center bg-gray-700 border-gray-600"
                  />
                  <Input
                    value={editingStats.orders.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        orders: {
                          ...prev.orders,
                          title: e.target.value
                        }
                      }))
                    }
                    className="text-white font-bold text-lg mb-2 text-center bg-gray-700 border-gray-600"
                  />
                  <Textarea
                    value={editingStats.orders.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        orders: {
                          ...prev.orders,
                          description: e.target.value
                        }
                      }))
                    }
                    className="text-gray-300 text-base text-center bg-gray-700 border-gray-600"
                    rows={2}
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    <Button 
                      onClick={() => handleSaveStat('orders')} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-6xl md:text-7xl font-bold red-text mb-4 tracking-tight">
                    {editableStats.orders.number}
                  </div>
                  <p className="text-white font-bold text-xl mb-2">{editableStats.orders.title}</p>
                  <p className="text-gray-300 text-base">{editableStats.orders.description}</p>
                </>
              )}
            </div>

            {/* Clientes Atendidos */}
            <div className="text-center relative">
              {globalEditMode ? (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <Input
                    value={editingStats.clients.number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        clients: {
                          ...prev.clients,
                          number: e.target.value
                        }
                      }))
                    }
                    className="text-4xl md:text-5xl font-bold red-text mb-2 text-center bg-gray-700 border-gray-600"
                  />
                  <Input
                    value={editingStats.clients.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        clients: {
                          ...prev.clients,
                          title: e.target.value
                        }
                      }))
                    }
                    className="text-white font-bold text-lg mb-2 text-center bg-gray-700 border-gray-600"
                  />
                  <Textarea
                    value={editingStats.clients.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        clients: {
                          ...prev.clients,
                          description: e.target.value
                        }
                      }))
                    }
                    className="text-gray-300 text-base text-center bg-gray-700 border-gray-600"
                    rows={2}
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    <Button 
                      onClick={() => handleSaveStat('clients')} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-6xl md:text-7xl font-bold red-text mb-4 tracking-tight">
                    {editableStats.clients.number}
                  </div>
                  <p className="text-white font-bold text-xl mb-2">{editableStats.clients.title}</p>
                  <p className="text-gray-300 text-base">{editableStats.clients.description}</p>
                </>
              )}
            </div>

            {/* Envios por Mês */}
            <div className="text-center relative">
              {globalEditMode ? (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <Input
                    value={editingStats.monthly.number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        monthly: {
                          ...prev.monthly,
                          number: e.target.value
                        }
                      }))
                    }
                    className="text-4xl md:text-5xl font-bold red-text mb-2 text-center bg-gray-700 border-gray-600"
                  />
                  <Input
                    value={editingStats.monthly.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        monthly: {
                          ...prev.monthly,
                          title: e.target.value
                        }
                      }))
                    }
                    className="text-white font-bold text-lg mb-2 text-center bg-gray-700 border-gray-600"
                  />
                  <Textarea
                    value={editingStats.monthly.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setEditingStats(prev => ({
                        ...prev,
                        monthly: {
                          ...prev.monthly,
                          description: e.target.value
                        }
                      }))
                    }
                    className="text-gray-300 text-base text-center bg-gray-700 border-gray-600"
                    rows={2}
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    <Button 
                      onClick={() => handleSaveStat('monthly')} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-6xl md:text-7xl font-bold red-text mb-4 tracking-tight">
                    {editableStats.monthly.number}
                  </div>
                  <p className="text-white font-bold text-xl mb-2">{editableStats.monthly.title}</p>
                  <p className="text-gray-300 text-base">{editableStats.monthly.description}</p>
                </>
              )}
            </div>
          </div>

          {/* Missão */}
          <div className="text-center relative">
            {globalEditMode ? (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Input
                    value={editingMissionTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingMissionTitle(e.target.value)}
                    className="text-3xl md:text-4xl font-bold text-white text-center bg-gray-800 border-gray-600"
                  />
                  <Edit3 className="h-5 w-5 text-gray-400" />
                </div>
                <Textarea
                  value={editingMissionDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingMissionDescription(e.target.value)}
                  className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto text-left bg-gray-800 border-gray-600"
                  rows={3}
                />
                <div className="flex justify-center gap-2 mt-2">
                  <Button onClick={handleSaveAboutInfo} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
                  {editableMissionTitle}
                </h3>
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto text-left">
                  {editableMissionDescription}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}