'use client'

import React from 'react'
import { useOrderStore } from '../store/use-order-store'
import { OrderItem } from '../types'

export function OrderTable({ onSelectOrder }: { onSelectOrder?: (order: OrderItem) => void }) {
  const { orders, removeOrder, clearAllOrders } = useOrderStore()

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center bg-slate-950/40">
        <div className="w-12 h-12 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-xl mb-3 text-slate-500">
          📦
        </div>
        <h4 className="text-sm font-bold text-slate-200">No hay pedidos en el lote activo</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Usa el formulario rápido o pega mensajes de WhatsApp para agregar los pedidos de tu último Live de TikTok.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Total: <strong className="text-white">{orders.length}</strong> envíos listos para procesar
        </span>
        <button
          onClick={() => {
            if (confirm('¿Seguro que deseas vaciar todos los pedidos del lote activo?')) {
              clearAllOrders()
            }
          }}
          className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
        >
          Limpiar lote actual
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4"># Guía</th>
              <th className="py-3 px-4">Destinatario</th>
              <th className="py-3 px-4">Documento</th>
              <th className="py-3 px-4">Celular</th>
              <th className="py-3 px-4">Agencia Shalom Destino</th>
              <th className="py-3 px-4">Flete</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.map((ord) => (
              <tr
                key={ord.id}
                className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => onSelectOrder && onSelectOrder(ord)}
              >
                <td className="py-3 px-4 font-mono font-bold text-indigo-400">{ord.orderNumber}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-100">{ord.recipientName}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{ord.packageContent}</div>
                  {ord.operatorName && (
                    <div className="text-[9px] text-emerald-400 font-medium mt-0.5">
                      👤 {ord.operatorName}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-slate-300">
                  <span className="text-[10px] text-slate-500 mr-1">{ord.recipientDocType}:</span>
                  {ord.recipientDocNumber}
                </td>
                <td className="py-3 px-4 font-mono text-slate-300">{ord.recipientPhone}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        ord.courier === 'DELIVERY_LOCAL'
                          ? 'bg-pink-500/15 text-pink-400 border border-pink-500/25'
                          : ord.courier === 'OLVA'
                          ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                          : ord.courier === 'MARVISUR'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                      }`}
                    >
                      {ord.courier === 'DELIVERY_LOCAL' ? 'LOCAL' : ord.courier || 'SHALOM'}
                    </span>
                    <span className="text-slate-200 font-medium truncate max-w-[200px]">
                      {ord.destinationAgency}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {ord.destinationDepartment} - {ord.destinationProvince}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${ord.paymentCondition === 'PAGADO'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                  >
                    {ord.paymentCondition === 'PAGADO' ? 'Pagado' : 'En Destino'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${ord.status === 'labeled'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : ord.status === 'exported'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                  >
                    {ord.status === 'labeled' ? 'Rotulado' : ord.status === 'exported' ? 'Exportado' : 'Validado'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => removeOrder(ord.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 text-xs transition-colors"
                    title="Eliminar pedido"
                  >
                    &times; Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

