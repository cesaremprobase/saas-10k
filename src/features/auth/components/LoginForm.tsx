'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../store/use-auth-store'

export function LoginForm() {
  const router = useRouter()
  const { signInWithGoogle, loginWithEmail } = useAuthStore()

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setErrorMsg(null)
    setIsLoadingGoogle(true)
    try {
      const res = await signInWithGoogle()
      if (res.error) {
        setErrorMsg(`Error al conectar con Google: ${res.error}`)
        setIsLoadingGoogle(false)
      } else if (!res.isRedirecting) {
        // Modo inmediato local
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado'
      setErrorMsg(`Error al iniciar sesión: ${msg}`)
      setIsLoadingGoogle(false)
    }
  }

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
      setErrorMsg('No se encontró un usuario activo con este correo.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/95 rounded-2xl sm:rounded-3xl border border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <span>🔒</span>
          <span>Acceso al Panel de Despacho</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Iniciar Sesión</h1>
        <p className="text-xs text-slate-400">
          Inicia sesión o regístrate con tu cuenta de Google para acceder a TikShip.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* BOTÓN PRINCIPAL: GOOGLE SIGN-IN */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoadingGoogle}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold text-sm shadow-xl shadow-white/5 transition-all flex items-center justify-center space-x-3 disabled:opacity-60"
        >
          {isLoadingGoogle ? (
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Conectando con Google...</span>
            </div>
          ) : (
            <>
              {/* Google SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Autenticación segura con Google OAuth y Supabase.
        </p>
      </div>

      {/* Divisor */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-800" />
        <span className="flex-shrink mx-3 text-slate-600 text-[11px] uppercase tracking-wider">
          O acceder con correo
        </span>
        <div className="flex-grow border-t border-slate-800" />
      </div>

      {/* Formulario Secundario de Correo */}
      {!showEmailForm ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ¿Prefieres ingresar con correo electrónico? Haz clic aquí
          </button>
        </div>
      ) : (
        <form onSubmit={handleEmailLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold transition-all"
          >
            Ingresar con Correo &rarr;
          </button>
        </form>
      )}

      {/* Enlace al Formulario Público */}
      <div className="text-center pt-2 border-t border-slate-800/80">
        <Link href="/form" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
          &larr; Ir al Formulario Público para Clientes (Sin Login)
        </Link>
      </div>
    </div>
  )
}
