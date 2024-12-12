// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        console.log('Setting auth:', { user, token })
        localStorage.setItem('token', token)
        set({ user, token })
      },
      clearAuth: () => {
        console.log('Clearing auth')
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
      isAuthenticated: () => {
        const state = get()
        const isAuth = !!state.token
        console.log('Checking auth:', { 
          token: state.token,
          user: state.user,
          isAuth 
        })
        return isAuth
      },
      isAdmin: () => {
        const state = get()
        const admin = state.user?.role === 'admin'
        console.log('Checking admin:', { 
          user: state.user,
          isAdmin: admin 
        })
        return admin
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
