"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { logout as apiLogout, getCurrentUser } from "@/lib/api/auth-client"
import { getAuthToken, clearAuthToken, getStoredUser } from "@/lib/api/auth-config"

export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    // Try to get user from localStorage first
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
      setIsLoading(false)
      return
    }

    // Fallback to API call if no stored user
    try {
      const userData = await getCurrentUser(token)
      setUser(userData)
    } catch (error) {
      console.error("Failed to load user:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const logout = async () => {
    const token = getAuthToken()
    await apiLogout(token)
    clearAuthToken()
    setUser(null)
  }

  const refreshUser = async () => {
    await loadUser()
  }

  return (
    <UserContext.Provider value={{ user, isLoading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
