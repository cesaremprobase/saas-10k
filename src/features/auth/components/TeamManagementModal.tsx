'use client'

import React, { useState } from 'react'
import { useAuthStore } from '../store/use-auth-store'
import { useOrderStore } from '../../orders/store/use-order-store'
import { UserRole } from '../types'

export function TeamManagementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { users, currentUser, addUser, toggleUserStatus, deleteUser } = useAuthStore()
  const { sender } = useOrderStore()

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('OPERATOR')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCopyUserLink = (userPhone: string, userName: string, userId: string) => {
    if (typeof window === 'undefined') return
    const origin = window.location.origin
    const cleanPhone = userPhone.replace(/[^0-9]/g, '')
    const merchant = encodeURIComponent(sender.businessName || 'TIKTOK SHOP')
    const operator = encodeURIComponent(userName)
    const link = `${origin}/form?merchant=${merchant}&phone=${cleanPhone}&operator=${operator}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
      setCopiedId(userId)
      setTimeout(() => setCopiedId(null), 2500)
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    const cleanPhone = phone.replace(/[^0-9]/g, '')
    if (cleanPhone.length !== 9 || !cleanPhone.startsWith('9')) {
      setErrorMsg('El WhatsApp personal debe tener 9 dígitos y empezar con 9')
      return
    }

    if (!name.trim()) {
      setErrorMsg('Ingresa el nombre del usuario u operador')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido')
      return
    }

    // Verificar si el correo ya existe
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('Ya existe un usuario registrado con este correo')
      return
    }

    addUser({
      name: name.trim(),
      email: email.trim(),
      phone: cleanPhone,
      role,
      active: true,
    })

    setSuccessMsg(`¡Usuario ${name.trim()} agregado con éxito! Ya puedes copiar su link de WhatsApp.`)
    setName('')
    setEmail('')
    setPhone('')
    setRole('OPERATOR')
  }

  const isAdmin = currentUser?.role === 'ADMIN'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">👥</span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Control de Accesos y Equipo
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Rol: {currentUser?.role || 'ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Da acceso a otros usuarios y asigna a cada uno su propio WhatsApp para recibir pedidos del formulario.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            ✓ {successMsg}
          </div>
        )}

        {/* Sección 1: Formulario para Agregar Usuario (Solo Administrador) */}
        {isAdmin && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                + Dar Acceso a Nuevo Usuario / Operador
              </span>
              <span className="text-[11px] text-slate-500">Formulario público sin restricciones</span>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Brenda Flores"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Correo Electrónico (Para Login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    WhatsApp Personal (Para recibir sus pedidos) *
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 rounded-l-lg bg-slate-800 border border-r-0 border-slate-700 text-slate-400 font-mono text-xs">
                      +51
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={9}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="9XXXXXXXX (9 dígitos)"
                      className="w-full px-3 py-2 rounded-r-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Rol / Nivel de Acceso *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="OPERATOR">Operador / Vendedor (Genera y atiende despachos)</option>
                    <option value="ADMIN">Administrador (Control total + Gestión de usuarios)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
              >
                <span>+ Crear Acceso y Habilitar Link de WhatsApp</span>
              </button>
            </form>
          </div>
        )}

        {/* Sección 2: Lista de Usuarios Registrados y sus Links Personales */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Usuarios Autorizados ({users.length})
            </span>
            <span className="text-[11px] text-slate-500">
              Cada usuario tiene su propio link para su WhatsApp personal
            </span>
          </div>

          <div className="space-y-2.5">
            {users.map((usr) => (
              <div
                key={usr.id}
                className={`p-3.5 rounded-xl border transition-all ${usr.active
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{usr.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${usr.role === 'ADMIN'
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                      >
                        {usr.role === 'ADMIN' ? 'ADMINISTRADOR' : 'OPERADOR'}
                      </span>
                      {!usr.active && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400">
                          Inactivo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span>✉️ {usr.email}</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        📲 +51 {usr.phone}
                      </span>
                    </div>
                  </div>

                  {/* Acciones para cada usuario */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyUserLink(usr.phone, usr.name, usr.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${copiedId === usr.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700'
                        }`}
                      title="Copiar el enlace de despacho que enviará el pedido al WhatsApp de este usuario"
                    >
                      <span>{copiedId === usr.id ? '✓ ¡Copiado!' : '📋 Copiar Link WhatsApp'}</span>
                    </button>

                    {isAdmin && usr.id !== 'usr-admin-01' && (
                      <>
                        <button
                          onClick={() => toggleUserStatus(usr.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200"
                        >
                          {usr.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar acceso a ${usr.name}?`)) {
                              deleteUser(usr.id)
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-rose-400 hover:text-rose-300"
                          title="Eliminar usuario"
                        >
                          &times;
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
                  Link personal: /form?merchant={encodeURIComponent(sender.businessName || 'TIKTOK')}&phone={usr.phone}&operator={encodeURIComponent(usr.name)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota informativa */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">💡 ¿Cómo funciona el enlace libre de despacho?</div>
          <p>
            Cualquier comprador puede entrar al link sin crearse cuenta ni iniciar sesión. Al completar sus datos de envío, el botón de confirmación abrirá automáticamente el WhatsApp del usuario/vendedor asignado con todos los detalles del paquete y la agencia.
          </p>
        </div>
      </div>
    </div>
  )
}

