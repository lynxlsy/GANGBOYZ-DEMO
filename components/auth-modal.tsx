"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const { login, signup } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let result
      if (mode === "login") {
        result = await login(formData.email, formData.password)
      } else {
        result = await signup(formData.email, formData.password, formData.name)
      }

      if (result.success) {
        onClose()
        setFormData({ email: "", password: "", name: "" })
      } else {
        setError(result.error || "Ocorreu um erro")
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg z-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {mode === "login" ? "Bem-vindo de Volta" : "Junte-se ao Gang BoyZ"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Demo Credentials */}
          {mode === "login" && (
            <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Credenciais de demonstração:</p>
              <p className="text-xs text-white">Email: derick@gangboyz.com</p>
              <p className="text-xs text-white">Senha: codeforge123</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-white">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                placeholder="Digite seu email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 pr-10"
                  placeholder="Digite sua senha"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded border border-red-400/20">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "login" ? "Entrando..." : "Criando Conta..."}
                </>
              ) : (
                <>{mode === "login" ? "Entrar" : "Criar Conta"}</>
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login")
                  setError("")
                  setFormData({ email: "", password: "", name: "" })
                }}
                className="text-white hover:text-gray-300 font-medium underline"
              >
                {mode === "login" ? "Cadastre-se" : "Entrar"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
