"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Edit, Save, X } from "lucide-react"
import Link from "next/link"

interface Collection {
  id: string
  brand: string
  name: string
  subtitle: string
  description: string
  icon: string
  link?: string
  image: string
  mediaType?: 'image' | 'video' | 'gif'
  color: string
}

export default function ColecoesPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [editingCollection, setEditingCollection] = useState<string | null>(null)
  const [newCollection, setNewCollection] = useState<Partial<Collection>>({
    brand: "",
    name: "",
    subtitle: "",
    description: "",
    icon: "",
    link: "",
    image: "",
    mediaType: "image",
    color: "from-red-600/90 to-black/70"
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>("")

  // Carregar coleções do localStorage
  useEffect(() => {
    const savedCollections = localStorage.getItem("gang-boyz-collections")
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections))
    } else {
      // Coleções padrão de demonstração
      const defaultCollections: Collection[] = [
        {
          id: "1",
          brand: "GANG BOYZ",
          name: "NOVA COLEÇÃO",
          subtitle: "Streetwear Premium",
          description: "Descubra os lançamentos mais ousados da temporada",
          icon: "",
          link: "",
          image: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
          mediaType: "image",
          color: "from-red-600/90 to-black/70"
        },
        {
          id: "2",
          brand: "SHADOW",
          name: "MOLETONS",
          subtitle: "Conforto Urbano",
          description: "Qualidade premium para o dia a dia",
          icon: "",
          link: "",
          image: "/black-streetwear-hoodie-with-white-logo.jpg",
          mediaType: "image",
          color: "from-gray-800/90 to-black/70"
        },
        {
          id: "3",
          brand: "CHAIN",
          name: "ACESSÓRIOS",
          subtitle: "Detalhes Únicos",
          description: "Complete seu look com nossos acessórios exclusivos",
          icon: "",
          link: "",
          image: "/silver-chain-necklace-streetwear-accessory.jpg",
          mediaType: "image",
          color: "from-red-600/90 to-black/70"
        },
        {
          id: "4",
          brand: "SALE",
          name: "PROMOÇÕES",
          subtitle: "Ofertas Limitadas",
          description: "Até 50% de desconto em peças selecionadas",
          icon: "",
          link: "",
          image: "/black-oversized-streetwear-jacket.jpg",
          mediaType: "image",
          color: "from-red-500/90 to-black/70"
        }
      ]
      setCollections(defaultCollections)
      localStorage.setItem("gang-boyz-collections", JSON.stringify(defaultCollections))
    }
  }, [])

  // Salvar coleções no localStorage
  const saveCollections = (newCollections: Collection[]) => {
    setCollections(newCollections)
    localStorage.setItem("gang-boyz-collections", JSON.stringify(newCollections))
    // Disparar evento para atualizar outras abas
    window.dispatchEvent(new CustomEvent('collectionsUpdated'))
  }

  // Converter arquivo para base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Lidar com seleção de arquivo de imagem
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      try {
        const base64 = await convertToBase64(file)
        setImagePreview(base64)
        setNewCollection({...newCollection, image: base64})
      } catch (error) {
        console.error('Erro ao converter arquivo:', error)
      }
    }
  }

  // Lidar com seleção de arquivo de ícone
  const handleIconSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIconFile(file)
      try {
        const base64 = await convertToBase64(file)
        setIconPreview(base64)
        setNewCollection({...newCollection, icon: base64})
      } catch (error) {
        console.error('Erro ao converter ícone:', error)
      }
    }
  }

  // Adicionar nova coleção
  const addCollection = () => {
    if (!newCollection.brand || !newCollection.name || !newCollection.image) {
      alert("Marca, nome da coleção e imagem são obrigatórios!")
      return
    }

    const collection: Collection = {
      id: Date.now().toString(),
      brand: newCollection.brand,
      name: newCollection.name,
      subtitle: newCollection.subtitle || "",
      description: newCollection.description || "",
      icon: newCollection.icon || "",
      link: newCollection.link || "",
      image: newCollection.image,
      color: newCollection.color || "from-red-600/90 to-black/70"
    }

    saveCollections([...collections, collection])
    
    // Limpar campos
    setNewCollection({
      brand: "",
      name: "",
      subtitle: "",
      description: "",
      icon: "",
      link: "",
      image: "",
      color: "from-red-600/90 to-black/70"
    })
    setSelectedFile(null)
    setImagePreview("")
    setIconFile(null)
    setIconPreview("")
  }

  // Editar coleção
  const editCollection = (collection: Collection) => {
    setEditingCollection(collection.id)
    setNewCollection(collection)
    setImagePreview(collection.image)
    setIconPreview(collection.icon)
  }

  // Salvar edição
  const saveEdit = () => {
    if (!newCollection.brand || !newCollection.name || !newCollection.image) {
      alert("Marca, nome da coleção e imagem são obrigatórios!")
      return
    }

    const updatedCollections = collections.map(collection =>
      collection.id === editingCollection
        ? {
            ...collection,
            brand: newCollection.brand,
            name: newCollection.name,
            subtitle: newCollection.subtitle || "",
            description: newCollection.description || "",
            icon: newCollection.icon || "",
            link: newCollection.link || "",
            image: newCollection.image,
            color: newCollection.color || "from-red-600/90 to-black/70"
          }
        : collection
    )

    saveCollections(updatedCollections)
    setEditingCollection(null)
    
    // Limpar campos
    setNewCollection({
      brand: "",
      name: "",
      subtitle: "",
      description: "",
      icon: "",
      link: "",
      image: "",
      color: "from-red-600/90 to-black/70"
    })
    setSelectedFile(null)
    setImagePreview("")
    setIconFile(null)
    setIconPreview("")
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingCollection(null)
    setNewCollection({
      brand: "",
      name: "",
      subtitle: "",
      description: "",
      icon: "",
      link: "",
      image: "",
      color: "from-red-600/90 to-black/70"
    })
    setSelectedFile(null)
    setImagePreview("")
    setIconFile(null)
    setIconPreview("")
  }

  // Deletar coleção
  const deleteCollection = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta coleção?")) {
      const updatedCollections = collections.filter(collection => collection.id !== id)
      saveCollections(updatedCollections)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Coleções</h1>
            <p className="text-gray-600">Crie e edite as coleções exibidas na tela inicial</p>
          </div>
        </div>

        {/* Formulário de Nova Coleção */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingCollection ? 'Editar Coleção' : 'Adicionar Nova Coleção'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={newCollection.brand}
                onChange={(e) => setNewCollection({...newCollection, brand: e.target.value})}
                placeholder="Ex: Gang Boyz"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="name">Nome da Coleção *</Label>
              <Input
                id="name"
                value={newCollection.name}
                onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                placeholder="Ex: Moletons"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={newCollection.subtitle}
                onChange={(e) => setNewCollection({...newCollection, subtitle: e.target.value})}
                placeholder="Ex: Shadow"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (máx. 30 caracteres)</Label>
              <Input
                id="description"
                value={newCollection.description}
                onChange={(e) => setNewCollection({...newCollection, description: e.target.value.slice(0, 30)})}
                placeholder="Breve descrição"
                className="mt-1"
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newCollection.description?.length || 0}/30 caracteres
              </p>
            </div>
            <div>
              <Label htmlFor="link">Link Opcional</Label>
              <Input
                id="link"
                value={newCollection.link}
                onChange={(e) => setNewCollection({...newCollection, link: e.target.value})}
                placeholder="Ex: /acessorios"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="color">Cor do Gradiente</Label>
              <select
                id="color"
                value={newCollection.color}
                onChange={(e) => setNewCollection({...newCollection, color: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="from-red-600/90 to-black/70">Vermelho</option>
                <option value="from-gray-800/90 to-black/70">Cinza</option>
                <option value="from-red-500/90 to-black/70">Vermelho Claro</option>
                <option value="from-blue-600/90 to-black/70">Azul</option>
                <option value="from-green-600/90 to-black/70">Verde</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="image">Imagem Principal *</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>Formato ideal:</strong> JPG ou PNG, proporção 4:3, resolução mínima 800x600px, tamanho máximo 5MB.
              </p>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="icon">Ícone (PNG)</Label>
              <Input
                id="icon"
                type="file"
                accept="image/png"
                onChange={handleIconSelect}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>Formato:</strong> PNG com transparência, tamanho ideal 64x64px.
              </p>
              {iconPreview && (
                <div className="mt-2">
                  <img
                    src={iconPreview}
                    alt="Preview do ícone"
                    className="w-16 h-16 object-contain rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {editingCollection ? (
              <>
                <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={addCollection} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Coleção
              </Button>
            )}
          </div>
        </Card>

        {/* Lista de Coleções */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="p-4">
              <div className="relative">
                {/* Preview da Coleção */}
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.color}`} />
                  <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-white/80 uppercase">
                        {collection.brand}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-white/90 font-medium mb-2">
                        {collection.subtitle}
                      </p>
                      <p className="text-xs text-white/80">
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Marca:</span>
                    <span>{collection.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Nome:</span>
                    <span>{collection.name}</span>
                  </div>
                  {collection.link && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Link:</span>
                      <span className="text-red-600">{collection.link}</span>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editCollection(collection)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCollection(collection.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8">
          <Card className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre as Coleções</h3>
            <p className="text-gray-600 mb-4">
              As coleções são exibidas na tela inicial em formato de grid responsivo. 
              Cada coleção pode ter um link opcional para direcionar os usuários a páginas específicas.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Dicas de Formato:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• <strong>Imagem:</strong> Use imagens de alta qualidade e boa iluminação</li>
                <li>• <strong>Ícone:</strong> PNG com transparência funciona melhor</li>
                <li>• <strong>Descrição:</strong> Seja conciso e impactante</li>
                <li>• <strong>Link:</strong> Use caminhos relativos (ex: /acessorios)</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

