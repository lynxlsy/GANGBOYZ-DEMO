"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, RefreshCw, Flame, Upload, Eye, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useTheme } from "@/lib/theme-context"

interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export default function HotPage() {
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const [saving, setSaving] = useState(false)
  const { activeTheme } = useTheme()
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  // Carregar produtos HOT do localStorage
  useEffect(() => {
    loadHotProducts()
  }, [])

  const loadHotProducts = () => {
    const savedProducts = localStorage.getItem("gang-boyz-hot-products")
    if (savedProducts) {
      setHotProducts(JSON.parse(savedProducts))
    } else {
      // Não criar produtos padrão automaticamente
      setHotProducts([])
    }
  }

  const updateProduct = (id: string, field: keyof HotProduct, value: string | number | boolean) => {
    setHotProducts(prev => prev.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const saveHotProducts = async () => {
    setSaving(true)
    try {
      localStorage.setItem("gang-boyz-hot-products", JSON.stringify(hotProducts))
      
      // Disparar evento para atualizar a seção HOT
      window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
      
      toast.success("Produtos HOT salvos com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar produtos HOT")
    } finally {
      setSaving(false)
    }
  }

  const resetHotProducts = () => {
    const defaultProducts: HotProduct[] = [
      {
        id: "HOT001",
        name: "Jaqueta Oversized Premium",
        description: "Jaqueta streetwear com design exclusivo",
        price: 299.90,
        originalPrice: 399.90,
        image: "/black-oversized-streetwear-jacket.jpg",
        category: "Jaquetas",
        isActive: true
      },
      {
        id: "HOT002", 
        name: "Moletom Hoodie Gang",
        description: "Moletom com logo bordado",
        price: 199.90,
        originalPrice: 249.90,
        image: "/black-streetwear-hoodie-with-white-logo.jpg",
        category: "Moletons",
        isActive: true
      },
      {
        id: "HOT003",
        name: "Camiseta Graphic Design",
        description: "Camiseta com estampa neon",
        price: 89.90,
        originalPrice: 129.90,
        image: "/black-t-shirt-with-neon-graphic-design.jpg",
        category: "Camisetas",
        isActive: true
      },
      {
        id: "HOT004",
        name: "Calça Cargo Street",
        description: "Calça cargo com bolsos laterais",
        price: 179.90,
        originalPrice: 229.90,
        image: "/black-cargo-streetwear.png",
        category: "Calças",
        isActive: true
      }
    ]
    setHotProducts(defaultProducts)
    toast.success("Produtos HOT resetados para o padrão!")
  }

  const handleImageUpload = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(productId)
    
    // Simular upload (em produção, você faria upload real)
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      updateProduct(productId, 'image', imageUrl)
      setUploadingImage(null)
      toast.success("Imagem carregada com sucesso!")
    }
    reader.readAsDataURL(file)
  }

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
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                  <Flame className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                  Produtos HOT
                </h1>
                <p className="text-gray-400 text-sm md:text-lg">Gerencie as 4 peças mais em alta</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={resetHotProducts}
              disabled={saving}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button 
              onClick={saveHotProducts}
              disabled={saving}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold text-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {/* Add Product Buttons */}
        <div className="mb-6 flex gap-4">
          {hotProducts.length < 12 && (
            <Button
              onClick={() => {
                const newProduct: HotProduct = {
                  id: `HOT${String(hotProducts.length + 1).padStart(3, '0')}`,
                  name: "Novo Produto HOT",
                  description: "Descrição do produto",
                  price: 99.90,
                  originalPrice: 149.90,
                  image: "/placeholder.jpg",
                  category: "Categoria",
                  isActive: true
                }
                setHotProducts(prev => [...prev, newProduct])
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Flame className="h-4 w-4 mr-2" />
              Adicionar Produto HOT ({hotProducts.length}/12)
            </Button>
          )}
          
          {hotProducts.length === 0 && (
            <Button
              onClick={() => {
                const defaultProducts: HotProduct[] = [
                  {
                    id: "HOT001",
                    name: "Jaqueta Oversized Premium",
                    description: "Jaqueta streetwear com design exclusivo",
                    price: 299.90,
                    originalPrice: 399.90,
                    image: "/black-oversized-streetwear-jacket.jpg",
                    category: "Jaquetas",
                    isActive: true
                  },
                  {
                    id: "HOT002", 
                    name: "Moletom Hoodie Gang",
                    description: "Moletom com logo bordado",
                    price: 199.90,
                    originalPrice: 249.90,
                    image: "/black-streetwear-hoodie-with-white-logo.jpg",
                    category: "Moletons",
                    isActive: true
                  },
                  {
                    id: "HOT003",
                    name: "Camiseta Graphic Design",
                    description: "Camiseta com estampa neon",
                    price: 89.90,
                    originalPrice: 129.90,
                    image: "/black-t-shirt-with-neon-graphic-design.jpg",
                    category: "Camisetas",
                    isActive: true
                  },
                  {
                    id: "HOT004",
                    name: "Calça Cargo Street",
                    description: "Calça cargo com bolsos laterais",
                    price: 179.90,
                    originalPrice: 229.90,
                    image: "/black-cargo-streetwear.png",
                    category: "Calças",
                    isActive: true
                  }
                ]
                setHotProducts(defaultProducts)
                localStorage.setItem("gang-boyz-hot-products", JSON.stringify(defaultProducts))
                toast.success("Produtos HOT padrão criados!")
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Flame className="h-4 w-4 mr-2" />
              Criar Produtos HOT Padrão
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotProducts.map((product, index) => (
            <Card key={product.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `var(--primary-color)` }}
                >
                  <span className="text-white font-bold text-lg">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Produto HOT {index + 1}</h3>
                  <p className="text-gray-600">ID: {product.id}</p>
                </div>
                {hotProducts.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setHotProducts(prev => prev.filter(p => p.id !== product.id))
                    }}
                  >
                    Remover
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`name-${product.id}`}>Nome do Produto</Label>
                  <Input
                    id={`name-${product.id}`}
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`description-${product.id}`}>Descrição</Label>
                  <Input
                    id={`description-${product.id}`}
                    value={product.description}
                    onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`price-${product.id}`}>Preço</Label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`originalPrice-${product.id}`}>Preço Original</Label>
                    <Input
                      id={`originalPrice-${product.id}`}
                      type="number"
                      step="0.01"
                      value={product.originalPrice}
                      onChange={(e) => updateProduct(product.id, 'originalPrice', parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`category-${product.id}`}>Categoria</Label>
                  <Input
                    id={`category-${product.id}`}
                    value={product.category}
                    onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`image-${product.id}`}>Imagem do Produto</Label>
                  
                  {/* Preview da imagem */}
                  <div className="mt-2 mb-3">
                    <div className="w-24 h-24 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload de arquivo */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(product.id, e)}
                      className="hidden"
                      id={`file-upload-${product.id}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-upload-${product.id}`)?.click()}
                      disabled={uploadingImage === product.id}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage === product.id ? "Carregando..." : "Escolher Imagem"}
                    </Button>
                  </div>

                  {/* Campo de URL manual */}
                  <div className="mt-2">
                    <Label htmlFor={`image-url-${product.id}`} className="text-sm text-gray-600">
                      Ou cole a URL da imagem:
                    </Label>
                    <Input
                      id={`image-url-${product.id}`}
                      value={product.image}
                      onChange={(e) => updateProduct(product.id, 'image', e.target.value)}
                      placeholder="/caminho/para/imagem.jpg ou URL completa"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`active-${product.id}`}>Status</Label>
                  <select
                    id={`active-${product.id}`}
                    value={product.isActive ? 'active' : 'inactive'}
                    onChange={(e) => updateProduct(product.id, 'isActive', e.target.value === 'active')}
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
        <div className="mt-8 space-y-4">
          <Card 
            className="p-6"
            style={{ backgroundColor: `var(--primary-color)` }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Informações</h3>
            <p className="text-white/90 mb-2">
              Os produtos configurados aqui aparecerão na seção HOT da homepage. 
              Cada produto tem um ID único que será exibido abaixo da imagem na seção "Em Breve".
            </p>
            <p className="text-white/90">
              <strong>Limite:</strong> Máximo de 12 produtos HOT. 
              No mobile aparecem 2 por linha, no desktop até 4 por linha.
            </p>
          </Card>

          {/* Imagens Disponíveis */}
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Imagens Disponíveis na Pasta Public</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "/black-oversized-streetwear-jacket.jpg",
                "/black-streetwear-hoodie-with-white-logo.jpg", 
                "/black-t-shirt-with-neon-graphic-design.jpg",
                "/black-cargo-streetwear.png",
                "/black-snapback-cap-with-white-embroidery.jpg",
                "/silver-chain-necklace-streetwear-accessory.jpg",
                "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
                "/placeholder.jpg"
              ].map((imagePath) => (
                <div key={imagePath} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 border border-gray-300 rounded overflow-hidden bg-gray-100">
                    <img
                      src={imagePath}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling!.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 break-all">{imagePath}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 text-xs"
                    onClick={() => {
                      const productId = prompt("Digite o ID do produto (HOT001, HOT002, HOT003 ou HOT004):")
                      if (productId && ['HOT001', 'HOT002', 'HOT003', 'HOT004'].includes(productId)) {
                        updateProduct(productId, 'image', imagePath)
                        toast.success(`Imagem aplicada ao ${productId}!`)
                      }
                    }}
                  >
                    Usar
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-blue-800 text-sm mt-4">
              💡 Clique em "Usar" para aplicar a imagem diretamente ao produto correspondente.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
