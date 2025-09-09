"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextType {
  activeTheme: string
  applyTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<string>("dark-red")

  useEffect(() => {
    // Carregar tema salvo
    const savedTheme = localStorage.getItem("gang-boyz-active-theme")
    if (savedTheme) {
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (themeId: string) => {
    const themes = {
      "dark-red": {
        primaryColor: "#8B0000",
        primaryHover: "#660000",
        gradientFrom: "#8B0000",
        gradientTo: "#4A0000",
        glowColor: "rgba(139, 0, 0, 0.2)"
      },
      "vibrant-red": {
        primaryColor: "#FF1744",
        primaryHover: "#E91E63",
        gradientFrom: "#FF1744",
        gradientTo: "#D50000",
        glowColor: "rgba(255, 23, 68, 0.8)"
      }
    }

    const theme = themes[themeId as keyof typeof themes]
    if (!theme) return

    // Aplicar variáveis CSS
    const root = document.documentElement
    root.style.setProperty('--primary-color', theme.primaryColor)
    root.style.setProperty('--primary-hover', theme.primaryHover)
    root.style.setProperty('--gradient-from', theme.gradientFrom)
    root.style.setProperty('--gradient-to', theme.gradientTo)
    root.style.setProperty('--glow-color', theme.glowColor)

    // Salvar tema ativo
    localStorage.setItem("gang-boyz-active-theme", themeId)
    setActiveTheme(themeId)
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
