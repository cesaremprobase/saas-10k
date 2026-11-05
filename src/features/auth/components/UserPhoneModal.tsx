'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/use-auth-store'

export function UserPhoneModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { currentUser, updateUser } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.phone) {
      setPhone(currentUser.phone)
    } else {
      setPhone('')
    }
    setErrorMsg(null)
    setSuccessMsg(null)
  }, [currentUser, isOpen])

  if (!isOpen || !currentUser) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    const clean = phone.replace(/[^0-9]/g, '')
    if (clean.length !== 9 || !clean.startsWith('9')) {
      setErrorMsg('El número debe tener 9 dígitos y empezar con 9 (ej: 987654321)')
      return
    }

    updateUser(currentUser.id, { phone: clean })
    setSuccessMsg('¡Número de WhatsApp actualizado exitosamente!')
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📲</span>
            <h3 className="font-bold text-white text-base">Mi WhatsApp de Despacho</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Hola <strong className="text-slate-200">{currentUser.name}</strong>. Configura tu número de WhatsApp personal para que cuando tus clientes completen el formulario de envío, el pedido te llegue directamente a ti.
        </p>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Tu Número de Celular / WhatsApp *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-slate-400 font-mono text-xs">
                +51
              </span>
              <input
                type="text"
                required
                maxLength={9}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="9XXXXXXXX"
                className="w-full px-3 py-2.5 rounded-r-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Debe ser un número móvil de Perú de 9 dígitos.
            </span>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              Guardar Mi WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

