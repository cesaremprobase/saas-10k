'use client'

import React, { useState } from 'react'
import { parseMultipleWhatsAppMessages, ParsedRawOrder } from '../services/whatsapp-parser'
import { useOrderStore } from '../store/use-order-store'

export function PasteWhatsAppModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addBulkOrders } = useOrderStore()
  const [rawText, setRawText] = useState('')
  const [parsedResults, setParsedResults] = useState<ParsedRawOrder[]>([])
  const [analyzed, setAnalyzed] = useState(false)

  if (!isOpen) return null

  const handleAnalyze = () => {
    if (!rawText.trim()) return
    const results = parseMultipleWhatsAppMessages(rawText)
    setParsedResults(results)
    setAnalyzed(true)
  }

  const validCount = parsedResults.filter((p) => p.isValid).length

  const handleImportAllValid = () => {
    const validOrders = parsedResults
      .filter((p) => p.isValid)
      .map((p) => ({
        recipientName: p.recipientName,
        recipientDocType: p.recipientDocType,
        recipientDocNumber: p.recipientDocNumber,
        recipientPhone: p.recipientPhone,
        destinationDepartment: p.destinationDepartment,
        destinationProvince: p.destinationProvince,
        destinationAgency: p.destinationAgency,
        packageContent: p.packageContent,
        packageQuantity: p.packageQuantity,
        paymentCondition: p.paymentCondition,
        notes: p.notes || '',
      }))

    if (validOrders.length > 0) {
      addBulkOrders(validOrders)
      setRawText('')
      setParsedResults([])
      setAnalyzed(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-emerald-400">⚡</span>
              <span>Pegado Rápido de Pedidos de WhatsApp</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pega los chats o mensajes de tus clientes. TikShip extraerá DNI, celular y agencia Shalom automáticamente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-sm bg-slate-900 border border-slate-800"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Pega aquí los mensajes (separa pedidos con una línea en blanco):
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Ejemplo:
Nombre: Juan Carlos Perez
DNI: 74839201
Celular: 987654321
Envio: Shalom Trujillo Agencia Central
Pago en destino
Contenido: 3 poleras oversize

---

Maria Flores Gomez
DNI 45892301 celular 991234567
Para Shalom Arequipa Parque Industrial`}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleAnalyze}
              disabled={!rawText.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold transition-all"
            >
              Analizar Texto ({rawText.split(/\n\s*\n/).filter(Boolean).length} detectados)
            </button>

            {analyzed && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                {validCount} de {parsedResults.length} pedidos válidos
              </span>
            )}
          </div>

          {/* Resultados Parseados */}
          {analyzed && (
            <div className="space-y-2 mt-4">
              <h3 className="font-semibold text-slate-300 text-xs">Vista Previa de Extracción:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {parsedResults.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      p.isValid
                        ? 'bg-slate-900/60 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{p.recipientName}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {p.recipientDocType}: {p.recipientDocNumber || '---'}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">
                          {p.recipientPhone || '---'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Destino: <span className="text-slate-200">{p.destinationAgency || 'Sin agencia detectada'}</span>
                      </div>
                      {!p.isValid && (
                        <div className="text-[10px] text-rose-400 mt-1">
                          Observación: {p.errors.join(' | ')}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.isValid
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {p.isValid ? 'Listo para importar' : 'Incompleto'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancelar
          </button>

          <button
            onClick={handleImportAllValid}
            disabled={validCount === 0}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            Importar {validCount} Pedidos al Lote
          </button>
        </div>
      </div>
    </div>
  )
}

