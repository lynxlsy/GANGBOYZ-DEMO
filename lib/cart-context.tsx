"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }
    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: number
  totalPrice: number
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("gang-boyz-cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item })
      })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gang-boyz-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
