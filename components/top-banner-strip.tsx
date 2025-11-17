"use client"

import { useState, useEffect } from "react"
import { useEditMode } from "@/lib/edit-mode-context"
import { Pencil } from "lucide-react"
import { bannerSyncService } from "@/lib/banner-sync-service"

export function TopBannerStrip() {
  console.log('TopBannerStrip - Component mounted');
  const [bannerText, setBannerText] = useState("SITE DEMONSTRATIVO")
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [bannerEmoji, setBannerEmoji] = useState("")
  const [bannerBgColor, setBannerBgColor] = useState("black")
  const [bannerTextColor, setBannerTextColor] = useState("white")
  const [bannerHeight, setBannerHeight] = useState(38) // altura em pixels
  const [bannerSpeed, setBannerSpeed] = useState(50) // velocidade do scroll (1-100)
  const [bannerRepetitions, setBannerRepetitions] = useState(4) // quantidade de repetições do texto
  const [bannerPosition, setBannerPosition] = useState("current") // posição: "top" ou "current"
  const [bannerTextAnimation, setBannerTextAnimation] = useState("scroll") // animação do texto
  
  // Create a wrapper function to log state changes
  const setBannerPositionWithLogging = (position: string) => {
    console.log('TopBannerStrip - Setting bannerPosition from', bannerPosition, 'to', position);
    setBannerPosition(position);
  }
  
  // Override the useEffect to log state changes
  useEffect(() => {
    console.log('TopBannerStrip - bannerPosition updated to:', bannerPosition);
  }, [bannerPosition]);
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Get edit mode context with error handling
  let isEditMode = false;
  try {
    const editModeContext = useEditMode();
    isEditMode = editModeContext.isEditMode;
  } catch (error) {
    console.warn("Failed to initialize edit mode context in TopBannerStrip:", error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      isEditMode = localStorage.getItem('edit-mode-enabled') === 'true';
    }
  }
  
  console.log('TopBannerStrip - Initial state:', {
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
    console.log('TopBannerStrip useEffect called')
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
      
      console.log('TopBannerStrip - Loading settings from localStorage:', {
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
        console.log('TopBannerStrip - Setting bannerPosition from', bannerPosition, 'to', savedPosition)
        setBannerPositionWithLogging(savedPosition)
      }
      if (savedTextAnimation) setBannerTextAnimation(savedTextAnimation)
    }

    loadBannerSettings()
    
    // Firebase real-time listener for banner strip settings
    const unsubscribeFirebase = bannerSyncService.listenToBannerStripChanges('main-banner-strip', (data) => {
      if (data) {
        console.log('TopBannerStrip - Firebase data received:', data)
        setBannerText(data.text || "SITE DEMONSTRATIVO")
        setIsBannerActive(data.isActive ?? true)
        setBannerEmoji(data.emoji || "")
        setBannerBgColor(data.bgColor || "black")
        setBannerHeight(data.height || 38)
        setBannerSpeed(data.speed || 50)
        setBannerRepetitions(data.repetitions || 4)
        if (data.position) {
          console.log('TopBannerStrip - Setting bannerPosition from', bannerPosition, 'to', data.position)
          setBannerPositionWithLogging(data.position || "current")
        }
        if (data.textAnimation) setBannerTextAnimation(data.textAnimation)
      }
    })
    
    // Listen for changes from the main banner strip
    const handleMainBannerSettingsUpdate = () => {
      // Load the main banner settings to get the position
      const savedPosition = localStorage.getItem("gang-boyz-main-banner-position")
      console.log('TopBannerStrip - Main banner settings updated, position:', savedPosition)
      if (savedPosition) {
        console.log('TopBannerStrip - Setting bannerPosition from', bannerPosition, 'to', savedPosition)
        setBannerPositionWithLogging(savedPosition)
      }
    }
    
    window.addEventListener('mainBannerSettingsUpdated', handleMainBannerSettingsUpdate)
    
    // Escutar evento para abrir o editor
    const openEditorHandler = (event: CustomEvent) => {
      console.log('Evento openBannerStripEditor recebido no TopBannerStrip', event.detail)
      setIsModalOpen(true)
    }
    window.addEventListener('openBannerStripEditor', openEditorHandler as EventListener)
    
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
      
      console.log('TopBannerStrip - handleBannerSettingsUpdate called:', {
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
        console.log('TopBannerStrip - Setting bannerPosition from', bannerPosition, 'to', savedPosition)
        setBannerPositionWithLogging(savedPosition)
      }
      if (savedTextAnimation) setBannerTextAnimation(savedTextAnimation)
    }
    window.addEventListener('mainBannerSettingsUpdated', handleBannerSettingsUpdate)
    
    return () => {
      console.log('TopBannerStrip - Cleaning up event listeners');
      window.removeEventListener('mainBannerSettingsUpdated', handleMainBannerSettingsUpdate)
      window.removeEventListener('openBannerStripEditor', openEditorHandler as EventListener)
      window.removeEventListener('mainBannerSettingsUpdated', handleBannerSettingsUpdate)
      // Clean up Firebase listener
      unsubscribeFirebase()
    }
  }, [])

  // Função para verificar se a faixa deve ser renderizada no topo
  const shouldRenderAtTop = () => {
    const result = isBannerActive && bannerPosition === "top";
    console.log('TopBannerStrip - shouldRenderAtTop:', {
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

  // Don't render if not in top position or not active
  if (!shouldRenderAtTop()) {
    console.log('TopBannerStrip - Not rendering because shouldRenderAtTop returned false');
    return null;
  }
  
  console.log('TopBannerStrip - Rendering banner');
  
  // Function to handle opening the editor
  const handleOpenEditor = () => {
    // Dispatch a custom event that the main BannerStrip component listens to
    window.dispatchEvent(new CustomEvent('openBannerStripEditor', {
      detail: { source: 'top-banner-strip' }
    }));
  };
  
  // Function to save top banner settings
  const handleSaveTopBannerSettings = async () => {
    console.log('TopBannerStrip - Saving settings with position and text animation:', {position: bannerPosition, textAnimation: bannerTextAnimation});
    
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
    
    console.log('TopBannerStrip - Saved position and text animation to localStorage:', {
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
    
    console.log('TopBannerStrip - Dispatched events:', {
      mainBannerSettingsUpdated: true,
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
      console.error('Error syncing top banner strip to Firebase:', error)
    }
    
    // Close the modal
    setIsModalOpen(false)
  }
  
  return (
    <>
      <div 
        className={`w-full overflow-hidden relative ${getBackgroundColor()}`}
        style={{ height: `${bannerHeight}px` }}
      >
        {/* Edit indicator - only visible in edit mode */}
        {isEditMode && (
          <button
            onClick={handleOpenEditor}
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
      
      {/* We'll handle the modal in the main BannerStrip component to avoid duplication */}
    </>
  )
}

export default TopBannerStrip