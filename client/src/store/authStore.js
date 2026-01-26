import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })
          
          const data = await response.json()
          
          if (data.success) {
            set({ user: data.user, token: data.token, isLoading: false })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: data.error }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'Network error' }
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          })
          
          const data = await response.json()
          
          if (data.success) {
            set({ user: data.user, token: data.token, isLoading: false })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: data.error }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'Network error' }
        }
      },
      
      logout: () => {
        set({ user: null, token: null })
      },
      
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
)