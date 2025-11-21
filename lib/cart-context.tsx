"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
// import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore"
// import { db } from "@/lib/firebase-config"
import { useUser } from "./user-context"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  selected?: boolean
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "TOGGLE_ITEM_SELECTION"; payload: number }
  | { type: "SELECT_ALL_ITEMS" }
  | { type: "DESELECT_ALL_ITEMS" }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Create a function to check if two items are the same (same id, size, and color)
      const isSameItem = (item1: CartItem, item2: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        return item1.id === item2.id && 
               item1.size === item2.size && 
               item1.color === item2.color;
      };
      
      // Find existing item with same id, size, and color
      const existingItem = state.items.find((item) => isSameItem(item, action.payload));
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            isSameItem(item, action.payload)
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1, selected: action.payload.selected !== undefined ? action.payload.selected : true }],
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
    case "TOGGLE_ITEM_SELECTION":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, selected: !item.selected } : item,
        ),
      }
    case "SELECT_ALL_ITEMS":
      return {
        ...state,
        items: state.items.map((item) => ({ ...item, selected: true })),
      }
    case "DESELECT_ALL_ITEMS":
      return {
        ...state,
        items: state.items.map((item) => ({ ...item, selected: false })),
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
  toggleItemSelection: (id: number) => void
  selectAllItems: () => void
  deselectAllItems: () => void
  clearCart: () => void
  processCheckout: (items: CartItem[]) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: number
  totalPrice: number
  selectedItems: CartItem[]
  selectedItemsCount: number
  selectedItemsPrice: number
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })
  const { user } = useUser()

  // Load cart from localStorage on mount (fallback)
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    const savedCart = localStorage.getItem("gang-boyz-cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.forEach((item: CartItem) => {
        // Ensure items have the selected property
        const itemWithSelection = { ...item, selected: item.selected !== undefined ? item.selected : true };
        dispatch({ type: "ADD_ITEM", payload: itemWithSelection })
      })
    }
  }, [])

  // Sync cart with Firebase when user is logged in
  // useEffect(() => {
  //   if (!user) return

  //   let isMounted = true
  //   let unsubscribe: (() => void) | null = null

  //   const connectToFirebase = async () => {
  //     try {
  //       const cartRef = doc(db, 'carts', user.id)
  //       
  //       // Listen to cart changes in Firebase
  //       unsubscribe = onSnapshot(cartRef, (doc) => {
  //         if (!isMounted) return
  //         
  //         if (doc.exists()) {
  //           const cartData = doc.data()
  //           if (cartData?.items) {
  //             // Update local state with Firebase data
  //             dispatch({ type: "CLEAR_CART" })
  //             cartData.items.forEach((item: CartItem) => {
  //               dispatch({ type: "ADD_ITEM", payload: item })
  //             })
  //           }
  //         }
  //       }, (error) => {
  //         if (!isMounted) return
  //         console.error('Erro ao escutar mudanças no carrinho:', error)
  //       })
  //     } catch (error) {
  //       if (!isMounted) return
  //       console.error('Erro ao conectar carrinho com Firebase:', error)
  //     }
  //   }

  //   connectToFirebase()

  //   return () => {
  //     isMounted = false
  //     if (unsubscribe) {
  //       try {
  //         unsubscribe()
  //       } catch (error) {
  //         console.error('Erro ao desconectar carrinho do Firebase:', error)
  //       }
  //     }
  //   }
  // }, [user])

  // Save cart to Firebase when user is logged in
  // useEffect(() => {
  //   if (!user || state.items.length === 0) return

  //   const cartRef = doc(db, 'carts', user.id)
  //   setDoc(cartRef, {
  //     items: state.items,
  //     updatedAt: new Date()
  //   }).catch(error => {
  //     console.error('Erro ao salvar carrinho no Firebase:', error)
  //   })
  // }, [state.items, user])

  // Save cart to localStorage as fallback
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
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

  // Function to process checkout and update product stocks
  const processCheckout = (items: CartItem[]) => {
    // Store selected items in localStorage for checkout page to access
    if (typeof window !== 'undefined') {
      localStorage.setItem('gang-boyz-checkout-items', JSON.stringify(items))
    }
    
    // Remove selected items from cart but keep unselected items
    const selectedIds = items.map(item => item.id)
    selectedIds.forEach(id => {
      dispatch({ type: "REMOVE_ITEM", payload: id })
    })
    
    // In the future, this will call updateProductStockAfterPurchase
    // to reduce the stock of purchased items
  }

  const toggleItemSelection = (id: number) => {
    dispatch({ type: "TOGGLE_ITEM_SELECTION", payload: id })
  }

  const selectAllItems = () => {
    dispatch({ type: "SELECT_ALL_ITEMS" })
  }

  const deselectAllItems = () => {
    dispatch({ type: "DESELECT_ALL_ITEMS" })
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
  
  // Selected items calculations
  const selectedItems = state.items.filter(item => item.selected !== undefined ? item.selected : true)
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedItemsPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        toggleItemSelection,
        selectAllItems,
        deselectAllItems,
        clearCart,
        processCheckout,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
        selectedItems,
        selectedItemsCount,
        selectedItemsPrice,
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
