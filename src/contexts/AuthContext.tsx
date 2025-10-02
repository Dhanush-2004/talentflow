import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import { authService } from '../services/authService'
import { storageService } from '../services/storageService'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
            storageService.setItem('current_user', userData)
          } catch (e) {
            // Token exists but /me not ready or unauthorized (dev race) — fallback silently
            const cached = storageService.getItem<User>('current_user', null as unknown as User)
            if (cached) setUser(cached)
          }
        } else {
          const cachedUser = storageService.getItem<User>('current_user', null as unknown as User)
          if (cachedUser) {
            setUser(cachedUser)
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        localStorage.removeItem('token')
        storageService.removeItem('current_user')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { user: userData, token } = await authService.login(email, password)
      localStorage.setItem('token', token)
      setUser(userData)
      storageService.setItem('current_user', userData)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      setLoading(true)
      const { user: userData, token } = await authService.signup(name, email, password, role)
      localStorage.setItem('token', token)
      setUser(userData)
      storageService.setItem('current_user', userData)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('current_user_id')
    setUser(null)
    storageService.removeItem('current_user')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData }
      setUser(updated)
      storageService.setItem('current_user', updated)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
