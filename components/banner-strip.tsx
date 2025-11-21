"use client"

import { useState, useEffect } from "react"
import { useEditMode } from "@/lib/edit-mode-context"
import { Settings, Pencil } from "lucide-react"
import { bannerSyncService } from "@/lib/banner-sync-service"

export function BannerStrip() {
  console.log('BannerStrip component mounted');
  const [bannerText, setBannerText] = useState("SITE DEMONSTRATIVO")
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [bannerEmoji, setBannerEmoji] = useState("")
  const [bannerBgColor, setBannerBgColor] = useState("black")
  const [bannerTextColor, setBannerTextColor] = useState("white")
  const [bannerHeight, setBannerHeight] = useState(38) // altura em pixels
  const [bannerSpeed, setBannerSpeed] = useState(50) // velocidade do scroll (1-100)
  const [bannerRepetitions, setBannerRepetitions] = useState(4) // quantidade de repetições do texto
  const [bannerPosition, setBannerPosition] = useState("current") // posição: "top" ou "current"
  const [bannerTextAnimation, setBannerTextAnimation] = useState("scroll") // animação: "scroll" ou "static"
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Create a wrapper function to log state changes
  const setBannerPositionWithLogging = (position: string) => {
    console.log('BannerStrip - Setting bannerPosition from', bannerPosition, 'to', position);
    setBannerPosition(position);
  }
  
  // Override the useEffect to log state changes
  useEffect(() => {
    console.log('BannerStrip - bannerPosition updated to:', bannerPosition);
  }, [bannerPosition]);
  
  // Get edit mode context
  const { isEditMode } = useEditMode()
  
  console.log('BannerStrip - Initial state:', {
    bannerText,
    isBannerActive,
    bannerEmoji,
    bannerBgColor,
    bannerTextColor,
    bannerHeight,
    bannerSpeed,
    bannerRepetitions,
    bannerPosition,
    isModalOpen,
    isEditMode
  });

  useEffect(() => {
    console.log('BannerStrip useEffect called')
    const loadBannerSettings = () => {
      const savedText = localStorage.getItem("gang-boyz-main-banner-text")
      const savedActive = localStorage.getItem("gang-boyz-main-banner-active")
      const savedEmoji = localStorage.getItem("gang-boyz-main-banner-emoji")
      const savedBgColor = localStorage.getItem("gang-boyz-main-banner-bg-color")
      const savedTextColor = localStorage.getItem("gang-boyz-main-banner-text-color")
      const savedHeight = localStorage.getItem("gang-boyz-main-banner-height")
      const savedSpeed = localStorage.getItem("gang-boyz-main-banner-speed")
      const savedRepetitions = localStorage.getItem("gang-boyz-main-banner-repetitions")
      const savedPosition = localStorage.getItem("gang-boyz-main-banner-position")
      const savedTextAnimation = localStorage.getItem("gang-boyz-main-banner-text-animation")
      
      console.log('BannerStrip - Loading settings from localStorage:', {
        savedText,
        savedActive,
        savedEmoji,
        savedBgColor,
        savedTextColor,
        savedHeight,
        savedSpeed,
        savedRepetitions,
        savedPosition,
        savedTextAnimation
      })
      
      if (savedText) setBannerText(savedText)
      if (savedActive !== null) setIsBannerActive(savedActive === 'true')
      if (savedEmoji) setBannerEmoji(savedEmoji)
      if (savedBgColor) setBannerBgColor(savedBgColor)
      if (savedTextColor) setBannerTextColor(savedTextColor)
      if (savedHeight) setBannerHeight(parseInt(savedHeight))
      if (savedSpeed) setBannerSpeed(parseInt(savedSpeed))
      if (savedRepetitions) setBannerRepetitions(parseInt(savedRepetitions))
      if (savedPosition) {
        console.log('BannerStrip - Setting bannerPosition from', bannerPosition, 'to', savedPosition)
        setBannerPositionWithLogging(savedPosition)
      }
      if (savedTextAnimation) setBannerTextAnimation(savedTextAnimation)
    }

    loadBannerSettings()
    
    // Firebase real-time listener for banner strip settings
    const unsubscribeFirebase = bannerSyncService.listenToBannerStripChanges('main-banner-strip', (data) => {
      if (data) {
        console.log('BannerStrip - Firebase data received:', data)
        setBannerText(data.text || "SITE DEMONSTRATIVO")
        setIsBannerActive(data.isActive ?? true)
        setBannerEmoji(data.emoji || "")
        setBannerBgColor(data.bgColor || "black")
        setBannerHeight(data.height || 38)
        setBannerSpeed(data.speed || 50)
        setBannerRepetitions(data.repetitions || 4)
        if (data.position) {
          console.log('BannerStrip - Setting bannerPosition from', bannerPosition, 'to', data.position)
          setBannerPositionWithLogging(data.position || "current")
        }
        if (data.textAnimation) setBannerTextAnimation(data.textAnimation)
      }
    })
    
    // Escutar mudanças nas configurações
    const handleBannerSettingsUpdate = () => {
      const savedText = localStorage.getItem("gang-boyz-main-banner-text")
      const savedActive = localStorage.getItem("gang-boyz-main-banner-active")
      const savedEmoji = localStorage.getItem("gang-boyz-main-banner-emoji")
      const savedBgColor = localStorage.getItem("gang-boyz-main-banner-bg-color")
      const savedTextColor = localStorage.getItem("gang-boyz-main-banner-text-color")
      const savedHeight = localStorage.getItem("gang-boyz-main-banner-height")
      const savedSpeed = localStorage.getItem("gang-boyz-main-banner-speed")
      const savedRepetitions = localStorage.getItem("gang-boyz-main-banner-repetitions")
      const savedPosition = localStorage.getItem("gang-boyz-main-banner-position")
      const savedTextAnimation = localStorage.getItem("gang-boyz-main-banner-text-animation")
      
      console.log('BannerStrip - handleBannerSettingsUpdate called:', {
        savedText,
        savedActive,
        savedEmoji,
        savedBgColor,
        savedTextColor,
        savedHeight,
        savedSpeed,
        savedRepetitions,
        savedPosition,
        savedTextAnimation
      })
      
      if (savedText) setBannerText(savedText)
      if (savedActive !== null) setIsBannerActive(savedActive === 'true')
      if (savedEmoji) setBannerEmoji(savedEmoji)
      if (savedBgColor) setBannerBgColor(savedBgColor)
      if (savedTextColor) setBannerTextColor(savedTextColor)
      if (savedHeight) setBannerHeight(parseInt(savedHeight))
      if (savedSpeed) setBannerSpeed(parseInt(savedSpeed))
      if (savedRepetitions) setBannerRepetitions(parseInt(savedRepetitions))
      if (savedPosition) {
        console.log('BannerStrip - Setting bannerPosition from', bannerPosition, 'to', savedPosition)
        setBannerPositionWithLogging(savedPosition)
      }
      if (savedTextAnimation) setBannerTextAnimation(savedTextAnimation)
    }
    window.addEventListener('mainBannerSettingsUpdated', handleBannerSettingsUpdate)
    
    // Escutar evento para abrir o editor
    const openEditorHandler = (event: CustomEvent) => {
      console.log('Evento openBannerStripEditor recebido no BannerStrip', event.detail)
      setIsModalOpen(true)
    }
    window.addEventListener('openBannerStripEditor', openEditorHandler as EventListener)
    
    return () => {
      console.log('BannerStrip - Cleaning up event listeners');
      window.removeEventListener('mainBannerSettingsUpdated', handleBannerSettingsUpdate)
      window.removeEventListener('openBannerStripEditor', openEditorHandler as EventListener)
      // Clean up Firebase listener
      unsubscribeFirebase()
    }
  }, [])

  // Function to save banner settings
  const handleSaveSettings = async () => {
    console.log('BannerStrip - Saving settings');
    
    localStorage.setItem("gang-boyz-main-banner-text", bannerText)
    localStorage.setItem("gang-boyz-main-banner-active", isBannerActive.toString())
    localStorage.setItem("gang-boyz-main-banner-emoji", bannerEmoji)
    localStorage.setItem("gang-boyz-main-banner-bg-color", bannerBgColor)
    localStorage.setItem("gang-boyz-main-banner-text-color", bannerTextColor)
    localStorage.setItem("gang-boyz-main-banner-height", bannerHeight.toString())
    localStorage.setItem("gang-boyz-main-banner-speed", bannerSpeed.toString())
    localStorage.setItem("gang-boyz-main-banner-repetitions", bannerRepetitions.toString())
    localStorage.setItem("gang-boyz-main-banner-position", bannerPosition)
    localStorage.setItem("gang-boyz-main-banner-text-animation", bannerTextAnimation)
    
    // Also update the top banner position and text animation to keep both components in sync
    localStorage.setItem("gang-boyz-top-banner-position", bannerPosition)
    localStorage.setItem("gang-boyz-top-banner-text-animation", bannerTextAnimation)
    
    console.log('BannerStrip - Saved position and text animation to localStorage:', {
      main: {
        position: localStorage.getItem("gang-boyz-main-banner-position"),
        textAnimation: localStorage.getItem("gang-boyz-main-banner-text-animation")
      },
      top: {
        position: localStorage.getItem("gang-boyz-top-banner-position"),
        textAnimation: localStorage.getItem("gang-boyz-top-banner-text-animation")
      }
    });
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new CustomEvent('mainBannerSettingsUpdated'))
    window.dispatchEvent(new CustomEvent('topBannerSettingsUpdated'))
    
    console.log('BannerStrip - Dispatched events:', {
      mainBannerSettingsUpdated: true,
      topBannerSettingsUpdated: true
    });
    
    // Sync with Firebase
    try {
      await bannerSyncService.syncBannerStripToFirebase({
        text: bannerText,
        isActive: isBannerActive,
        emoji: bannerEmoji,
        bgColor: bannerBgColor,
        height: bannerHeight,
        speed: bannerSpeed,
        repetitions: bannerRepetitions,
        position: bannerPosition,
        textAnimation: bannerTextAnimation
      }, 'main-banner-strip')
    } catch (error) {
      console.error('Error syncing banner strip to Firebase:', error)
    }
    
    setIsModalOpen(false)
  }

  const handleResetSettings = () => {
    setBannerText("SITE DEMONSTRATIVO")
    setIsBannerActive(true)
    setBannerEmoji("")
    setBannerBgColor("black")
    setBannerTextColor("white")
    setBannerHeight(38)
    setBannerSpeed(50)
    setBannerRepetitions(4)
    setBannerPosition("current")
  }

  // Remover a condição de renderização condicional
  // if (!isBannerActive) return null

  // Função para verificar se a faixa deve ser renderizada na posição atual
  const shouldRenderInCurrentPosition = () => {
    const result = isBannerActive && bannerPosition !== "top";
    console.log('BannerStrip - shouldRenderInCurrentPosition:', {
      isBannerActive,
      bannerPosition,
      result
    });
    return result;
  }

  // Função para verificar se a faixa deve ser renderizada no topo
  const shouldRenderAtTop = () => {
    const result = isBannerActive && bannerPosition === "top";
    console.log('BannerStrip - shouldRenderAtTop:', {
      isBannerActive,
      bannerPosition,
      result
    });
    return result;
  }

  // Função para obter a cor de fundo correta
  const getBackgroundColor = () => {
    switch (bannerBgColor) {
      case 'black': return 'bg-black'
      case 'red': return 'bg-red-600'
      case 'blue': return 'bg-blue-600'
      case 'yellow': return 'bg-yellow-500'
      case 'green': return 'bg-green-600'
      case 'purple': return 'bg-purple-600'
      case 'orange': return 'bg-orange-500'
      case 'pink': return 'bg-pink-500'
      default: return 'bg-black'
    }
  }

  return (
    <>
      {/* Renderizar a faixa apenas se estiver ativa e na posição atual */}
      {shouldRenderInCurrentPosition() && (
        <>
          <div 
            className={`w-full overflow-hidden relative ${getBackgroundColor()}`}
            style={{ height: `${bannerHeight}px` }}
          >
            {/* Edit indicator - only visible in edit mode */}
            {isEditMode && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-0 right-0 z-10 p-1 rounded-bl-lg bg-white/80 hover:bg-white border border-gray-300 shadow-md transition-colors"
                title="Editar Faixa"
              >
                <Pencil className="h-4 w-4 text-gray-700" />
              </button>
            )}
            
            <div className="flex items-center h-full">
              <div 
                className={`flex font-bold text-sm tracking-wider ${bannerTextAnimation === 'static' ? 'justify-center w-full' : 'whitespace-nowrap'}`}
                style={{ 
                  animation: bannerTextAnimation === 'scroll' ? `scroll ${Math.max(5, 20 - (bannerSpeed / 5))}s linear infinite` : 'none',
                  color: bannerTextColor
                }}
              >
                {bannerTextAnimation === 'static' ? (
                  <span>{bannerEmoji} {bannerText} {bannerEmoji}</span>
                ) : (
                  Array.from({ length: bannerRepetitions }, (_, i) => (
                    <span key={i} className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Modal de Edição - sempre renderizado, mesmo quando a faixa está desativada */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Editar Faixa de Aviso</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Status da Faixa */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-200">Faixa Ativa</span>
                <button
                  onClick={() => setIsBannerActive(!isBannerActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      isBannerActive ? 'bg-blue-600' : 'bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        isBannerActive ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </span>
                </button>
              </div>
              
              {/* Texto da Faixa */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Texto da Faixa</label>
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                  placeholder="Digite o texto da faixa"
                />
              </div>
              
              {/* Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Emoji</label>
                <input
                  type="text"
                  value={bannerEmoji}
                  onChange={(e) => setBannerEmoji(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                  placeholder="🎯"
                />
              </div>
              
              {/* Cor de Fundo */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Cor de Fundo</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Preto', value: 'black' },
                    { name: 'Vermelho', value: 'red' },
                    { name: 'Azul', value: 'blue' },
                    { name: 'Amarelo', value: 'yellow' },
                    { name: 'Verde', value: 'green' },
                    { name: 'Roxo', value: 'purple' },
                    { name: 'Laranja', value: 'orange' },
                    { name: 'Rosa', value: 'pink' }
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBannerBgColor(color.value)}
                      className={`p-2 rounded text-xs font-medium ${
                        bannerBgColor === color.value
                          ? 'ring-2 ring-white'
                          : 'opacity-70 hover:opacity-100'
                      } ${
                        color.value === 'black' ? 'bg-black text-white' :
                        color.value === 'red' ? 'bg-red-600 text-white' :
                        color.value === 'blue' ? 'bg-blue-600 text-white' :
                        color.value === 'yellow' ? 'bg-yellow-500 text-gray-900' :
                        color.value === 'green' ? 'bg-green-600 text-white' :
                        color.value === 'purple' ? 'bg-purple-600 text-white' :
                        color.value === 'orange' ? 'bg-orange-500 text-white' :
                        color.value === 'pink' ? 'bg-pink-500 text-white' :
                        'bg-gray-600 text-white'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Cor do Texto */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Cor do Texto</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setBannerTextColor('white')}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      bannerTextColor === 'white'
                        ? 'bg-white text-gray-900 ring-2 ring-blue-500'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    Branco
                  </button>
                  <button
                    onClick={() => setBannerTextColor('black')}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      bannerTextColor === 'black'
                        ? 'bg-black text-white ring-2 ring-blue-500'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    Preto
                  </button>
                </div>
              </div>
              
              {/* Altura */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Altura (px)</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={bannerHeight}
                  onChange={(e) => setBannerHeight(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{bannerHeight}px</div>
              </div>
              
              {/* Velocidade */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Velocidade</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={bannerSpeed}
                  onChange={(e) => setBannerSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{bannerSpeed}%</div>
              </div>
              
              {/* Repetições */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Repetições</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={bannerRepetitions}
                  onChange={(e) => setBannerRepetitions(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{bannerRepetitions} vezes</div>
              </div>
              
              {/* Tipo de Animação */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Animação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBannerTextAnimation("scroll")}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      bannerTextAnimation === "scroll"
                        ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Rolagem
                  </button>
                  <button
                    onClick={() => setBannerTextAnimation("static")}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      bannerTextAnimation === "static"
                        ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Estático
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {bannerTextAnimation === "scroll" 
                    ? "Texto em movimento contínuo" 
                    : "Texto fixo no centro"}
                </div>
              </div>
              
              {/* Posição */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Posição da Faixa</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      console.log('BannerStrip - Setting position to top');
                      setBannerPositionWithLogging("top");
                    }}
                    className={`p-3 rounded text-sm font-medium ${
                      bannerPosition === "top"
                        ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                        : 'bg-gray-700 text-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    No Topo (acima do header)
                  </button>
                  <button
                    onClick={() => {
                      console.log('BannerStrip - Setting position to current');
                      setBannerPositionWithLogging("current");
                    }}
                    className={`p-3 rounded text-sm font-medium ${
                      bannerPosition === "current"
                        ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                        : 'bg-gray-700 text-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    Abaixo do Cabeçalho
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {bannerPosition === "top" 
                    ? "A faixa aparecerá no topo da página, acima do header" 
                    : "A faixa aparecerá abaixo do cabeçalho"}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-700 mt-6">
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Salvar
              </button>
              
              <button
                onClick={handleResetSettings}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Resetar
              </button>
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BannerStrip

// We'll create a separate component for the top banner strip
