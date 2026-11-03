'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOrderStore } from '@/features/orders/store/use-order-store'
import { QuickOrderForm } from '@/features/orders/components/QuickOrderForm'
import { PasteWhatsAppModal } from '@/features/orders/components/PasteWhatsAppModal'
import { OrderTable } from '@/features/orders/components/OrderTable'
import { SenderConfigModal } from '@/features/orders/components/SenderConfigModal'
import { LabelPrintModal } from '@/features/label-generator/components/LabelPrintModal'
import { exportShalomExcel } from '@/features/export-shalom/services/shalom-excel-generator'
import { OrderItem } from '@/features/orders/types'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { TeamManagementModal } from '@/features/auth/components/TeamManagementModal'

export default function DashboardPage() {
  const { orders, sender, markAllAsLabeled, markAllAsExported } = useOrderStore()
  const { currentUser, logout } = useAuthStore()

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false)
  const [isSenderModalOpen, setIsSenderModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<OrderItem | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'new_order'>('all')
  const [copiedLink, setCopiedLink] = useState(false)

  const activePhone = currentUser?.phone || sender.phone || '900475318'
  const activeOperator = currentUser?.name || ''

  const relativeFormUrl = `/form?merchant=${encodeURIComponent(sender.businessName)}&phone=${encodeURIComponent(activePhone)}&operator=${encodeURIComponent(activeOperator)}`

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const fullUrl = `${window.location.origin}${relativeFormUrl}`
      navigator.clipboard.writeText(fullUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const totalBultos = orders.reduce((acc, o) => acc + o.packageQuantity, 0)
  const fleteDestinoCount = orders.filter((o) => o.paymentCondition === 'PAGO_EN_DESTINO').length
  const fletePagadoCount = orders.filter((o) => o.paymentCondition === 'PAGADO').length

  const handleExportExcel = () => {
    if (orders.length === 0) {
      alert('Agrega al menos un pedido antes de exportar el Excel de Shalom')
      return
    }
    exportShalomExcel(orders, sender)
    markAllAsExported()
  }

  const handlePrintAll = () => {
    if (orders.length === 0) {
      alert('Agrega al menos un pedido antes de generar rótulos')
      return
    }
    setSelectedOrderForPrint(null)
    setIsPrintModalOpen(true)
  }

  const handleRowClick = (order: OrderItem) => {
    setSelectedOrderForPrint(order)
    setIsPrintModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-10 w-[600px] h-[300px] bg-indigo-600/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[400px] bg-violet-600/10 blur-3xl rounded-full" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-white shadow-md shadow-indigo-500/20 text-sm">
                TK
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  TikShip
                </span>
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SHALOM EXPRESS
                </span>
              </div>
            </Link>
          </div>

          {/* User & Access Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all"
              title="Gestionar accesos de equipo y links personales de WhatsApp"
            >
              <span>👥</span>
              <span>Equipo y Accesos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200">
                {currentUser?.role === 'ADMIN' ? 'ADMIN' : 'OPERADOR'}
              </span>
            </button>

            {/* Sender Profile Pill */}
            <button
              onClick={() => setIsSenderModalOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              title="Configurar remitente"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-200 truncate max-w-[130px]">
                {sender.businessName}
              </span>
              <span className="text-slate-500 text-[10px]">&bull; Origen</span>
            </button>

            {/* User Session Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800 text-xs">
              <span className="text-slate-400 text-xs truncate max-w-[110px]" title={currentUser?.name}>
                👤 {currentUser?.name?.split(' ')[0] || 'Admin'}
              </span>
              <Link
                href="/login"
                onClick={() => logout()}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                title="Cerrar sesión o cambiar de usuario"
              >
                Salir
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* KPI / Stats Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-slate-400">Total Envíos en Lote</div>
            <div className="text-2xl font-black text-white mt-1">{orders.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{totalBultos} bulto(s) en total</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-slate-400">Pago en Destino</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{fleteDestinoCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Cobro al recoger en Shalom</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-slate-400">Flete Pagado</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{fletePagadoCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Pagado por adelantado</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-slate-400">Operador Logístico</div>
            <div className="text-xl font-black text-indigo-400 mt-1">Shalom Perú</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Carga masiva oficial</div>
          </div>
        </div>

        {/* Enlace para Compradores (Autoservicio) */}
        <div className="p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/30 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🔗</span>
              <span className="font-bold text-white text-xs">Link de Despacho Público (Sin login para clientes):</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                WhatsApp: +51 {activePhone}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cualquier persona puede abrir este formulario sin cuenta. Al terminar, el pedido te llega directamente a tu WhatsApp personal.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25'
                }`}
            >
              <span>{copiedLink ? '✓ ¡Link Copiado!' : '📋 Copiar Mi Link WhatsApp'}</span>
            </button>

            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-colors flex items-center space-x-1"
              title="Ver y copiar links de otros miembros del equipo"
            >
              <span>Links de Otros 👥</span>
            </button>

            <a
              href={relativeFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-1"
              title="Abrir formulario en nueva pestaña"
            >
              <span>Ver ↗</span>
            </a>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPasteModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
            >
              <span>⚡ Pegar de WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'new_order' ? 'all' : 'new_order')}
              className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all ${activeTab === 'new_order'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
            >
              {activeTab === 'new_order' ? '✕ Cerrar Formulario' : '+ Formulario Manual'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintAll}
              disabled={orders.length === 0}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
            >
              <span>🏷️ Imprimir Rótulos (10x15)</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={orders.length === 0}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 border border-slate-700 font-bold text-xs transition-all flex items-center space-x-1.5"
            >
              <span>📊 Excel Shalom</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Formulario (Visible si activeTab === 'new_order' o en pantallas grandes) */}
          {activeTab === 'new_order' && (
            <div className="lg:col-span-1 p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-sm">Registrar Envío</h3>
                <span className="text-[10px] text-slate-400">Validación Zod</span>
              </div>
              <QuickOrderForm onSuccess={() => setActiveTab('all')} />
            </div>
          )}

          {/* Columna Derecha / Principal: Tabla de Lote */}
          <div className={activeTab === 'new_order' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-bold text-white text-sm">Lote Activo de Despacho</h3>
                  <p className="text-[11px] text-slate-400">
                    Haz clic en cualquier fila para previsualizar su rótulo térmico individual.
                  </p>
                </div>
              </div>
              <OrderTable onSelectOrder={handleRowClick} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TikShip &bull; Logística Inteligente para TikTok Sellers</span>
          <span>Integrado oficialmente con el formato de Carga Masiva Shalom Perú</span>
        </div>
      </footer>

      {/* Modales */}
      <PasteWhatsAppModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
      />

      <SenderConfigModal
        isOpen={isSenderModalOpen}
        onClose={() => setIsSenderModalOpen(false)}
      />

      <LabelPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        orders={selectedOrderForPrint ? [selectedOrderForPrint] : orders}
        sender={sender}
        onPrinted={() => markAllAsLabeled()}
      />

      <TeamManagementModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  )
}
