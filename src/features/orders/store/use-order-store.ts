'use client'

import { useState, useEffect, useCallback } from 'react'
import { OrderItem, SenderProfile } from '../types'

const STORAGE_ORDERS_KEY = 'tikship_active_orders'
const STORAGE_SENDER_KEY = 'tikship_sender_profile'

export const DEFAULT_SENDER: SenderProfile = {
  businessName: 'TIKTOK SHOP PERU',
  docType: 'RUC',
  docNumber: '20601234567',
  phone: '900475318',
  originDepartment: 'LIMA',
  originProvince: 'LIMA',
  originAgency: 'AGENCIA GRAU CENTRAL (LIM-GRAU)',
}

// Global subscribers for multi-component reactivity without Zustand
type Listener = () => void
let memoryOrders: OrderItem[] = []
let memorySender: SenderProfile = DEFAULT_SENDER
let listeners: Listener[] = []

function notify() {
  listeners.forEach((l) => l())
}

function saveToLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(memoryOrders))
    localStorage.setItem(STORAGE_SENDER_KEY, JSON.stringify(memorySender))
  }
}

function loadFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const savedOrders = localStorage.getItem(STORAGE_ORDERS_KEY)
      if (savedOrders) {
        memoryOrders = JSON.parse(savedOrders)
      }
      const savedSender = localStorage.getItem(STORAGE_SENDER_KEY)
      if (savedSender) {
        const parsed = JSON.parse(savedSender)
        if (parsed.phone === '999888777' || parsed.phone === '9000475318') {
          parsed.phone = '900475318'
          localStorage.setItem(STORAGE_SENDER_KEY, JSON.stringify(parsed))
        }
        memorySender = parsed
      }
    } catch {
      // fallback to memory
    }
  }
}

export function useOrderStore() {
  const [, setTick] = useState(0)

  useEffect(() => {
    loadFromLocalStorage()
    const handleUpdate = () => setTick((t) => t + 1)
    listeners.push(handleUpdate)
    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate)
    }
  }, [])

  const addOrder = useCallback((order: Omit<OrderItem, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const nextNum = (memoryOrders.length + 1).toString().padStart(3, '0')
    const newOrder: OrderItem = {
      ...order,
      id: crypto.randomUUID ? crypto.randomUUID() : `tk-${Date.now()}-${Math.random()}`,
      orderNumber: `TK-${nextNum}`,
      status: 'validated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    memoryOrders = [newOrder, ...memoryOrders]
    saveToLocalStorage()
    notify()
  }, [])

  const addBulkOrders = useCallback(
    (orders: Omit<OrderItem, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>[]) => {
      const created: OrderItem[] = orders.map((ord, idx) => {
        const nextNum = (memoryOrders.length + idx + 1).toString().padStart(3, '0')
        return {
          ...ord,
          id: crypto.randomUUID ? crypto.randomUUID() : `tk-${Date.now()}-${idx}`,
          orderNumber: `TK-${nextNum}`,
          status: 'validated',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
      memoryOrders = [...created, ...memoryOrders]
      saveToLocalStorage()
      notify()
    },
    []
  )

  const removeOrder = useCallback((id: string) => {
    memoryOrders = memoryOrders.filter((o) => o.id !== id)
    saveToLocalStorage()
    notify()
  }, [])

  const clearAllOrders = useCallback(() => {
    memoryOrders = []
    saveToLocalStorage()
    notify()
  }, [])

  const updateSender = useCallback((sender: SenderProfile) => {
    memorySender = sender
    saveToLocalStorage()
    notify()
  }, [])

  const markAllAsLabeled = useCallback(() => {
    memoryOrders = memoryOrders.map((o) => ({ ...o, status: 'labeled' as const }))
    saveToLocalStorage()
    notify()
  }, [])

  const markAllAsExported = useCallback(() => {
    memoryOrders = memoryOrders.map((o) => ({ ...o, status: 'exported' as const }))
    saveToLocalStorage()
    notify()
  }, [])

  return {
    orders: memoryOrders,
    sender: memorySender,
    addOrder,
    addBulkOrders,
    removeOrder,
    clearAllOrders,
    updateSender,
    markAllAsLabeled,
    markAllAsExported,
  }
}

