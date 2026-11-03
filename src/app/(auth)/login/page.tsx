'use client'

import React from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-3xl opacity-70" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center py-6 w-full">
        <LoginForm />
      </main>

      <footer className="relative z-10 text-center py-4 text-[11px] text-slate-600">
        <span>TikShip &bull; Acceso Seguro para TikTok Sellers y Administradores</span>
      </footer>
    </div>
  )
}
