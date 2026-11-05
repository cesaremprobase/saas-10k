'use client'

import { useState, useEffect, useCallback } from 'react'
import { SystemUser, UserRole } from '../types'
import { createClient } from '@/lib/supabase/client'

function isSupabaseConfigured(): boolean {
  if (typeof window === 'undefined') return false
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(
    url &&
    url.startsWith('http') &&
    !url.includes('your_supabase_url') &&
    key &&
    !key.includes('your_supabase_anon_key')
  )
}

const STORAGE_USERS_KEY = 'tikship_users'
const STORAGE_CURRENT_USER_KEY = 'tikship_current_user'

const DEFAULT_USERS: SystemUser[] = [
  {
    id: 'usr-admin-01',
    name: 'Administrador Principal',
    email: 'admin@tikship.pe',
    phone: '900475318',
    role: 'ADMIN',
    active: true,
    authProvider: 'google',
    createdAt: '2026-11-01T00:00:00.000Z',
  },
]

type Listener = () => void
let memoryUsers: SystemUser[] = DEFAULT_USERS
let memoryCurrentUser: SystemUser | null = DEFAULT_USERS[0]
let listeners: Listener[] = []

function notify() {
  listeners.forEach((l) => l())
}

function saveToLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(memoryUsers))
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(memoryCurrentUser))
    } catch {
      // ignore storage error
    }
  }
}

function loadFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const savedUsers = localStorage.getItem(STORAGE_USERS_KEY)
      if (savedUsers) {
        memoryUsers = JSON.parse(savedUsers)
      }
      const savedCurrentUser = localStorage.getItem(STORAGE_CURRENT_USER_KEY)
      if (savedCurrentUser) {
        memoryCurrentUser = JSON.parse(savedCurrentUser)
      } else if (!savedUsers) {
        memoryCurrentUser = DEFAULT_USERS[0]
      }
    } catch {
      // fallback to memory
    }
  }
}

// Carga inicial al importar
loadFromLocalStorage()

export function useAuthStore() {
  const [, setTick] = useState(0)

  useEffect(() => {
    loadFromLocalStorage()

    // Sincronizar sesión de Google con Supabase Auth si está configurado
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && user.email) {
          const userEmail = user.email.toLowerCase()
          const existing = memoryUsers.find((u) => u.email.toLowerCase() === userEmail)
          if (existing) {
            memoryCurrentUser = existing
          } else {
            const newUser: SystemUser = {
              id: user.id,
              name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email.split('@')[0],
              email: user.email,
              phone: user.user_metadata?.phone || '900475318',
              role: memoryUsers.length <= 1 ? 'ADMIN' : 'OPERATOR',
              active: true,
              authProvider: 'google',
              avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
              createdAt: new Date().toISOString(),
            }
            memoryUsers = [newUser, ...memoryUsers]
            memoryCurrentUser = newUser
          }
          saveToLocalStorage()
          notify()
        }
      })
    }

    const handleUpdate = () => setTick((t) => t + 1)
    listeners.push(handleUpdate)
    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) {
        return { error: error.message }
      }
      return { error: undefined, isRedirecting: true }
    } else {
      // Modo local/demo interactivo: inicia sesión como cuenta de Google
      const googleEmail = 'usuario.google@gmail.com'
      const existing = memoryUsers.find((u) => u.email.toLowerCase() === googleEmail)
      let targetUser = existing
      if (!targetUser) {
        targetUser = {
          id: `usr-google-${Date.now().toString(36)}`,
          name: 'Usuario Google',
          email: googleEmail,
          phone: '900475318',
          role: 'ADMIN',
          active: true,
          authProvider: 'google',
          avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
          createdAt: new Date().toISOString(),
        }
        memoryUsers = [targetUser, ...memoryUsers]
      }
      memoryCurrentUser = targetUser
      saveToLocalStorage()
      notify()
      return { error: undefined, isRedirecting: false }
    }
  }, [])

  const loginAs = useCallback((user: SystemUser) => {
    memoryCurrentUser = user
    saveToLocalStorage()
    notify()
  }, [])

  const loginWithEmail = useCallback((email: string) => {
    const cleanEmail = email.trim().toLowerCase()
    const found = memoryUsers.find((u) => u.email.toLowerCase() === cleanEmail && u.active)
    if (found) {
      memoryCurrentUser = found
      saveToLocalStorage()
      notify()
      return true
    }
    return false
  }, [])

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
    }
    memoryCurrentUser = null
    saveToLocalStorage()
    notify()
  }, [])

  const addUser = useCallback((userData: Omit<SystemUser, 'id' | 'createdAt'>): SystemUser => {
    const newUser: SystemUser = {
      ...userData,
      id: `usr-${Date.now().toString(36)}`,
      phone: userData.phone.replace(/[^0-9]/g, ''),
      createdAt: new Date().toISOString(),
    }
    memoryUsers = [newUser, ...memoryUsers]
    saveToLocalStorage()
    notify()
    return newUser
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<SystemUser>) => {
    memoryUsers = memoryUsers.map((u) => (u.id === id ? { ...u, ...updates } : u))
    if (memoryCurrentUser?.id === id) {
      memoryCurrentUser = { ...memoryCurrentUser, ...updates }
    }
    saveToLocalStorage()
    notify()
  }, [])

  const toggleUserStatus = useCallback((id: string) => {
    memoryUsers = memoryUsers.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    saveToLocalStorage()
    notify()
  }, [])

  const deleteUser = useCallback((id: string) => {
    if (id === 'usr-admin-01') return
    memoryUsers = memoryUsers.filter((u) => u.id !== id)
    saveToLocalStorage()
    notify()
  }, [])

  return {
    currentUser: memoryCurrentUser,
    users: memoryUsers,
    signInWithGoogle,
    loginAs,
    loginWithEmail,
    logout,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  }
}
