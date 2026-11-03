'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background Lighting Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/15 blur-3xl opacity-70" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[400px] bg-violet-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[400px] bg-indigo-600/10 blur-3xl rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30 text-base">
              TK
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                TikShip
              </span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PERÚ LOGISTICS
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/form?merchant=TIKTOK+SHOP"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium"
            >
              Ver Formulario Demo ↗
            </Link>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-1.5"
            >
              <span>Panel de Despacho &rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-14 sm:py-20 flex-1 w-full space-y-24">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Automatización para TikTok Live, WhatsApp y Gamarra</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Despacha tus ventas de TikTok por{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Shalom, Olva y Marvisur
            </span>{' '}
            en minutos
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Elimina las 4 horas nocturnas de transcripción manual. Tus clientes completan sus datos con un link, y tú imprimes rótulos térmicos y descargas el Excel para ventanilla con <strong>cero errores</strong>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>⚡ Comenzar a Despachar Gratis</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>

            <Link
              href="/form?merchant=TIKTOK+SHOP"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>📝 Probar Formulario del Comprador</span>
              <span className="text-slate-400">↗</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Sin tarjeta requerida</span>
            <span>✓ Compatible con impresoras térmicas</span>
            <span>✓ Todo Perú (24 Dptos)</span>
          </div>
        </div>

        {/* WORKFLOW PREVIEW (HOW IT WORKS IN 3 STEPS) */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              EL FLUJO QUE SALVA TUS NOCHES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              De 50 pedidos en chat a 50 paquetes rotulados en 3 pasos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm space-y-3 relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 text-base">
                1
              </div>
              <h3 className="font-bold text-base text-white">Comparte tu Link Personalizado</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pega tu enlace <code className="text-indigo-300 font-mono">tikship.com/form?merchant=tu_tienda</code> en tu bio de TikTok o pásalo por WhatsApp a los compradores de tu Live.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm space-y-3 relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-black text-violet-400 text-base">
                2
              </div>
              <h3 className="font-bold text-base text-white">El Cliente Elige su Agencia</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El comprador ingresa su DNI y selecciona su agencia favorita de Shalom, Olva Courier o Marvisur (ej. Huánuco, Trujillo, Arequipa) en su celular.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm space-y-3 relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center font-black text-pink-400 text-base">
                3
              </div>
              <h3 className="font-bold text-base text-white">Imprime y Descarga en 1 Clic</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entra a tu panel, pulsa <strong>&ldquo;Imprimir Rótulos (10x15)&rdquo;</strong> para tu impresora térmica y <strong>&ldquo;Excel Shalom&rdquo;</strong> para ventanilla con datos blindados.
              </p>
            </div>
          </div>
        </div>

        {/* CORE FEATURES GRID */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              DISEÑADO PARA VENDEDORES EXIGENTES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Todo lo que necesitas para tu operación diaria
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-2.5">
              <div className="text-2xl">⚡</div>
              <h4 className="font-bold text-white text-sm">Pegado Inteligente WhatsApp</h4>
              <p className="text-xs text-slate-400">
                ¿Prefieres que te pasen datos por chat? Copia el mensaje completo y TikShip extrae DNI, celular y agencia automáticamente.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-2.5">
              <div className="text-2xl">🏷️</div>
              <h4 className="font-bold text-white text-sm">Rótulos Térmicos 10x15 cm</h4>
              <p className="text-xs text-slate-400">
                Formato estándar vectorial con código de barras de alta legibilidad, compatible con impresoras Xprinter, Zebra y hojas A4.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-2.5">
              <div className="text-2xl">📊</div>
              <h4 className="font-bold text-white text-sm">Plantilla Oficial Shalom</h4>
              <p className="text-xs text-slate-400">
                Genera el Excel exacto que exige Shalom para carga masiva, protegiendo los ceros a la izquierda en DNIs y teléfonos.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-2.5">
              <div className="text-2xl">🚚</div>
              <h4 className="font-bold text-white text-sm">Shalom, Olva y Marvisur</h4>
              <p className="text-xs text-slate-400">
                Catálogo maestro de agencias a nivel nacional en los 24 departamentos del Perú, con soporte de entrega a domicilio para Olva.
              </p>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION BANNER */}
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Deja de transcribir pedidos a mano esta misma noche
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Únete a los emprendedores que rotulan y despachan en 5 minutos tras sus transmisiones en vivo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all"
            >
              Abrir Mi Panel TikShip &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 px-6 py-6 text-xs text-slate-500 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">TikShip</span>
            <span>&bull;</span>
            <span>Acelerador Logístico para TikTok Sellers en Perú</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Panel
            </Link>
            <Link href="/form?merchant=TIKTOK+SHOP" className="hover:text-white transition-colors">
              Formulario Comprador
            </Link>
            <Link href="/api/health" className="hover:text-white transition-colors font-mono text-[11px]">
              /api/health
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
