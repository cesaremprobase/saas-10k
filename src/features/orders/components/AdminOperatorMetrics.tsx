'use client'

import React from 'react'
import { OrderItem } from '../types'
import { useAuthStore } from '@/features/auth/store/use-auth-store'

export interface OperatorSummary {
  name: string
  phone: string
  email: string
  totalOrders: number
  totalPackages: number
  fleteDestino: number
  fletePagado: number
  couriers: Record<string, number>
}

export function AdminOperatorMetrics({
  orders,
  selectedOperator,
  onSelectOperator,
}: {
  orders: OrderItem[]
  selectedOperator: string // 'ALL' o nombre del operador
  onSelectOperator: (op: string) => void
}) {
  const { users } = useAuthStore()

  // Agrupar pedidos por operador
  const operatorMap = new Map<string, OperatorSummary>()

  // Inicializar con todos los usuarios registrados en el sistema
  users.forEach((u) => {
    operatorMap.set(u.name.toLowerCase(), {
      name: u.name,
      phone: u.phone || '',
      email: u.email,
      totalOrders: 0,
      totalPackages: 0,
      fleteDestino: 0,
      fletePagado: 0,
      couriers: {},
    })
  })

  // Contabilizar métricas de cada pedido
  orders.forEach((ord) => {
    const rawName = ord.operatorName?.trim() || 'Sin Asignar'
    const key = rawName.toLowerCase()

    if (!operatorMap.has(key)) {
      operatorMap.set(key, {
        name: rawName,
        phone: ord.sellerPhone || '',
        email: ord.createdByEmail || '',
        totalOrders: 0,
        totalPackages: 0,
        fleteDestino: 0,
        fletePagado: 0,
        couriers: {},
      })
    }

    const summary = operatorMap.get(key)!
    summary.totalOrders += 1
    summary.totalPackages += ord.packageQuantity || 1
    if (ord.paymentCondition === 'PAGO_EN_DESTINO') {
      summary.fleteDestino += 1
    } else {
      summary.fletePagado += 1
    }

    const courierKey = ord.courier || 'SHALOM'
    summary.couriers[courierKey] = (summary.couriers[courierKey] || 0) + 1
  })

  const operatorList = Array.from(operatorMap.values()).filter(
    (op) => op.totalOrders > 0 || users.some((u) => u.name.toLowerCase() === op.name.toLowerCase())
  )

  const activeSummary =
    selectedOperator === 'ALL'
      ? {
          name: 'Todos los Operadores',
          totalOrders: orders.length,
          totalPackages: orders.reduce((acc, o) => acc + (o.packageQuantity || 1), 0),
          fleteDestino: orders.filter((o) => o.paymentCondition === 'PAGO_EN_DESTINO').length,
          fletePagado: orders.filter((o) => o.paymentCondition === 'PAGADO').length,
        }
      : operatorMap.get(selectedOperator.toLowerCase()) || {
          name: selectedOperator,
          totalOrders: 0,
          totalPackages: 0,
          fleteDestino: 0,
          fletePagado: 0,
        }

  return (
    <div className="p-5 rounded-2xl border border-indigo-500/25 bg-slate-900/60 backdrop-blur-md space-y-4">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-base">📊</span>
            <h3 className="font-extrabold text-white text-sm tracking-tight">
              Métricas y Clasificación por Operador
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              PANEL ADMIN
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Filtra y audita el rendimiento individual de cada vendedor/operador en tiempo real.
          </p>
        </div>

        {/* Selector Rápido de Filtro */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectOperator('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              selectedOperator === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span>🏢 Todos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
              {orders.length}
            </span>
          </button>

          {operatorList.map((op) => {
            const isSelected = selectedOperator.toLowerCase() === op.name.toLowerCase()
            return (
              <button
                key={op.name}
                onClick={() => onSelectOperator(op.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span>👤</span>
                <span className="truncate max-w-[120px]">{op.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono text-indigo-300">
                  {op.totalOrders}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mini KPIs de la Selección Activa */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-medium text-slate-400">
            {selectedOperator === 'ALL' ? 'Envíos Totales' : `Envíos: ${activeSummary.name}`}
          </div>
          <div className="text-xl font-black text-white mt-0.5">{activeSummary.totalOrders}</div>
          <div className="text-[10px] text-slate-500">{activeSummary.totalPackages} bultos despachados</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-medium text-slate-400">Pago en Destino</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">{activeSummary.fleteDestino}</div>
          <div className="text-[10px] text-slate-500">Cobro al retirar en agencia</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-medium text-slate-400">Flete Pagado</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">{activeSummary.fletePagado}</div>
          <div className="text-[10px] text-slate-500">Flete cancelado previo</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-medium text-slate-400">Efectividad de Entrega</div>
          <div className="text-xl font-black text-indigo-400 mt-0.5">
            {activeSummary.totalOrders > 0
              ? `${Math.round((activeSummary.fletePagado / activeSummary.totalOrders) * 100)}%`
              : '0%'}
          </div>
          <div className="text-[10px] text-slate-500">Ratio flete prepagado</div>
        </div>
      </div>

      {/* Desglose / Rendimiento Comparativo de Operadores */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Operador / Vendedor</th>
              <th className="py-2.5 px-3">WhatsApp de Pedidos</th>
              <th className="py-2.5 px-3 text-center">Pedidos</th>
              <th className="py-2.5 px-3 text-center">Bultos</th>
              <th className="py-2.5 px-3 text-center">Pago Destino</th>
              <th className="py-2.5 px-3 text-center">Pagado</th>
              <th className="py-2.5 px-3 text-right">Filtrar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {operatorList.map((op) => {
              const isSelected = selectedOperator.toLowerCase() === op.name.toLowerCase()
              return (
                <tr
                  key={op.name}
                  className={`hover:bg-slate-900/50 transition-colors ${
                    isSelected ? 'bg-indigo-950/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
                      <span>👤</span>
                      <span>{op.name}</span>
                    </div>
                    {op.email && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                        {op.email}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    {op.phone ? (
                      <span className="text-emerald-400">+51 {op.phone}</span>
                    ) : (
                      <span className="text-slate-500 italic">No configurado</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-white font-mono">
                    {op.totalOrders}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                    {op.totalPackages}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-amber-400">
                    {op.fleteDestino}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-400">
                    {op.fletePagado}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectOperator(isSelected ? 'ALL' : op.name)}
                      className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-colors ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                          : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'
                      }`}
                    >
                      {isSelected ? '✕ Quitar Filtro' : '🔍 Ver sus pedidos'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

