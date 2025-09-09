"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload, Plus, Trash2, Image as ImageIcon, Shirt, ArrowLeft } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import Link from "next/link"
import Image from "next/image"

interface Recommendation {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isActive: boolean
}

export default function RecomendacoesPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const { activeTheme } = useTheme()

  // Carregar recomendações do localStorage
  const loadRecommendations = () => {
    const savedRecommendations = localStorage.getItem("gang-boyz-recommendations")
    if (savedRecommendations) {
      const parsedRecommendations: Recommendation[] = JSON.parse(savedRecommendations)
      setRecommendations(parsedRecommendations)
    }
  }

  // Salvar recomendações no localStorage
  const saveRecommendations = () => {
    setSaving(true)
    localStorage.setItem("gang-boyz-recommendations", JSON.stringify(recommendations))
    
    // Disparar evento customizado para atualizar a homepage
    window.dispatchEvent(new CustomEvent('recommendationsUpdated'))
    
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }

  // Resetar recomendações
  const resetRecommendations = () => {
    setRecommendations([])
    localStorage.removeItem("gang-boyz-recommendations")
    window.dispatchEvent(new CustomEvent('recommendationsUpdated'))
  }

  // Carregar recomendações padrão
  const loadDefaultRecommendations = () => {
    const defaultRecommendations: Recommendation[] = [
      {
        id: "rec-001",
        name: "Camiseta Oversized",
        description: "Camiseta oversized com design urbano",
        price: 89.90,
        originalPrice: 129.90,
        image: "/black-t-shirt-with-neon-graphic-design.jpg",
        category: "Camisetas",
        isActive: true
      },
      {
        id: "rec-002", 
        name: "Moletom Premium",
        description: "Moletom com capuz e bolsos laterais",
        price: 199.90,
        originalPrice: 249.90,
        image: "/black-streetwear-hoodie-with-white-logo.jpg",
        category: "Moletons",
        isActive: true
      },
      {
        id: "rec-003",
        name: "Jaqueta Streetwear",
        description: "Jaqueta oversized com design exclusivo",
        price: 299.90,
        originalPrice: 399.90,
        image: "/black-oversized-streetwear-jacket.jpg",
        category: "Jaquetas",
        isActive: true
      },
      {
        id: "rec-004",
        name: "Calça Cargo",
        description: "Calça cargo com múltiplos bolsos",
        price: 159.90,
        originalPrice: 199.90,
        image: "/black-cargo-streetwear.png",
        category: "Calças",
        isActive: true
      }
    ]
    setRecommendations(defaultRecommendations)
  }

  // Upload de imagem
  const handleImageUpload = (productId: string, file: File) => {
    setUploadingImage(productId)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === productId 
            ? { ...rec, image: result }
            : rec
        )
      )
      setUploadingImage(null)
    }
    reader.readAsDataURL(file)
  }

  // Adicionar nova recomendação
  const addRecommendation = () => {
    const newRecommendation: Recommendation = {
      id: `rec-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "",
      category: "Camisetas",
      isActive: true
    }
    setRecommendations(prev => [...prev, newRecommendation])
  }

  // Remover recomendação
  const removeRecommendation = (id: string) => {
    if (recommendations.length > 1) {
      setRecommendations(prev => prev.filter(rec => rec.id !== id))
    }
  }

  // Atualizar recomendação
  const updateRecommendation = (id: string, field: keyof Recommendation, value: any) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, [field]: value }
          : rec
      )
    )
  }

  // Imagens disponíveis na pasta public
  const availableImages = [
    "/black-t-shirt-with-neon-graphic-design.jpg",
    "/black-streetwear-hoodie-with-white-logo.jpg", 
    "/black-oversized-streetwear-jacket.jpg",
    "/black-cargo-streetwear.png",
    "/black-snapback-cap-with-white-embroidery.jpg",
    "/silver-chain-necklace-streetwear-accessory.jpg",
    "/urban-streetwear-model-in-black-hoodie-against-dar.jpg"
  ]

  useEffect(() => {
    loadRecommendations()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Admin
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Image 
                  src="/logo-gang-boyz-new.svg" 
                  alt="Gang BoyZ" 
                  width={80} 
                  height={32} 
                  className="h-8 w-auto filter brightness-110"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Recomendações de Roupas
                </h1>
                <p className="text-gray-400 text-sm md:text-lg">Gerencie as recomendações de roupas que aparecem na homepage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
          <Button 
            onClick={saveRecommendations}
            disabled={saving}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold"
          >
            {saving ? "Salvando..." : "Salvar Recomendações"}
          </Button>
        
          {recommendations.length < 20 && (
            <Button 
              onClick={addRecommendation}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Recomendação ({recommendations.length}/20)
            </Button>
          )}

          {recommendations.length === 0 && (
            <Button 
              onClick={loadDefaultRecommendations}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Shirt className="w-4 h-4 mr-2" />
              Criar Recomendações Padrão
            </Button>
          )}

          <Button 
            onClick={resetRecommendations}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-900"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
        </div>

        {/* Lista de Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={recommendation.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 bg-gradient-to-r from-red-600 to-red-500">
                      {index + 1}
                    </div>
                    Recomendação #{index + 1}
                  </CardTitle>
                  {recommendations.length > 1 && (
                    <Button
                      onClick={() => removeRecommendation(recommendation.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Imagem */}
                <div className="space-y-3">
                  <Label className="text-gray-300 font-semibold">Imagem do Produto</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600">
                      {recommendation.image ? (
                        <img 
                          src={recommendation.image} 
                          alt={recommendation.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(recommendation.id, file)
                          }}
                          className="hidden"
                          id={`upload-${recommendation.id}`}
                        />
                        <Button
                          onClick={() => document.getElementById(`upload-${recommendation.id}`)?.click()}
                          variant="outline"
                          size="sm"
                          disabled={uploadingImage === recommendation.id}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingImage === recommendation.id ? "Enviando..." : "Escolher Imagem"}
                        </Button>
                      </div>
                      <Input
                        placeholder="Ou cole a URL da imagem"
                        value={recommendation.image}
                        onChange={(e) => updateRecommendation(recommendation.id, 'image', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Nome */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-semibold">Nome do Produto</Label>
                  <Input
                    value={recommendation.name}
                    onChange={(e) => updateRecommendation(recommendation.id, 'name', e.target.value)}
                    placeholder="Ex: Camiseta Oversized"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-semibold">Descrição</Label>
                  <Textarea
                    value={recommendation.description}
                    onChange={(e) => updateRecommendation(recommendation.id, 'description', e.target.value)}
                    placeholder="Descrição do produto"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    rows={3}
                  />
                </div>

                {/* Preços */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-semibold">Preço Atual</Label>
                    <Input
                      type="number"
                      value={recommendation.price}
                      onChange={(e) => updateRecommendation(recommendation.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="89.90"
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-semibold">Preço Original (opcional)</Label>
                    <Input
                      type="number"
                      value={recommendation.originalPrice || ''}
                      onChange={(e) => updateRecommendation(recommendation.id, 'originalPrice', parseFloat(e.target.value) || undefined)}
                      placeholder="129.90"
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-semibold">Categoria</Label>
                  <Select
                    value={recommendation.category}
                    onValueChange={(value) => updateRecommendation(recommendation.id, 'category', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Camisetas">Camisetas</SelectItem>
                      <SelectItem value="Moletons">Moletons</SelectItem>
                      <SelectItem value="Jaquetas">Jaquetas</SelectItem>
                      <SelectItem value="Calças">Calças</SelectItem>
                      <SelectItem value="Acessórios">Acessórios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ativo */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={recommendation.isActive}
                    onCheckedChange={(checked) => updateRecommendation(recommendation.id, 'isActive', checked)}
                  />
                  <Label className="text-gray-300 font-semibold">Produto Ativo</Label>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Imagens Disponíveis */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">Imagens Disponíveis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      onClick={() => {
                        const productId = prompt("Digite o ID da recomendação (ex: rec-001):")
                        if (productId) {
                          updateRecommendation(productId, 'image', image)
                        }
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      Usar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações */}
        <Card className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                As recomendações aparecem na homepage acima da seção "Coleção"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                No mobile: carrossel infinito com scroll horizontal
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                No desktop: botões de navegação nas laterais
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Máximo de 20 recomendações
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Apenas produtos ativos são exibidos
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
