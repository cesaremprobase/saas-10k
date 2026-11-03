'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../store/use-auth-store'

export function LoginForm() {
  const router = useRouter()
  const { loginWithEmail, loginAs, users } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim()) {
      setErrorMsg('Ingresa tu correo electrónico')
      return
    }

    const success = loginWithEmail(email)
    if (success) {
      router.push('/dashboard')
    } else {
      setErrorMsg('No se encontró un usuario activo con este correo electrónico.')
    }
  }

  const handleQuickLogin = (role: 'ADMIN' | 'OPERATOR') => {
    const targetUser = users.find((u) => u.role === role && u.active) || users[0]
    loginAs(targetUser)
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <span>🔒</span>
          <span>Acceso al Panel de Despacho</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Iniciar Sesión</h1>
        <p className="text-xs text-slate-400">
          Ingresa como Administrador para gestionar equipo o como Operador para despachos.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Formulario tradicional */}
      <form onSubmit={handleEmailLogin} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Correo Electrónico *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@tikship.pe"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-slate-300 font-semibold">Contraseña</label>
            <span className="text-[10px] text-slate-500">Demo (cualquier clave)</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <span>Ingresar al Sistema &rarr;</span>
        </button>
      </form>

      {/* Acceso Rápido / Roles Demo */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
          O ingresar con 1 Clic (Roles Configurados)
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('ADMIN')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all"
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-sm">👑</span>
              <span className="text-xs font-bold text-purple-300">Administrador</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Control total y gestión de equipo</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('OPERATOR')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all"
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-sm">📦</span>
              <span className="text-xs font-bold text-emerald-300">Operador</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Despachos y rotulación</div>
          </button>
        </div>
      </div>

      <div className="text-center pt-1 border-t border-slate-800/60">
        <Link href="/form" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
          &larr; Ir al Formulario Público de Clientes
        </Link>
      </div>
    </div>
  )
}

