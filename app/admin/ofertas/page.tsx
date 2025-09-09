"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  isNew: boolean
  isPromotion: boolean
  installments: string
  brand: string
}

interface Category {
  id: string
  name: string
  icon?: string
  products: Product[]
}

export default function OfertasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categoryIconFile, setCategoryIconFile] = useState<File | null>(null)
  const [categoryIconPreview, setCategoryIconPreview] = useState<string>("")
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    image: "",
    isNew: false,
    isPromotion: false,
    installments: "",
    brand: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [standaloneProducts, setStandaloneProducts] = useState<Product[]>([])

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
    
    const savedStandaloneProducts = localStorage.getItem("gang-boyz-standalone-products")
    if (savedStandaloneProducts) {
      setStandaloneProducts(JSON.parse(savedStandaloneProducts))
    }
  }, [])

  // Salvar dados no localStorage
  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories)
    localStorage.setItem("gang-boyz-categories", JSON.stringify(newCategories))
  }

  const saveStandaloneProducts = (newProducts: Product[]) => {
    setStandaloneProducts(newProducts)
    localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(newProducts))
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

  // Lidar com seleção de arquivo
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      try {
        const base64 = await convertToBase64(file)
        setImagePreview(base64)
        setNewProduct({...newProduct, image: base64})
      } catch (error) {
        console.error('Erro ao converter arquivo:', error)
      }
    }
  }

  // Lidar com seleção de ícone da categoria
  const handleCategoryIconSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCategoryIconFile(file)
      try {
        const base64 = await convertToBase64(file)
        setCategoryIconPreview(base64)
      } catch (error) {
        console.error('Erro ao converter ícone:', error)
      }
    }
  }

  // Criar nova categoria
  const createCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      icon: categoryIconPreview || undefined,
      products: []
    }

    saveCategories([...categories, newCategory])
    setNewCategoryName("")
    setCategoryIconFile(null)
    setCategoryIconPreview("")
  }

  // Deletar categoria
  const deleteCategory = (id: string) => {
    saveCategories(categories.filter(cat => cat.id !== id))
  }

  // Adicionar produto a uma categoria
  const addProduct = (categoryId: string) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Nome, preço e imagem são obrigatórios!")
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || newProduct.price,
      image: newProduct.image,
      isNew: newProduct.isNew || false,
      isPromotion: newProduct.isPromotion || false,
      installments: newProduct.installments || "",
      brand: newProduct.brand || ""
    }

    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, products: [...cat.products, product] }
        : cat
    )

    saveCategories(updatedCategories)
    setNewProduct({
      name: "",
      price: 0,
      originalPrice: 0,
      image: "",
      isNew: false,
      isPromotion: false,
      installments: "",
      brand: ""
    })
    setSelectedFile(null)
    setImagePreview("")
  }

  // Deletar produto
  const deleteProduct = (categoryId: string, productId: string) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, products: cat.products.filter(p => p.id !== productId) }
        : cat
    )

    saveCategories(updatedCategories)
  }

  // Adicionar produto avulso (Ofertas)
  const addStandaloneProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Nome, preço e imagem são obrigatórios!")
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || newProduct.price,
      image: newProduct.image,
      isNew: newProduct.isNew || false,
      isPromotion: newProduct.isPromotion || false,
      installments: newProduct.installments || "",
      brand: newProduct.brand || ""
    }

    const updatedProducts = [...standaloneProducts, product]
    saveStandaloneProducts(updatedProducts)
    
    // Limpar campos
    setNewProduct({
      name: "",
      price: 0,
      originalPrice: 0,
      image: "",
      isNew: false,
      isPromotion: false,
      installments: "",
      brand: ""
    })
    setSelectedFile(null)
    setImagePreview("")
  }

  // Deletar produto avulso
  const deleteStandaloneProduct = (productId: string) => {
    const updatedProducts = standaloneProducts.filter(p => p.id !== productId)
    saveStandaloneProducts(updatedProducts)
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Ofertas Especiais</h1>
            <p className="text-gray-600">Produtos que aparecem na seção "OFERTAS ESPECIAIS" da tela inicial</p>
          </div>
        </div>

        {/* Criar Nova Categoria */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Criar Nova Categoria</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="categoryName">Nome da Categoria</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Jaquetas, Camisetas..."
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createCategory} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Categoria
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="categoryIcon">Ícone da Categoria (Opcional)</Label>
            <Input
              id="categoryIcon"
              type="file"
              accept="image/*"
              onChange={handleCategoryIconSelect}
              className="mt-1"
            />
            {categoryIconPreview && (
              <div className="mt-2">
                <img
                  src={categoryIconPreview}
                  alt="Preview do ícone"
                  className="w-12 h-12 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Adicionar Produto em Ofertas */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Adicionar Produto em Ofertas</h2>
          <p className="text-gray-600 mb-4">Adicione produtos que aparecerão diretamente na seção "OFERTAS ESPECIAIS" da tela inicial, integrados com os produtos existentes.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="standaloneProductName">Nome do Produto</Label>
              <Input
                id="standaloneProductName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Nome do produto"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="standaloneProductPrice">Preço Atual</Label>
              <Input
                id="standaloneProductPrice"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="standaloneProductOriginalPrice">Preço Antigo (Opcional)</Label>
              <Input
                id="standaloneProductOriginalPrice"
                type="number"
                value={newProduct.originalPrice || ""}
                onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="standaloneProductBrand">Marca (Opcional)</Label>
              <Input
                id="standaloneProductBrand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                placeholder="Marca do produto"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="standaloneProductInstallments">Parcelamento (Opcional)</Label>
              <Input
                id="standaloneProductInstallments"
                value={newProduct.installments}
                onChange={(e) => setNewProduct({...newProduct, installments: e.target.value})}
                placeholder="Ex: 3x de R$ 100,00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="standaloneProductImage">Foto do Produto</Label>
              <Input
                id="standaloneProductImage"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>Formato ideal:</strong> JPG ou PNG, proporção quadrada (1:1), tamanho máximo 2MB. 
                Imagens quadradas garantem melhor visualização nos cards.
              </p>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="standaloneIsNew"
                checked={newProduct.isNew}
                onChange={(e) => setNewProduct({...newProduct, isNew: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="standaloneIsNew">Novo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="standaloneIsPromotion"
                checked={newProduct.isPromotion}
                onChange={(e) => setNewProduct({...newProduct, isPromotion: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="standaloneIsPromotion">Promoção</Label>
            </div>
          </div>

          <Button onClick={addStandaloneProduct} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar às Ofertas
          </Button>
        </Card>

        {/* Lista de Produtos em Ofertas */}
        {standaloneProducts.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Produtos na Seção "OFERTAS ESPECIAIS" ({standaloneProducts.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {standaloneProducts.map((product) => (
                <div key={product.id} className="relative bg-white border rounded-lg p-4 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">R$ {product.price.toFixed(2)}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-gray-400 text-xs line-through">R$ {product.originalPrice.toFixed(2)}</p>
                  )}
                  <div className="flex gap-1 mt-2">
                    {product.isNew && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Novo</span>}
                    {product.isPromotion && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Promoção</span>}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteStandaloneProduct(product.id)}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Lista de Categorias */}
        {categories.map((category) => (
          <Card key={category.id} className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteCategory(category.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar Categoria
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor={`productName-${category.id}`}>Nome do Produto</Label>
                <Input
                  id={`productName-${category.id}`}
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Nome do produto"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`productPrice-${category.id}`}>Preço Atual</Label>
                <Input
                  id={`productPrice-${category.id}`}
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`productOriginalPrice-${category.id}`}>Preço Antigo (Opcional)</Label>
                <Input
                  id={`productOriginalPrice-${category.id}`}
                  type="number"
                  value={newProduct.originalPrice || ""}
                  onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`productBrand-${category.id}`}>Marca (Opcional)</Label>
                <Input
                  id={`productBrand-${category.id}`}
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  placeholder="Marca do produto"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`productInstallments-${category.id}`}>Parcelamento (Opcional)</Label>
                <Input
                  id={`productInstallments-${category.id}`}
                  value={newProduct.installments}
                  onChange={(e) => setNewProduct({...newProduct, installments: e.target.value})}
                  placeholder="Ex: 3x de R$ 100,00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`productImage-${category.id}`}>Foto do Produto</Label>
                <Input
                  id={`productImage-${category.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`isNew-${category.id}`}
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct({...newProduct, isNew: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor={`isNew-${category.id}`}>Novo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`isPromotion-${category.id}`}
                  checked={newProduct.isPromotion}
                  onChange={(e) => setNewProduct({...newProduct, isPromotion: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor={`isPromotion-${category.id}`}>Promoção</Label>
              </div>
            </div>

            <Button onClick={() => addProduct(category.id)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>

            {category.products.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-3">Produtos em {category.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.products.map((product) => (
                    <div key={product.id} className="relative bg-white border rounded-lg p-4 shadow-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">R$ {product.price.toFixed(2)}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-gray-400 text-xs line-through">R$ {product.originalPrice.toFixed(2)}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        {product.isNew && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Novo</span>}
                        {product.isPromotion && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Promoção</span>}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProduct(category.id, product.id)}
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

