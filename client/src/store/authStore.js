import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE_URL } from '../config/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
          console.error('Login error:', error)
          // Demo mode fallback
          if (credentials.email === 'demo@linguatrade.com' || 
              credentials.email === 'vendor@demo.com' || 
              credentials.email === 'buyer@demo.com') {
            const demoUser = {
              id: 'demo-user-' + Date.now(),
              email: credentials.email,
              name: credentials.email.includes('vendor') ? 'Demo Vendor' : 'Demo Buyer',
              userType: credentials.email.includes('vendor') ? 'vendor' : 'buyer',
              languages: ['en', 'es'],
              location: 'Demo City, Demo Country',
              rating: 4.8,
              completedTrades: 42
            }
            set({ user: demoUser, token: 'demo-token', isLoading: false })
            return { success: true }
          }
          
          set({ isLoading: false })
          return { success: false, error: 'Network error - using demo mode' }
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
          console.error('Registration error:', error)
          // Demo mode fallback
          const demoUser = {
            id: 'demo-user-' + Date.now(),
            email: userData.email,
            name: userData.name,
            userType: userData.userType,
            languages: userData.languages || ['en'],
            location: userData.location,
            rating: 5.0,
            completedTrades: 0,
            createdAt: new Date()
          }
          set({ user: demoUser, token: 'demo-token', isLoading: false })
          return { success: true }
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