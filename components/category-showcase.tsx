"use client"

import Link from "next/link"
import { Shirt, ShoppingCart, User, Plus, Edit3, Save, X, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { useEditMode } from "@/lib/edit-mode-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  image: string
  href: string
  description: string
}

const defaultCategories: Category[] = [
  {
    id: "camisetas",
    name: "Camisetas",
    image: "/placeholder-camiseta.jpg",
    href: "/camisetas",
    description: ""
  },
  {
    id: "moletons",
    name: "Moletons",
    image: "/placeholder-camiseta.jpg",
    href: "/moletons",
    description: ""
  },
  {
    id: "jaquetas",
    name: "Jaquetas",
    image: "/placeholder-camiseta.jpg",
    href: "/jaquetas",
    description: ""
  },
  {
    id: "calcas",
    name: "Calças",
    image: "/placeholder-camiseta.jpg",
    href: "/calcas",
    description: ""
  },
  {
    id: "shorts",
    name: "Shorts",
    image: "/placeholder-camiseta.jpg",
    href: "/shorts-bermudas",
    description: ""
  },
  {
    id: "em-alta",
    name: "Em Alta",
    image: "/placeholder-camiseta.jpg",
    href: "/em-alta",
    description: "Produtos em Alta"
  }
]

export function CategoryShowcase({ isEditMode = false }: { isEditMode?: boolean }) {
  // Use the prop if provided, otherwise fallback to the context
  const { isEditMode: contextEditMode } = useEditMode()
  const effectiveIsEditMode = isEditMode || contextEditMode
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [editingCategories, setEditingCategories] = useState<Category[]>(defaultCategories)
  const [isEditing, setIsEditing] = useState(false)
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    image: "/placeholder-camiseta.jpg",
    href: "",
    description: ""
  })
  const [showAddForm, setShowAddForm] = useState(false)

  // Carregar categorias do localStorage
  useEffect(() => {
    const loadCategories = () => {
      if (typeof window !== 'undefined') {
        const savedCategories = localStorage.getItem("gang-boyz-categories")
        if (savedCategories) {
          try {
            const parsedCategories = JSON.parse(savedCategories)
            // Always use saved categories if they exist in localStorage
            // Converter o formato do localStorage para o formato usado no componente
            const formattedCategories = parsedCategories.map((cat: any) => {
              // Map known category IDs to their proper paths
              const categoryPaths: Record<string, string> = {
                'camisetas': '/camisetas',
                'moletons': '/moletons',
                'jaquetas': '/jaquetas',
                'calcas': '/calcas',
                'shorts': '/shorts-bermudas',
                'em-alta': '/em-alta'
              }
              
              const href = categoryPaths[cat.id] || cat.href || `/explore/${cat.id}`
              
              return {
                id: cat.id,
                name: cat.name,
                image: cat.image || "/placeholder-camiseta.jpg",
                href: href,
                description: cat.description || ""
              }
            })
            setCategories(formattedCategories)
            setEditingCategories(formattedCategories)
          } catch (error) {
            console.error('Erro ao carregar categorias:', error)
            setCategories(defaultCategories)
            setEditingCategories(defaultCategories)
          }
        } else {
          setCategories(defaultCategories)
          setEditingCategories(defaultCategories)
        }
      }
    }

    loadCategories()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-categories") {
        loadCategories()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleSaveCategories = () => {
    // Salvar no estado
    setCategories(editingCategories)
    
    // Salvar no localStorage no formato esperado pelo sistema
    const localStorageFormat = editingCategories.map(cat => {
      // Map known category IDs to their proper paths
      const categoryPaths: Record<string, string> = {
        'camisetas': '/camisetas',
        'moletons': '/moletons',
        'jaquetas': '/jaquetas',
        'calcas': '/calcas',
        'shorts': '/shorts-bermudas',
        'em-alta': '/em-alta'
      }
      
      const href = categoryPaths[cat.id] || cat.href || `/explore/${cat.id}`
      
      return {
        id: cat.id,
        name: cat.name,
        image: cat.image || "/placeholder-camiseta.jpg",
        href: href,
        description: cat.description,
        products: [] // Array vazio de produtos
      }
    })
    
    localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
    
    // Disparar evento StorageEvent para atualizar outros componentes
    window.dispatchEvent(new StorageEvent('storage', { 
      key: "gang-boyz-categories",
      newValue: JSON.stringify(localStorageFormat)
    }))
    
    setIsEditing(false)
    toast({
      title: "Categorias atualizadas",
      description: "As categorias foram salvas com sucesso."
    })
  }

  const handleCancelEdit = () => {
    setEditingCategories(categories)
    setIsEditing(false)
    setShowAddForm(false)
  }

  const handleAddCategory = () => {
    // Verificar limite de 6 categorias
    if (editingCategories.length >= 6) {
      toast({
        title: "Limite atingido",
        description: "Você pode ter no máximo 6 categorias.",
        variant: "destructive"
      })
      return
    }

    if (!newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive"
      })
      return
    }

    const categoryId = newCategory.id || newCategory.name.toLowerCase().replace(/\s+/g, '-')
    // Map known category IDs to their proper paths
    const categoryPaths: Record<string, string> = {
      'camisetas': '/camisetas',
      'moletons': '/moletons',
      'jaquetas': '/jaquetas',
      'calcas': '/calcas',
      'shorts': '/shorts-bermudas',
      'em-alta': '/em-alta'
    }
    
    const href = categoryPaths[categoryId] || newCategory.href || `/explore/${categoryId}`
    
    const newCat: Category = {
      id: categoryId,
      name: newCategory.name,
      image: newCategory.image,
      href: href,
      description: newCategory.description
    }

    const updatedCategories = [...editingCategories, newCat]
    setEditingCategories(updatedCategories)
    
    // Also update the main categories state immediately
    setCategories(updatedCategories)
    
    // Save to localStorage immediately so the category appears right away
    const localStorageFormat = updatedCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image || "/placeholder-camiseta.jpg",
      href: cat.href || `/explore/${cat.id}`,
      description: cat.description,
      products: [] // Array vazio de produtos
    }))
    
    localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
    
    // Disparar evento StorageEvent para atualizar outros componentes
    window.dispatchEvent(new StorageEvent('storage', { 
      key: "gang-boyz-categories",
      newValue: JSON.stringify(localStorageFormat)
    }))
    
    setNewCategory({
      id: "",
      name: "",
      image: "/placeholder-camiseta.jpg",
      href: "",
      description: ""
    })
    setShowAddForm(false)
    
    toast({
      title: "Categoria adicionada",
      description: "A categoria foi adicionada com sucesso."
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      const updatedCategories = editingCategories.filter(cat => cat.id !== categoryId)
      setEditingCategories(updatedCategories)
      
      // Also update the main categories state immediately
      setCategories(updatedCategories)
      
      // Save to localStorage immediately so the category is removed right away
      const localStorageFormat = updatedCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        image: cat.image || "/placeholder-category-circle.png",
        href: cat.href || `/explore/${cat.id}`,
        description: cat.description,
        products: [] // Array vazio de produtos
      }))
      
      localStorage.setItem("gang-boyz-categories", JSON.stringify(localStorageFormat))
      
      // Disparar evento StorageEvent para atualizar outros componentes
      window.dispatchEvent(new StorageEvent('storage', { 
        key: "gang-boyz-categories",
        newValue: JSON.stringify(localStorageFormat)
      }))
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso."
      })
    }
  }

  const handleUpdateCategory = (index: number, field: keyof Category, value: string) => {
    const updatedCategories = [...editingCategories]
    updatedCategories[index] = { ...updatedCategories[index], [field]: value }
    setEditingCategories(updatedCategories)
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">NOSSAS CATEGORIAS</h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
        </div>
        
        {/* Botões de edição no modo de edição */}
        {effectiveIsEditMode && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Categorias
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={editingCategories.length >= 6}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
          </div>
        )}
        
        {/* Formulário de adição de nova categoria */}
        {effectiveIsEditMode && showAddForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Adicionar Nova Categoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Nome da categoria"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID (opcional)</label>
                <Input
                  value={newCategory.id}
                  onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                  placeholder="ID da categoria (deixe em branco para gerar automaticamente)"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL (opcional)</label>
                <Input
                  value={newCategory.href}
                  onChange={(e) => setNewCategory({...newCategory, href: e.target.value})}
                  placeholder="URL da categoria (ex: /minha-categoria)"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Texto abaixo do nome)</label>
                <Input
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Ex: De todos os estilos"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setNewCategory({...newCategory, image: event.target.result as string});
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-red-500"
                />
                {newCategory.image && newCategory.image !== "/placeholder-category-circle.png" && (
                  <div className="mt-2">
                    <img src={newCategory.image} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCategory} 
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        )}
        
        {/* Interface de edição de categorias */}
        {effectiveIsEditMode && isEditing && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Editar Categorias</h3>
            <div className="space-y-4">
              {editingCategories.map((category, index) => (
                <div key={category.id} className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <Input
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(index, 'name', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      <Input
                        value={category.id}
                        onChange={(e) => handleUpdateCategory(index, 'id', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <Input
                        value={category.href}
                        onChange={(e) => handleUpdateCategory(index, 'href', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="outline" 
                        className="text-red-600 border-red-600 hover:bg-red-50 w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Texto abaixo do nome)</label>
                      <Input
                        value={category.description}
                        onChange={(e) => handleUpdateCategory(index, 'description', e.target.value)}
                        placeholder="Ex: De todos os estilos"
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                handleUpdateCategory(index, 'image', event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-red-500"
                      />
                      {category.image && category.image !== "/placeholder-category-circle.png" && (
                        <div className="mt-2">
                          <img src={category.image} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={handleCancelEdit} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveCategories} 
                className="bg-red-600 hover:bg-red-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Todas
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-6">
          {(isEditing ? editingCategories : categories).map((category) => (
            <Link 
              key={category.id} 
              href={category.href}
              className="group flex flex-col items-center transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 rounded-full"></div>
                {effectiveIsEditMode && isEditing && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Abrir modal de edição para esta categoria específica
                      const index = editingCategories.findIndex(cat => cat.id === category.id);
                      if (index !== -1) {
                        // Aqui você pode implementar um modal de edição específica se quiser
                        // Por enquanto, vamos focar na edição em massa
                      }
                    }}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1 rounded-full shadow-md"
                    title="Editar categoria"
                  >
                    <Edit3 className="h-3 w-3 text-gray-700" />
                  </button>
                )}
              </div>
              <h3 className="text-black font-bold text-base mb-1 group-hover:text-red-500 transition-colors text-center">
                {category.name}
              </h3>
              <p className="text-gray-600 text-xs text-center">
                {category.description || `${category.name} de todos os estilos`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}