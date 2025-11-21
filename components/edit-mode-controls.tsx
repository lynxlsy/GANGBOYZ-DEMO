"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Settings, 
  Bell, 
  Palette, 
  Eye, 
  Play, 
  Pause, 
  Save, 
  RefreshCw, 
  X, 
  Clock,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Upload,
  Image as ImageIcon,
  Save as SaveIcon,
  AlertTriangle,
  CloudUpload,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { useEditMode } from "@/lib/edit-mode-context"
import { toast } from "sonner"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from '@/lib/editable-content-sync'
import { useBanner } from '@/hooks/use-banner'
import { BannerHeightManager } from '@/components/banner-height-manager'

interface WelcomeModalConfig {
  enabled: boolean
  displayTime: number
  title: string
  description: string
  buttonText: string
}

interface NotificationSettings {
  enabled: boolean
  interval: number
  duration: number
  maxNotifications: number
  showProductId: boolean
  showPrice: boolean
  showNickname: boolean
  customMessage: string
}

export function EditModeControls() {
  const { activeTheme, applyTheme } = useTheme()
  const { isEditMode } = useEditMode()
  const [showWelcomeModalConfig, setShowWelcomeModalConfig] = useState(false)
  const [showNotificationConfig, setShowNotificationConfig] = useState(false)
  const [showThemeConfig, setShowThemeConfig] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  
  // Firebase sync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{ success: boolean; message: string } | null>(null)
  
  // Firebase Sync Log Modal state
  const [showSyncLog, setShowSyncLog] = useState(false)
  const [syncLogs, setSyncLogs] = useState<Array<{timestamp: Date, message: string, type: 'info' | 'success' | 'error' | 'warning'}>>([])
  
  // Welcome modal state
  const [welcomeModalConfig, setWelcomeModalConfig] = useState<WelcomeModalConfig>({
    enabled: true,
    displayTime: 4,
    title: "Seja bem-vindo",
    description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
    buttonText: "Explorar Loja"
  })
  const welcomeModalConfigRef = useRef(welcomeModalConfig);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    interval: 8,
    duration: 3,
    maxNotifications: 10,
    showProductId: true,
    showPrice: true,
    showNickname: true,
    customMessage: ""
  })
  const notificationSettingsRef = useRef(notificationSettings);
  
  // Image upload state
  const [uploading, setUploading] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile' | 'both'>('both')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Banner hooks for each banner type
  const heroBanner1 = useBanner('hero-banner-1')
  const heroBanner2 = useBanner('hero-banner-2')
  const offersBanner = useBanner('offers-banner')
  const footerBanner = useBanner('footer-banner')
  
  // Refs for tracking state
  const activeThemeRef = useRef(activeTheme);
  
  // Keep the refs updated with the latest values
  useEffect(() => {
    welcomeModalConfigRef.current = welcomeModalConfig;
  }, [welcomeModalConfig]);
  
  useEffect(() => {
    notificationSettingsRef.current = notificationSettings;
  }, [notificationSettings]);
  
  useEffect(() => {
    activeThemeRef.current = activeTheme;
  }, [activeTheme]);

  // Load saved configurations
  useEffect(() => {
    // Load welcome modal config
    const savedWelcomeConfig = localStorage.getItem('welcome-modal-config')
    if (savedWelcomeConfig) {
      try {
        const parsed = JSON.parse(savedWelcomeConfig)
        setWelcomeModalConfig(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Erro ao carregar configurações do modal:", error)
      }
    }
    
    // Load notification settings
    const savedNotificationSettings = localStorage.getItem("gang-boyz-notification-settings")
    if (savedNotificationSettings) {
      try {
        const parsed = JSON.parse(savedNotificationSettings)
        setNotificationSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Erro ao carregar configurações de notificação:", error)
      }
    }
    
    // Load notification settings from Firebase
    const loadNotificationSettingsFromFirebase = async () => {
      try {
        const content = getContentById("notification-settings");
        if (content) {
          const parsedSettings = JSON.parse(content);
          if (typeof parsedSettings === 'object' && parsedSettings !== null) {
            setNotificationSettings(prev => ({ ...prev, ...parsedSettings }));
            // Also save to localStorage for offline access
            localStorage.setItem("gang-boyz-notification-settings", JSON.stringify(parsedSettings));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de notificação do Firebase:', error);
      }
    };
    
    loadNotificationSettingsFromFirebase();
    
    // Firebase real-time listener for welcome modal config
    const unsubscribeWelcomeModal = editableContentSyncService.listenToContentChanges("welcome-modal-config", (content) => {
      if (content) {
        try {
          const parsedConfig = JSON.parse(content);
          if (typeof parsedConfig === 'object' && parsedConfig !== null) {
            // Ensure all required properties are present
            const completeConfig = {
              enabled: welcomeModalConfigRef.current.enabled,
              displayTime: welcomeModalConfigRef.current.displayTime,
              title: welcomeModalConfigRef.current.title,
              description: welcomeModalConfigRef.current.description,
              buttonText: welcomeModalConfigRef.current.buttonText,
              ...parsedConfig
            };
            
            setWelcomeModalConfig(completeConfig);
            // Also save to localStorage for offline access
            localStorage.setItem('welcome-modal-config', JSON.stringify(completeConfig));
          }
        } catch (error) {
          console.error('Erro ao processar configuração do modal de boas-vindas do Firebase:', error);
        }
      }
    });
    
    // Firebase real-time listener for notification settings
    const unsubscribeNotificationSettings = editableContentSyncService.listenToContentChanges("notification-settings", (content) => {
      if (content) {
        try {
          const parsedSettings = JSON.parse(content);
          if (typeof parsedSettings === 'object' && parsedSettings !== null) {
            setNotificationSettings(parsedSettings);
            // Also save to localStorage for offline access
            localStorage.setItem("gang-boyz-notification-settings", JSON.stringify(parsedSettings));
            
            // Disparar evento para atualizar o sistema de notificações
            window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
              detail: parsedSettings 
            }));
          }
        } catch (error) {
          console.error('Erro ao processar configurações de notificação do Firebase:', error);
        }
      }
    });
    
    
    // Firebase real-time listener for theme config
    const unsubscribeThemeConfig = editableContentSyncService.listenToContentChanges("theme-config", (content) => {
      if (content) {
        try {
          const themeConfig = JSON.parse(content);
          if (themeConfig && themeConfig.activeTheme && themeConfig.activeTheme !== activeThemeRef.current) {
            // Apply the theme
            applyTheme(themeConfig.activeTheme);
            // Also save to localStorage for offline access
            localStorage.setItem("gang-boyz-active-theme", themeConfig.activeTheme);
          }
        } catch (error) {
          console.error('Erro ao processar configuração de tema do Firebase:', error);
        }
      }
    });

    return () => {
      // Clean up Firebase listeners
      unsubscribeWelcomeModal();
      unsubscribeNotificationSettings();
      unsubscribeThemeConfig();
    };
  }, [])

  // Themes configuration
  const themes = [
    {
      id: "dark-red",
      name: "Vermelho Sangue",
      description: "Vermelho escuro e elegante, perfeito para streetwear",
      colors: {
        primary: "#8B0000",
        primaryHover: "#660000",
        gradientFrom: "#8B0000",
        gradientTo: "#4A0000",
        glowColor: "rgba(139, 0, 0, 0.2)"
      }
    },
    {
      id: "vibrant-red",
      name: "Vermelho Vibrante",
      description: "Vermelho vibrante e chamativo, ideal para chamar atenção",
      colors: {
        primary: "#FF1744",
        primaryHover: "#E91E63",
        gradientFrom: "#FF1744",
        gradientTo: "#D50000",
        glowColor: "rgba(255, 23, 68, 0.8)"
      }
    }
  ]
  
  // Update welcome modal config
  const updateWelcomeModalConfig = async (key: string, value: any) => {
    const updatedConfig = { ...welcomeModalConfig, [key]: value };
    setWelcomeModalConfig(updatedConfig);
    
    // Save individual field changes to Firebase in real-time
    try {
      await updateContentById("welcome-modal-config", JSON.stringify(updatedConfig));
    } catch (error) {
      console.error("Erro ao atualizar configuração do modal em tempo real:", error);
    }
  }

  // Save welcome modal config
  const saveWelcomeModalConfig = async () => {
    try {
      localStorage.setItem('welcome-modal-config', JSON.stringify(welcomeModalConfig))
      
      // Save to Firebase
      await updateContentById("welcome-modal-config", JSON.stringify(welcomeModalConfig))
      
      toast.success("Configurações do modal salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações do modal:", error)
      toast.error("Erro ao salvar configurações")
    }
  }
  
  // Update notification settings
  const updateNotificationSetting = async (key: string, value: any) => {
    const updatedSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(updatedSettings);
    
    // Save individual field changes to Firebase in real-time
    try {
      localStorage.setItem("gang-boyz-notification-settings", JSON.stringify(updatedSettings));
      await updateContentById("notification-settings", JSON.stringify(updatedSettings));
      
      // Disparar evento para atualizar o sistema de notificações
      window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
        detail: updatedSettings 
      }));
    } catch (error) {
      console.error("Erro ao atualizar configuração de notificação em tempo real:", error);
    }
  }

  // Save notification settings
  const saveNotificationSettings = async () => {
    try {
      localStorage.setItem("gang-boyz-notification-settings", JSON.stringify(notificationSettings))
      
      // Save to Firebase
      await updateContentById("notification-settings", JSON.stringify(notificationSettings));
      
      // Disparar evento para atualizar o sistema de notificações
      window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
        detail: notificationSettings 
      }))
      
      toast.success("Configurações de notificação salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast.error("Erro ao salvar configurações")
    }
  }
  
  // Apply theme
  const applyThemeById = async (themeId: string) => {
    applyTheme(themeId)
    toast.success("Tema aplicado com sucesso!")
    
    // Save theme selection to Firebase and localStorage
    try {
      const themeConfig = { activeTheme: themeId };
      localStorage.setItem("gang-boyz-active-theme", themeId);
      await updateContentById("theme-config", JSON.stringify(themeConfig));
    } catch (error) {
      console.error("Erro ao salvar configuração de tema:", error);
    }
  }
  
  // Test notification
  const testNotification = () => {
    window.dispatchEvent(new CustomEvent('testNotification', { 
      detail: {
        nickname: "Usuário Teste",
        productName: "Produto de Teste",
        productId: "TEST001",
        price: 99.90
      }
    }))
    toast.success("Notificação de teste enviada!")
  }
  
  // Reset welcome modal to default
  const resetWelcomeModalConfig = () => {
    const defaultConfig = {
      enabled: true,
      displayTime: 4,
      title: "Seja bem-vindo",
      description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
      buttonText: "Explorar Loja"
    }
    setWelcomeModalConfig(defaultConfig)
  }
  
  // Reset notification settings to default
  const resetNotificationSettings = async () => {
    const defaultSettings = {
      enabled: true,
      interval: 8,
      duration: 3,
      maxNotifications: 10,
      showProductId: true,
      showPrice: true,
      showNickname: true,
      customMessage: ""
    }
    setNotificationSettings(defaultSettings)
    
    // Save to Firebase and localStorage
    try {
      localStorage.setItem("gang-boyz-notification-settings", JSON.stringify(defaultSettings))
      await updateContentById("notification-settings", JSON.stringify(defaultSettings));
      
      // Disparar evento para atualizar o sistema de notificações
      window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
        detail: defaultSettings 
      }))
    } catch (error) {
      console.error("Erro ao resetar configurações de notificação:", error)
    }
  }

  // Image upload functions
  const openImageUpload = (bannerId: string) => {
    setSelectedBanner(bannerId)
    setPreviewImage(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setShowImageUpload(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUploadImage = async () => {
    if (!selectedFile || !selectedBanner) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const { url } = await response.json()
      
      console.log('Dispatching bannerUpdated event:', { bannerId: selectedBanner, imageUrl: url });
      
      // Atualizar o banner usando o hook useBanner
      const updateBannerInStorage = async () => {
        try {
          const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
          if (savedBanners) {
            const banners: any[] = JSON.parse(savedBanners)
            const bannerIndex = banners.findIndex(banner => banner.id === selectedBanner)
            if (bannerIndex >= 0) {
              // Update banner based on selected device
              const updatedBanner = { ...banners[bannerIndex] };
              
              if (selectedDevice === 'desktop') {
                updatedBanner.desktopImage = url;
                // If no mobile image exists, use currentImage as fallback
                if (!updatedBanner.mobileImage) {
                  updatedBanner.mobileImage = updatedBanner.currentImage;
                }
                // Current image should be the desktop image for consistency
                updatedBanner.currentImage = url;
              } else if (selectedDevice === 'mobile') {
                updatedBanner.mobileImage = url;
                // If no desktop image exists, use currentImage as fallback
                if (!updatedBanner.desktopImage) {
                  updatedBanner.desktopImage = updatedBanner.currentImage;
                }
                // Current image should remain as desktop image for desktop view
              } else {
                // Both devices - update all images
                updatedBanner.currentImage = url;
                updatedBanner.desktopImage = url;
                updatedBanner.mobileImage = url;
              }
              
              banners[bannerIndex] = updatedBanner;
                  
                  // Otimizar dados antes de salvar - remover propriedades desnecessárias
                  const optimizedBanners = banners.map(b => {
                    // Certificar-se de que cropMetadata e overlaySettings não sejam undefined
                    if (b.cropMetadata === undefined) {
                      delete b.cropMetadata;
                    }
                    if (b.overlaySettings === undefined) {
                      delete b.overlaySettings;
                    }
                    // Remover propriedades vazias
                    if (b.cropMetadata && Object.keys(b.cropMetadata).length === 0) {
                      delete b.cropMetadata;
                    }
                    if (b.overlaySettings && Object.keys(b.overlaySettings).length === 0) {
                      delete b.overlaySettings;
                    }
                    return b;
                  });
                  
                  // Verificar tamanho dos dados antes de salvar
                  const bannersData = JSON.stringify(optimizedBanners);
                  if (bannersData.length > 4.5 * 1024 * 1024) { // 4.5MB limite de segurança
                    toast.error("Dados muito grandes. Removendo banners antigos para liberar espaço.");
                    console.warn(`⚠️ Dados do banner excedem o limite de armazenamento`);
                    // Manter apenas os banners mais recentes
                    const recentBanners = banners.slice(-3); // Manter apenas os 3 mais recentes
                    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(recentBanners));
                  } else {
                    localStorage.setItem("gang-boyz-homepage-banners", bannersData);
                  }
                  
                  // Dispatch the bannerUpdated event with the correct format that the useBanner hook expects
                  window.dispatchEvent(new CustomEvent('bannerUpdated', {
                    detail: { 
                      bannerId: selectedBanner, 
                      imageUrl: url,
                      device: selectedDevice
                    }
                  }))
                  
                  // Also dispatch a custom event for edit mode updates
                  window.dispatchEvent(new CustomEvent('editModeBannerUpdate', {
                    detail: { 
                      bannerId: selectedBanner, 
                      imageUrl: url,
                      device: selectedDevice
                    }
                  }))
                  
                  // Sincronizar com Firebase - MOVED THIS OUTSIDE THE TRY/CATCH TO ENSURE IT ALWAYS RUNS
                  setTimeout(async () => {
                    try {
                      const { bannerSyncServiceV2 } = await import('@/lib/banner-sync-service-v2')
                      const updatedBanner = banners[bannerIndex]
                      await bannerSyncServiceV2.syncBannerToFirebase(updatedBanner)
                      console.log(`✅ Banner ${selectedBanner} sincronizado com Firebase`)
                      // Only show success message if we're online and Firebase is actually used
                      if (typeof navigator !== 'undefined' && navigator.onLine) {
                        toast.success("Banner sincronizado com Firebase com sucesso!")
                      }
                    } catch (syncError: any) {
                      console.warn(`⚠️ Falha na sincronização do banner ${selectedBanner} com Firebase:`, syncError)
                      // Sincronização com Firebase desativada temporariamente
                      // if (typeof navigator !== 'undefined' && navigator.onLine) {
                      //   // Check if it's a quota exceeded error or other specific Firebase error
                      //   if (syncError?.code === 'resource-exhausted' || syncError?.message?.includes('quota')) {
                      //     toast.warning("Quota do Firebase excedida. Banner salvo localmente.")
                      //   } else {
                      //     toast.error("Falha na sincronização com Firebase")
                      //   }
                      // } else {
                      //   // If offline, don't show error - just inform user
                      //   console.log('Offline mode: banner saved locally')
                      // }
                    }
                  }, 100)
                }
              }
            } catch (error: any) {
              if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                toast.error("Espaço de armazenamento insuficiente. Limpando dados antigos...");
                console.error('QuotaExceededError: Não foi possível salvar os banners no localStorage');
                
                // Tentar limpar dados antigos como fallback
                try {
                  // Limpar dados antigos de todas as chaves de banner
                  const bannerKeys = [
                    'gang-boyz-homepage-banners',
                    'gang-boyz-footer-banner',
                    'gang-boyz-showcase-banners'
                  ];
                  
                  let spaceFreed = false;
                  bannerKeys.forEach(key => {
                    const savedData = localStorage.getItem(key);
                    if (savedData) {
                      const data = JSON.parse(savedData);
                      if (Array.isArray(data) && data.length > 3) {
                        // Manter apenas os 3 mais recentes
                        const recentData = data.slice(-3);
                        localStorage.setItem(key, JSON.stringify(recentData));
                        console.log(`✅ Espaço liberado para ${key}`);
                        spaceFreed = true;
                      }
                    }
                  });
                  
                  if (spaceFreed) {
                    toast.info("Espaço liberado. Tente novamente.");
                    // Tentar salvar novamente
                    setTimeout(() => {
                      handleUploadImage();
                    }, 1000);
                  } else {
                    toast.error("Não foi possível liberar espaço suficiente. Remova algumas imagens manualmente.");
                  }
                } catch (cleanupError) {
                  console.error('Erro ao limpar dados antigos:', cleanupError);
                  toast.error("Erro ao limpar dados antigos. Tente remover algumas imagens manualmente.");
                }
              } else {
                console.error("Erro ao atualizar banner no storage:", error);
                toast.error("Erro ao salvar banner: " + error.message);
              }
            }
          }
          
          await updateBannerInStorage()
          
          toast.success("Imagem atualizada com sucesso!")
          setShowImageUpload(false)
        } catch (error) {
          console.error("Erro no upload:", error)
          toast.error("Erro ao fazer upload da imagem")
        } finally {
          setUploading(false)
          setSelectedBanner("")
          setSelectedFile(null)
          setPreviewImage(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }
      }

  const getBannerTitle = (bannerId: string) => {
    const bannerTitles: Record<string, string> = {
      'hero-banner-1': 'Hero Banner 1',
      'hero-banner-2': 'Hero Banner 2',
      'offers-banner': 'Banner de Ofertas',
      'footer-banner': 'Banner Footer'
    }
    return bannerTitles[bannerId] || bannerId
  }

  const getBannerConfigInfo = (bannerId: string) => {
    const configInfo: Record<string, string> = {
      'hero-banner-1': 'Dimensões recomendadas: 1920×650px',
      'hero-banner-2': 'Dimensões recomendadas: 1920×650px',
      'offers-banner': 'Dimensões recomendadas: 1200×400px',
      'footer-banner': 'Dimensões recomendadas: 1920×300px'
    }
    return configInfo[bannerId] || 'Formatos aceitos: JPG, PNG, WEBP (máx. 5MB)'
  }
  
  // Firebase Sync Function
  const handleFirebaseSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    
    try {
      // Show syncing message
      toast.info("Iniciando sincronização com Firebase...");
      
      // Import the banner sync service
      const { bannerSyncService } = await import('@/lib/banner-sync-service');
      
      // Sync all homepage banners
      await bannerSyncService.syncHomepageBannersAndStripsToFirebase();
      
      // Also sync editable content
      await editableContentSyncService.syncAllContentsToFirebase();
      
      // Show success message
      toast.success("Sincronização com Firebase concluída com sucesso!");
      setSyncStatus({
        success: true,
        message: "Todos os dados foram sincronizados com sucesso."
      });
    } catch (error: any) {
      console.error("Erro na sincronização com Firebase:", error);
      
      // Show error message with details
      let errorMessage = "Erro ao sincronizar com Firebase.";
      let errorDetails = "";
      
      if (error?.code === 'resource-exhausted') {
        errorMessage = "Quota do Firebase excedida.";
        errorDetails = "O limite de uso do Firebase foi atingido. Os dados foram salvos localmente.";
      } else if (error?.message?.includes('timeout') || error?.message?.includes('Timeout')) {
        errorMessage = "Tempo limite excedido.";
        errorDetails = "A conexão com o Firebase demorou muito. Tente novamente mais tarde.";
      } else if (error?.message) {
        errorDetails = error.message;
      }
      
      toast.error(errorMessage, {
        description: errorDetails
      });
      
      setSyncStatus({
        success: false,
        message: `${errorMessage} ${errorDetails}`
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Enhanced Firebase Sync with Detailed Logging
  const handleFirebaseSyncWithLogs = async () => {
    // Clear previous logs and open the log modal
    setSyncLogs([]);
    setShowSyncLog(true);
    
    // Add initial log
    addSyncLog("Iniciando sincronização com Firebase...", "info");
    
    setIsSyncing(true);
    setSyncStatus(null);
    
    try {
      // Import the banner sync service
      const { bannerSyncService } = await import('@/lib/banner-sync-service');
      
      // Check Firebase availability
      addSyncLog("Verificando disponibilidade do Firebase...", "info");
      
      // Load and sync homepage banners
      addSyncLog("Carregando banners da homepage...", "info");
      const savedBanners = localStorage.getItem('gang-boyz-homepage-banners');
      if (savedBanners) {
        const banners = JSON.parse(savedBanners);
        addSyncLog(`Encontrados ${banners.length} banners para sincronização`, "info");
        
        for (const banner of banners) {
          try {
            addSyncLog(`Sincronizando banner: ${banner.id}...`, "info");
            await bannerSyncService.syncBannerToFirebase(banner, 'hero');
            addSyncLog(`✅ Banner ${banner.id} sincronizado com sucesso`, "success");
          } catch (bannerError: any) {
            addSyncLog(`❌ Erro ao sincronizar banner ${banner.id}: ${bannerError.message}`, "error");
          }
        }
      } else {
        addSyncLog("Nenhum banner encontrado para sincronização", "warning");
      }
      
      // Sync banner strip if exists
      addSyncLog("Verificando faixa de aviso...", "info");
      const savedStripData = localStorage.getItem('gang-boyz-homepage-banner-strip');
      if (savedStripData) {
        try {
          const stripData = JSON.parse(savedStripData);
          addSyncLog("Sincronizando faixa de aviso...", "info");
          await bannerSyncService.syncBannerStripToFirebase(stripData, 'homepage-banner-strip');
          addSyncLog("✅ Faixa de aviso sincronizada com sucesso", "success");
        } catch (stripError: any) {
          addSyncLog(`❌ Erro ao sincronizar faixa de aviso: ${stripError.message}`, "error");
        }
      }
      
      // Sync editable content
      addSyncLog("Sincronizando conteúdo editável...", "info");
      try {
        await editableContentSyncService.syncAllContentsToFirebase();
        addSyncLog("✅ Conteúdo editável sincronizado com sucesso", "success");
      } catch (contentError: any) {
        addSyncLog(`❌ Erro ao sincronizar conteúdo editável: ${contentError.message}`, "error");
      }
      
      // Final success message
      addSyncLog("Sincronização concluída com sucesso!", "success");
      toast.success("Sincronização com Firebase concluída com sucesso!");
      setSyncStatus({
        success: true,
        message: "Todos os dados foram sincronizados com sucesso."
      });
    } catch (error: any) {
      console.error("Erro na sincronização com Firebase:", error);
      addSyncLog(`Erro crítico na sincronização: ${error.message}`, "error");
      
      // Show error message with details
      let errorMessage = "Erro ao sincronizar com Firebase.";
      let errorDetails = "";
      
      if (error?.code === 'resource-exhausted') {
        errorMessage = "Quota do Firebase excedida.";
        errorDetails = "O limite de uso do Firebase foi atingido. Os dados foram salvos localmente.";
      } else if (error?.message?.includes('timeout') || error?.message?.includes('Timeout')) {
        errorMessage = "Tempo limite excedido.";
        errorDetails = "A conexão com o Firebase demorou muito. Tente novamente mais tarde.";
      } else if (error?.message) {
        errorDetails = error.message;
      }
      
      toast.error(errorMessage, {
        description: errorDetails
      });
      
      setSyncStatus({
        success: false,
        message: `${errorMessage} ${errorDetails}`
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  const addSyncLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const newLog = {
      timestamp: new Date(),
      message,
      type
    };
    
    setSyncLogs(prev => [...prev, newLog]);
  };
  
  return (
    <>
      {/* Floating Edit Mode Controls Button - Only visible in edit mode */}
      {isEditMode && (
        <button
          onClick={() => setShowWelcomeModalConfig(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9999] bg-yellow-400 text-gray-900 p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300"
          title="Configurações do Modo de Edição"
        >
          <Settings className="h-6 w-6" />
        </button>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Firebase Sync Log Modal */}
      {showSyncLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Log de Sincronização com Firebase
              </h3>
              <button 
                onClick={() => setShowSyncLog(false)}
                className="text-gray-400 hover:text-white"
                disabled={isSyncing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-4 mb-4">
              {syncLogs.length > 0 ? (
                <div className="space-y-2">
                  {syncLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded text-sm flex items-start ${
                        log.type === 'success' ? 'bg-green-900/30 text-green-300' :
                        log.type === 'error' ? 'bg-red-900/30 text-red-300' :
                        log.type === 'warning' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-blue-900/30 text-blue-300'
                      }`}
                    >
                      <span className="font-mono text-xs mr-2">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {isSyncing ? "Aguardando início da sincronização..." : "Nenhum log disponível"}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {syncLogs.length} eventos registrados
              </div>
              <Button
                onClick={() => setShowSyncLog(false)}
                variant="outline"
                className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                disabled={isSyncing}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editar Imagem do Banner
              </h3>
              <button 
                onClick={() => {
                  setShowImageUpload(false)
                  setPreviewImage(null)
                  setSelectedFile(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">
                  Banner: {getBannerTitle(selectedBanner)}
                </p>
                <p className="text-xs text-gray-400">
                  {getBannerConfigInfo(selectedBanner)}
                </p>
              </div>
              
              {/* Device Selection */}
              <div className="bg-gray-800 rounded-md p-3">
                <label className="text-sm font-medium text-gray-200 mb-2 block">Selecionar Dispositivo</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedDevice('desktop')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${{
                      'desktop': 'bg-blue-600 text-white',
                      'mobile': 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                      'both': 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }[selectedDevice]}`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setSelectedDevice('mobile')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${{
                      'desktop': 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                      'mobile': 'bg-blue-600 text-white',
                      'both': 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }[selectedDevice]}`}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setSelectedDevice('both')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${{
                      'desktop': 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                      'mobile': 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                      'both': 'bg-blue-600 text-white'
                    }[selectedDevice]}`}
                  >
                    Ambos
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedDevice === 'desktop' && 'Imagem será exibida apenas em dispositivos desktop'}
                  {selectedDevice === 'mobile' && 'Imagem será exibida apenas em dispositivos mobile'}
                  {selectedDevice === 'both' && 'Imagem será exibida em todos os dispositivos'}
                </p>
              </div>
              
              {/* Delay Warning */}
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-md p-3">
                <p className="text-xs text-yellow-200 flex items-start">
                  <span className="mr-2 mt-0.5 flex-shrink-0">⚠️</span>
                  <span>Pode haver um pequeno delay após o upload até a imagem aparecer em todos os dispositivos.</span>
                </p>
              </div>
              
              {/* Preview Area */}
              {previewImage && (
                <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <h4 className="text-sm font-medium text-gray-200 mb-2">Preview</h4>
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded border border-gray-600"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Preview da Imagem</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Enviando..." : "Selecionar Imagem"}
                </Button>
                
                {previewImage && (
                  <Button
                    onClick={handleUploadImage}
                    disabled={uploading}
                    className="w-full bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {uploading ? "Enviando..." : "Confirmar e Salvar"}
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setShowImageUpload(false)
                    setPreviewImage(null)
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  variant="outline"
                  className="w-full border-gray-600 text-black hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal Configuration Modal */}
      {showWelcomeModalConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Configurações do Modal de Boas-Vindas
              </h3>
              <button 
                onClick={() => setShowWelcomeModalConfig(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configurações */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurações
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Banner Height Manager */}
                    <BannerHeightManager />
                    
                    {/* Ativar/Desativar */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">Sistema Ativo</span>
                      <button
                        onClick={() => updateNotificationSetting('enabled', !notificationSettings.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${
                            notificationSettings.enabled ? 'bg-blue-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </span>
                      </button>
                    </div>
                    {/* Ativar/Desativar */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">Modal Ativo</span>
                      <button
                        onClick={() => updateWelcomeModalConfig('enabled', !welcomeModalConfig.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${
                            welcomeModalConfig.enabled ? 'bg-blue-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              welcomeModalConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </span>
                      </button>
                    </div>

                    {/* Tempo de Exibição */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium flex items-center gap-2 text-gray-200">
                        <Clock className="h-4 w-4" />
                        Tempo de Exibição (segundos)
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={welcomeModalConfig.displayTime}
                        onChange={(e) => updateWelcomeModalConfig('displayTime', parseInt(e.target.value) || 4)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                      />
                    </div>

                    {/* Título */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-200">Título Principal</span>
                      <input
                        value={welcomeModalConfig.title}
                        onChange={(e) => updateWelcomeModalConfig('title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                        placeholder="Ex: Seja bem-vindo"
                      />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-200">Descrição</span>
                      <textarea
                        value={welcomeModalConfig.description}
                        onChange={(e) => updateWelcomeModalConfig('description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                        rows={3}
                        placeholder="Descrição do modal..."
                      />
                    </div>

                    {/* Texto do Botão */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-200">Texto do Botão</span>
                      <input
                        value={welcomeModalConfig.buttonText}
                        onChange={(e) => updateWelcomeModalConfig('buttonText', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                        placeholder="Ex: Explorar Loja"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview do Modal */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview do Modal
                  </h4>
                  
                  {/* Preview do modal de boas-vindas */}
                  <div className="border border-gray-700 rounded-lg p-6 bg-gradient-to-br from-gray-900 to-black text-white">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <img
                          src="/IMG_2586 2.svg"
                          alt="Gang BoyZ"
                          width={120}
                          height={60}
                          className="drop-shadow-[0_0_30px_rgba(239,68,68,0.3)] mx-auto"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{welcomeModalConfig.title}</h3>
                        <div className="w-12 h-1 bg-red-600 mx-auto rounded-full my-2"></div>
                      </div>
                      <p className="text-sm text-white/80">
                        {welcomeModalConfig.description}
                      </p>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 has-[>svg]:px-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25">
                        {welcomeModalConfig.buttonText}
                      </button>
                      <div className="pt-4">
                        <div className="w-20 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                          <div 
                            className="h-full bg-red-600 rounded-full"
                            style={{ width: `${100 - (100 / welcomeModalConfig.displayTime) * 2}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Fechará automaticamente em {welcomeModalConfig.displayTime}s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Improved Organization */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                {/* Banner Editing Section */}
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Banners</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        setShowWelcomeModalConfig(false)
                        openImageUpload('hero-banner-1')
                      }}
                      variant="outline"
                      className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar Banner Hero 1</span>
                      <span className="sm:hidden">Hero 1</span>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setShowWelcomeModalConfig(false)
                        openImageUpload('hero-banner-2')
                      }}
                      variant="outline"
                      className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar Banner Hero 2</span>
                      <span className="sm:hidden">Hero 2</span>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setShowWelcomeModalConfig(false)
                        openImageUpload('offers-banner')
                      }}
                      variant="outline"
                      className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar Banner Ofertas</span>
                      <span className="sm:hidden">Ofertas</span>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setShowWelcomeModalConfig(false)
                        // Open image editor for footer banner
                        openImageUpload('footer-banner')
                      }}
                      variant="outline"
                      className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar Banner Footer</span>
                      <span className="sm:hidden">Footer</span>
                    </Button>
                    
                    {/* Botão para editar a faixa de aviso */}
                    <Button
                      onClick={() => {
                        console.log('Botão Editar Faixa de Aviso clicado')
                        setShowWelcomeModalConfig(false)
                        // Dispatch event to open banner strip editor
                        console.log('Disparando evento openBannerStripEditor')
                        // Adicionar um pequeno atraso para garantir que o listener esteja registrado
                        setTimeout(() => {
                          const event = new CustomEvent('openBannerStripEditor', {
                            detail: { source: 'edit-mode-controls' }
                          })
                          window.dispatchEvent(event)
                          console.log('Evento openBannerStripEditor disparado')
                        }, 100)
                      }}
                      variant="outline"
                      className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar Faixa de Aviso</span>
                      <span className="sm:hidden">Faixa</span>
                    </Button>
                  </div>
                </div>
                
                {/* Configuration Section */}
                <div className="w-full flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Configurações</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setShowNotificationConfig(true)}
                        variant="outline"
                        className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                      >
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notificações</span>
                        <span className="sm:hidden">Notif.</span>
                      </Button>
                      
                      <Button
                        onClick={() => setShowThemeConfig(true)}
                        variant="outline"
                        className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                      >
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Temas</span>
                        <span className="sm:hidden">Temas</span>
                      </Button>
                      
                      {/* Firebase Sync Button */}
                      <Button
                        onClick={handleFirebaseSync}
                        variant="outline"
                        className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                        disabled={isSyncing}
                      >
                        <CloudUpload className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {isSyncing ? "Sincronizando..." : "Sincronizar Firebase"}
                        </span>
                        <span className="sm:hidden">
                          {isSyncing ? "Sync..." : "Firebase"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Close Button */}
                <div className="w-full mt-2 pt-2 border-t border-gray-700">
                  <Button
                    onClick={() => setShowWelcomeModalConfig(false)}
                    variant="outline"
                    className="flex items-center gap-2 text-gray-900 dark:text-gray-100 ml-auto"
                  >
                    <X className="h-4 w-4" />
                    <span>Fechar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Configuration Modal */}
      {showNotificationConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações de Compra
              </h3>
              <button 
                onClick={() => setShowNotificationConfig(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configurações */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurações
                  </h4>
                  <div className="space-y-4">
                    {/* Ativar/Desativar */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">Sistema Ativo</span>
                      <button
                        onClick={() => updateNotificationSetting('enabled', !notificationSettings.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${
                            notificationSettings.enabled ? 'bg-blue-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </span>
                      </button>
                    </div>

                    {/* Intervalo */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium flex items-center gap-2 text-gray-200">
                        <Clock className="h-4 w-4" />
                        Intervalo entre notificações (segundos)
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={notificationSettings.interval}
                        onChange={(e) => updateNotificationSetting('interval', parseInt(e.target.value) || 8)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                      />
                    </div>

                    {/* Duração */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-200">
                        Duração de exibição (segundos)
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={notificationSettings.duration}
                        onChange={(e) => updateNotificationSetting('duration', parseInt(e.target.value) || 3)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                      />
                    </div>

                    {/* Máximo de notificações */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-200">
                        Máximo de notificações
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={notificationSettings.maxNotifications}
                        onChange={(e) => updateNotificationSetting('maxNotifications', parseInt(e.target.value) || 10)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                      />
                    </div>

                    {/* Mostrar Nickname */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">Mostrar Nickname</span>
                      <button
                        onClick={() => updateNotificationSetting('showNickname', !notificationSettings.showNickname)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${
                            notificationSettings.showNickname ? 'bg-blue-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              notificationSettings.showNickname ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </span>
                      </button>
                    </div>

                    {/* Mostrar ID do Produto */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">Mostrar ID do Produto</span>
                      <button
                        onClick={() => updateNotificationSetting('showProductId', !notificationSettings.showProductId)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${
                            notificationSettings.showProductId ? 'bg-blue-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              notificationSettings.showProductId ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </span>
                      </button>
                    </div>

                    {/* Mostrar Preço */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">Mostrar Preço</span>
                      <button
                        onClick={() => updateNotificationSetting('showPrice', !notificationSettings.showPrice)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${
                            notificationSettings.showPrice ? 'bg-blue-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              notificationSettings.showPrice ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </span>
                      </button>
                    </div>

                    {/* Mensagem Personalizada */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium flex items-center gap-2 text-gray-200">
                        <MessageSquare className="h-4 w-4" />
                        Mensagem Personalizada
                      </span>
                      <input
                        value={notificationSettings.customMessage}
                        onChange={(e) => updateNotificationSetting('customMessage', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white"
                        placeholder="Ex: acabou de comprar"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview e Ações */}
                <div className="space-y-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview da Notificação
                    </h4>
                    
                    {/* Preview da notificação */}
                    <div className="bg-black/80 backdrop-blur-sm border border-gray-600/30 rounded-lg shadow-lg p-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-300 leading-tight">
                            {notificationSettings.showNickname && (
                              <span className="font-medium text-white">Usuário Teste</span>
                            )}
                            {notificationSettings.showNickname && " "}
                            {notificationSettings.customMessage || "comprou"}{" "}
                            <span className="text-gray-200">Produto de Teste</span>
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {notificationSettings.showProductId && (
                              <span className="text-xs text-gray-400 font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-[10px]">
                                TEST001
                              </span>
                            )}
                            {notificationSettings.showPrice && (
                              <span className="text-xs font-medium text-green-400">
                                R$ 99,90
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button className="text-gray-400 hover:text-gray-200 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-100 mb-4">Ações</h4>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={testNotification}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Testar Notificação
                      </Button>
                      
                      <Button
                        onClick={saveNotificationSettings}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Salvar Configurações
                      </Button>
                      
                      <Button
                        onClick={resetNotificationSettings}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Resetar para Padrão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    setShowNotificationConfig(false)
                    setShowWelcomeModalConfig(true)
                  }}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                >
                  <Eye className="h-4 w-4" />
                  Configurar Modal
                </Button>
                
                <Button
                  onClick={() => setShowThemeConfig(true)}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                >
                  <Palette className="h-4 w-4" />
                  Configurar Temas
                </Button>
                
                <Button
                  onClick={() => setShowNotificationConfig(false)}
                  variant="outline"
                  className="ml-auto text-gray-900 dark:text-gray-100"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Configuration Modal */}
      {showThemeConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Configurações de Temas
              </h3>
              <button 
                onClick={() => setShowThemeConfig(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-8800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-100 mb-4">Tema Atual</h4>
                
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ 
                        backgroundColor: activeTheme === "dark-red" 
                          ? "#8B0000" 
                          : "#FF1744" 
                      }}
                    ></div>
                    <div>
                      <div className="font-medium text-white">
                        {activeTheme === "dark-red" 
                          ? "Vermelho Sangue" 
                          : "Vermelho Vibrante"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {activeTheme === "dark-red" 
                          ? "Vermelho escuro e elegante" 
                          : "Vermelho vibrante e chamativo"}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Ativo
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-100 mb-4">Temas Disponíveis</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <div 
                      key={theme.id}
                      className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                        activeTheme === theme.id 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => applyThemeById(theme.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-100">{theme.name}</h5>
                        {activeTheme === theme.id ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Ativo
                          </span>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              applyThemeById(theme.id)
                            }}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                          >
                            Escolher Tema
                          </button>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-4">{theme.description}</p>
                      
                      <div className="space-y-2">
                        <h6 className="text-xs font-medium text-gray-500">Paleta de Cores</h6>
                        <div className="flex gap-2">
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: theme.colors.primary }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">Principal</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: theme.colors.primaryHover }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">Hover</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ 
                                background: `linear-gradient(to right, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`
                              }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">Gradiente</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    setShowThemeConfig(false)
                    setShowWelcomeModalConfig(true)
                  }}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                >
                  <Eye className="h-4 w-4" />
                  Configurar Modal
                </Button>
                
                <Button
                  onClick={() => setShowNotificationConfig(true)}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
                >
                  <Bell className="h-4 w-4" />
                  Configurar Notificações
                </Button>
                
                <Button
                  onClick={() => setShowThemeConfig(false)}
                  variant="outline"
                  className="ml-auto text-gray-900 dark:text-gray-100"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}