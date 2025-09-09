"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("gang-boyz-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })
      } catch {
        localStorage.removeItem("gang-boyz-user")
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } else {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "derick@gangboyz.com" && password === "codeforge123") {
      const user: User = {
        id: "1",
        email,
        name: "Cliente Derick",
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("gang-boyz-user", JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      return { success: true }
    }

    // Check if user exists in localStorage (for demo purposes)
    const existingUsers = JSON.parse(localStorage.getItem("gang-boyz-users") || "[]")
    const user = existingUsers.find((u: any) => u.email === email && u.password === password)

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem("gang-boyz-user", JSON.stringify(userWithoutPassword))
      setState({
        user: userWithoutPassword,
        isLoading: false,
        isAuthenticated: true,
      })
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("gang-boyz-users") || "[]")
    if (existingUsers.find((u: any) => u.email === email)) {
      return { success: false, error: "User already exists with this email" }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      name,
      createdAt: new Date().toISOString(),
    }

    // Save to users list
    existingUsers.push(newUser)
    localStorage.setItem("gang-boyz-users", JSON.stringify(existingUsers))

    // Set as current user
    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem("gang-boyz-user", JSON.stringify(userWithoutPassword))
    setState({
      user: userWithoutPassword,
      isLoading: false,
      isAuthenticated: true,
    })

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("gang-boyz-user")
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
