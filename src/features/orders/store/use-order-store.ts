'use client'

import { useState, useEffect, useCallback } from 'react'
import { OrderItem, SenderProfile } from '../types'
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

    // Sincronización en la nube si Supabase está conectado
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            memoryOrders = data.map((d: any) => ({
              id: d.id,
              orderNumber: d.order_number,
              courier: d.courier,
              deliveryType: d.delivery_type,
              deliveryAddress: d.delivery_address || '',
              deliveryDistrict: d.delivery_district || '',
              deliveryReference: d.delivery_reference || '',
              recipientName: d.recipient_name,
              recipientDocType: d.recipient_doc_type,
              recipientDocNumber: d.recipient_doc_number,
              recipientPhone: d.recipient_phone,
              destinationDepartment: d.destination_department,
              destinationProvince: d.destination_province,
              destinationAgency: d.destination_agency,
              packageContent: d.package_content,
              packageQuantity: d.package_quantity,
              paymentCondition: d.payment_condition,
              notes: d.notes || '',
              operatorName: d.operator_name || '',
              sellerPhone: d.seller_phone || '',
              status: d.status,
              createdAt: d.created_at,
              updatedAt: d.updated_at,
            }))
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

    // Guardado en la nube en tiempo real
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        courier: newOrder.courier,
        delivery_type: newOrder.deliveryType,
        delivery_address: newOrder.deliveryAddress || null,
        delivery_district: newOrder.deliveryDistrict || null,
        delivery_reference: newOrder.deliveryReference || null,
        recipient_name: newOrder.recipientName,
        recipient_doc_type: newOrder.recipientDocType,
        recipient_doc_number: newOrder.recipientDocNumber,
        recipient_phone: newOrder.recipientPhone,
        destination_department: newOrder.destinationDepartment,
        destination_province: newOrder.destinationProvince,
        destination_agency: newOrder.destinationAgency,
        package_content: newOrder.packageContent,
        package_quantity: newOrder.packageQuantity,
        payment_condition: newOrder.paymentCondition,
        notes: newOrder.notes || null,
        operator_name: newOrder.operatorName || null,
        seller_phone: newOrder.sellerPhone || null,
        status: newOrder.status,
      }).then(({ error }) => {
        if (error) console.error('Error insertando en Supabase:', error.message)
      })
    }
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
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase.from('orders').delete().eq('id', id).then(() => {})
    }
  }, [])

  const clearAllOrders = useCallback(() => {
    memoryOrders = []
    saveToLocalStorage()
    notify()
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000').then(() => {})
    }
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

