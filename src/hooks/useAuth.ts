// src/hooks/useAuth.ts
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api'

export function useAuth() {
  const navigate = useNavigate()
  const { setAuth, clearAuth, isAuthenticated, isAdmin } = useAuthStore()

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)
      setAuth(response.user, response.access_token)
      navigate('/dashboard')
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to login')
    }
  }

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return {
    login,
    logout,
    isAuthenticated,
    isAdmin
  }
}