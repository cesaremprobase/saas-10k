'use client'

import React, { useState } from 'react'
import { OrderItem, SenderProfile } from '../../orders/types'
import { ThermalLabel } from './ThermalLabel'

export function LabelPrintModal({
  isOpen,
  onClose,
  orders,
  sender,
  onPrinted,
}: {
  isOpen: boolean
  onClose: () => void
  orders: OrderItem[]
  sender: SenderProfile
  onPrinted?: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen || orders.length === 0) return null

  const handlePrint = () => {
    if (onPrinted) onPrinted()
    window.print()
  }

  const currentOrder = orders[currentIndex] || orders[0]

  return (
    <>
      {/* Estilos específicos de impresión térmica 100x150 mm */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-print-area,
          #thermal-print-area * {
            visibility: visible;
          }
          #thermal-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100mm;
            margin: 0;
            padding: 0;
            display: block !important;
          }
          .thermal-page {
            page-break-after: always;
            break-after: page;
            width: 100mm;
            height: 150mm;
            margin: 0;
            box-sizing: border-box;
          }
          @page {
            size: 100mm 150mm;
            margin: 0;
          }
        }
      `}</style>

      {/* Modal de Previsualización en Pantalla (Oculto al Imprimir) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl flex flex-col max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>🏷️</span>
                <span>Rótulos Térmicos Shalom (10x15 cm)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Previsualizando {orders.length} etiqueta(s) listas para imprimir o guardar en PDF.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg text-sm bg-slate-900 border border-slate-800"
            >
              &times;
            </button>
          </div>

          {/* Navegación de etiquetas */}
          {orders.length > 1 && (
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl mb-3 border border-slate-800 text-xs">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700"
              >
                &larr; Anterior
              </button>
              <span className="font-semibold text-slate-200">
                Etiqueta {currentIndex + 1} de {orders.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(orders.length - 1, prev + 1))}
                disabled={currentIndex === orders.length - 1}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700"
              >
                Siguiente &rarr;
              </button>
            </div>
          )}

          {/* Label Preview Card */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center py-2">
            <div className="shadow-2xl rounded-lg overflow-hidden border border-slate-700 scale-90 sm:scale-100 origin-center">
              <ThermalLabel
                order={currentOrder}
                sender={sender}
                index={currentIndex + 1}
                total={orders.length}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-800 pt-4 mt-3 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cerrar
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-2"
            >
              <span>🖨️ Imprimir Todo el Lote ({orders.length} Rótulos)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Exclusivo para Impresión Física (Oculto en Pantalla, visible en print) */}
      <div id="thermal-print-area" className="hidden print:block">
        {orders.map((ord, idx) => (
          <div key={ord.id} className="thermal-page">
            <ThermalLabel
              order={ord}
              sender={sender}
              index={idx + 1}
              total={orders.length}
            />
          </div>
        ))}
      </div>
    </>
  )
}

