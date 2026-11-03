'use client'

import React, { useState } from 'react'
import { useOrderStore } from '../store/use-order-store'
import { useAgencies } from '../../shalom-agencies/hooks/use-agencies'
import { DocumentType } from '../types'

export function SenderConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { sender, updateSender } = useOrderStore()
  const { agencies } = useAgencies()

  const [businessName, setBusinessName] = useState(sender.businessName)
  const [docType, setDocType] = useState<DocumentType>(sender.docType)
  const [docNumber, setDocNumber] = useState(sender.docNumber)
  const [phone, setPhone] = useState(sender.phone)
  const [originAgency, setOriginAgency] = useState(sender.originAgency)

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const selected = agencies.find((a) => `${a.name} (${a.code})` === originAgency)
    const originDept = selected ? selected.department : sender.originDepartment
    const originProv = selected ? selected.province : sender.originProvince

    updateSender({
      businessName,
      docType,
      docNumber,
      phone,
      originAgency,
      originDepartment: originDept,
      originProvince: originProv,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <span>⚙️</span>
            <span>Datos del Remitente (Tu Tienda)</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nombre de Tienda / Vendedor *</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipo Doc *</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full px-2 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="RUC">RUC</option>
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Número Documento *</label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Celular Remitente *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Agencia Shalom de Origen *</label>
            <select
              value={originAgency}
              onChange={(e) => setOriginAgency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {agencies.map((a) => (
                <option key={a.id} value={`${a.name} (${a.code})`}>
                  [{a.department}] {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-800 pt-3 mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

