"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, Package, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="text-white hover:bg-white/10 flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5" />
        <span className="hidden md:block">{user.name}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-gray-800">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded">
                <Package className="h-4 w-4" />
                <span>Meus Pedidos</span>
              </button>

              <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </button>

              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
