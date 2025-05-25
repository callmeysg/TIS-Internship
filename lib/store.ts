import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Item } from "./types"

interface CartStore {
  items: CartItem[]
  addItem: (item: Item, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: Item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((cartItem) => cartItem.item.id === item.id)

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
              ),
            }
          }

          return {
            items: [...state.items, { item, quantity }],
          }
        })
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((cartItem) => cartItem.item.id !== itemId),
        }))
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((cartItem) => (cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalAmount: () => {
        return get().items.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, cartItem) => total + cartItem.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
