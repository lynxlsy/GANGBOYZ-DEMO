"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Edit3 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

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

export function BannerGrid() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCollection, setEditingCollection] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [currentCollectionId, setCurrentCollectionId] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Check if we're in edit mode
  useEffect(() => {
    const checkEditMode = () => {
      // This is a simplified check - in a real implementation, you'd use the context
      const editMode = localStorage.getItem('gang-boyz-edit-mode') === 'true'
      setIsEditMode(editMode)
    }
    
    checkEditMode()
    
    // Listen for edit mode changes
    const handleEditModeChange = () => {
      checkEditMode()
    }
    
    window.addEventListener('editModeChanged', handleEditModeChange)
    
    return () => {
      window.removeEventListener('editModeChanged', handleEditModeChange)
    }
  }, [])

  // Carregar coleções do localStorage
  useEffect(() => {
    const loadCollections = () => {
      const savedCollections = localStorage.getItem("gang-boyz-collections")
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections))
      } else {
        // Sem coleções padrão - aguardando configuração pelo admin
        setCollections([])
      }
    }

    // Carregar inicialmente
    loadCollections()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-collections") {
        loadCollections()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadCollections()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('collectionsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('collectionsUpdated', handleCustomStorageChange)
    }
  }, [])

  const handleEditCollection = (collectionId: string) => {
    setCurrentCollectionId(collectionId)
    setShowUploadModal(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo permitido: 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Apenas arquivos de imagem são permitidos")
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const { url } = await response.json()
      
      // Update the collection image
      const updatedCollections = collections.map(collection => 
        collection.id === currentCollectionId 
          ? { ...collection, image: url } 
          : collection
      )
      
      setCollections(updatedCollections)
      localStorage.setItem("gang-boyz-collections", JSON.stringify(updatedCollections))
      window.dispatchEvent(new CustomEvent('collectionsUpdated'))
      
      toast.success("Imagem atualizada com sucesso!")
      setShowUploadModal(false)
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro ao fazer upload da imagem")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileInput = (collectionId: string) => {
    setCurrentCollectionId(collectionId)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <section className="pt-0 pb-0 bg-black relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editar Imagem da Coleção
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Enviando..." : "Selecionar Imagem"}
              </Button>
              
              <Button
                onClick={() => setShowUploadModal(false)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full">
        {/* Edit button for the entire grid */}
        {isEditMode && (
          <div className="absolute top-4 right-4 z-20">
            <Button 
              onClick={() => toast.info("Clique em uma coleção individual para editar sua imagem")}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Editar Banners Grid
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mb-0">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group cursor-pointer bg-gray-900"
              onClick={() => {
                if (isEditMode) {
                  handleEditCollection(collection.id)
                } else if (collection.link) {
                  router.push(collection.link)
                }
              }}
            >
              {/* Background Media */}
              <div className="absolute inset-0">
                {collection.mediaType === 'video' ? (
                  <video
                    src={collection.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-80`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-3 md:p-4 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-2 md:mb-3">
                    <span className="text-xs font-bold tracking-wider text-white/90 uppercase bg-white/20 px-2 md:px-3 py-1">
                      {collection.brand}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-white mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-xs md:text-sm text-white/90 font-semibold mb-2">
                    {collection.subtitle}
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {collection.description}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="!red-bg !hover:red-bg-hover !text-white font-bold px-3 md:px-4 py-2 w-fit shadow-lg red-glow transition-all duration-300 !border-red-600 text-xs md:text-sm"
                >
                  {collection.link ? 'EXPLORAR' : 'CONFIRA'}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Edit overlay for individual collection */}
              {isEditMode && (
                <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-yellow-400 text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Editar Imagem</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}