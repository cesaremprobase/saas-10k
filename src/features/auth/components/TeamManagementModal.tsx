'use client'

import React, { useState } from 'react'
import { useAuthStore } from '../store/use-auth-store'
import { useOrderStore } from '../../orders/store/use-order-store'
import { SystemUser, UserRole } from '../types'

export function TeamManagementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { users, currentUser, addUser, updateUser, toggleUserStatus, deleteUser } = useAuthStore()
  const { sender } = useOrderStore()

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('OPERATOR')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Edit user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editPhone, setEditPhone] = useState('')
  const [editRole, setEditRole] = useState<UserRole>('OPERATOR')

  if (!isOpen) return null

  const handleCopyUserLink = (userPhone: string, userName: string, userId: string) => {
    if (typeof window === 'undefined') return
    const cleanPhone = userPhone ? userPhone.replace(/[^0-9]/g, '') : ''
    if (!cleanPhone) {
      alert(`El usuario ${userName} aún no tiene un WhatsApp configurado. Haz clic en "✏️ Editar" para asignarle su número.`)
      return
    }

    const origin = window.location.origin
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

  const handleStartEdit = (u: SystemUser) => {
    setEditingUserId(u.id)
    setEditPhone(u.phone || '')
    setEditRole(u.role)
  }

  const handleSaveEdit = (uId: string) => {
    const clean = editPhone.replace(/[^0-9]/g, '')
    updateUser(uId, {
      phone: clean,
      role: editRole,
    })
    setEditingUserId(null)
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                ADMINISTRADOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Asigna a cada usuario u operador su propio número de WhatsApp y su nivel de permisos en la plataforma.
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
              <span className="text-[11px] text-slate-500">Se vinculará con su cuenta de Google</span>
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
                    Correo Electrónico (Gmail / Google) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="brenda@gmail.com"
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
                      placeholder="9XXXXXXXX"
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
                    <option value="ADMIN">Administrador (Control total + Gestión de equipo)</option>
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
              Cada usuario tiene su propio número y link de WhatsApp
            </span>
          </div>

          <div className="space-y-2.5">
            {users.map((usr) => {
              const isEditing = editingUserId === usr.id

              return (
                <div
                  key={usr.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    usr.active
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{usr.name}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            usr.role === 'ADMIN'
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

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>✉️ {usr.email}</span>
                        {usr.phone ? (
                          <span className="font-mono text-emerald-400 font-semibold">
                            📲 +51 {usr.phone}
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold text-[11px]">
                            ⚠️ Sin WhatsApp configurado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Acciones para cada usuario */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyUserLink(usr.phone, usr.name, usr.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                          copiedId === usr.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700'
                        }`}
                        title="Copiar el enlace de despacho que enviará el pedido al WhatsApp de este usuario"
                      >
                        <span>{copiedId === usr.id ? '✓ ¡Copiado!' : '📋 Copiar Link'}</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => (isEditing ? setEditingUserId(null) : handleStartEdit(usr))}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200"
                          title="Editar WhatsApp y Rol"
                        >
                          {isEditing ? '✕ Cancelar' : '✏️ Editar'}
                        </button>
                      )}

                      {isAdmin && usr.email !== 'tritechcesar@gmail.com' && (
                        <>
                          <button
                            onClick={() => toggleUserStatus(usr.id)}
                            className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200"
                          >
                            {usr.active ? 'Pausar' : 'Activar'}
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

                  {/* FORMULARIO DE EDICIÓN INLINE (Solo visible al presionar Editar) */}
                  {isEditing && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-indigo-500/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end text-xs animate-in fade-in duration-150">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          WhatsApp Personal (+51)
                        </label>
                        <input
                          type="text"
                          maxLength={9}
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9XXXXXXXX"
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Rol</label>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as UserRole)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200"
                        >
                          <option value="OPERATOR">Operador / Vendedor</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(usr.id)}
                          className="flex-1 py-1.5 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                        >
                          Guardar Cambios
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUserId(null)}
                          className="py-1.5 px-2.5 rounded bg-slate-800 text-slate-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {usr.phone && (
                    <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
                      Link: /form?merchant={encodeURIComponent(sender.businessName || 'TIKTOK')}&phone={usr.phone}&operator={encodeURIComponent(usr.name)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
