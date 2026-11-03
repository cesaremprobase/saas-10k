'use client'

import { useState, useEffect, useCallback } from 'react'
import { SystemUser, UserRole } from '../types'

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
    createdAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'usr-op-01',
    name: 'Ventas TikTok / Despacho',
    email: 'ventas@tikship.pe',
    phone: '900475318',
    role: 'OPERATOR',
    active: true,
    createdAt: '2026-11-02T00:00:00.000Z',
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
    const handleUpdate = () => setTick((t) => t + 1)
    listeners.push(handleUpdate)
    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate)
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

  const logout = useCallback(() => {
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
    loginAs,
    loginWithEmail,
    logout,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  }
}
