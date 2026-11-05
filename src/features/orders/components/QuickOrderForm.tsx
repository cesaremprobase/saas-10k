'use client'

import React, { useState } from 'react'
import { useOrderStore } from '../store/use-order-store'
import { useAgencies } from '../../shalom-agencies/hooks/use-agencies'
import { PERU_DEPARTMENTS } from '../../shalom-agencies/services/agency-search'
import { DocumentType, PaymentCondition, CourierType, DeliveryType } from '../types'
import { orderItemSchema } from '../schemas/order.schema'
import { useAuthStore } from '@/features/auth/store/use-auth-store'

export function QuickOrderForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addOrder } = useOrderStore()
  const { currentUser } = useAuthStore()

  const [courier, setCourier] = useState<CourierType>('SHALOM')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('AGENCIA')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [localDistrict, setLocalDistrict] = useState('')
  const [localDepartment, setLocalDepartment] = useState('HUANUCO')

  const { agencies, searchQuery, setSearchQuery, setSelectedCourier: setHookCourier } = useAgencies(
    courier === 'DELIVERY_LOCAL' ? 'SHALOM' : courier
  )

  const handleCourierChange = (newCourier: CourierType) => {
    setCourier(newCourier)
    if (newCourier === 'DELIVERY_LOCAL') {
      setDeliveryType('DOMICILIO')
    } else {
      setDeliveryType('AGENCIA')
      setHookCourier(newCourier)
      setSelectedAgencyId('')
    }
  }

  const [recipientName, setRecipientName] = useState('')
  const [recipientDocType, setRecipientDocType] = useState<DocumentType>('DNI')
  const [recipientDocNumber, setRecipientDocNumber] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [selectedAgencyId, setSelectedAgencyId] = useState('')
  const [packageContent, setPackageContent] = useState('Ropa y Accesorios')
  const [packageQuantity, setPackageQuantity] = useState(1)
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('PAGO_EN_DESTINO')
  const [notes, setNotes] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const isHome = courier === 'DELIVERY_LOCAL' || deliveryType === 'DOMICILIO'
    const agency = agencies.find((a) => a.id === selectedAgencyId)

    if (!isHome && !agency) {
      setErrorMsg(`Debes seleccionar una agencia de destino ${courier}`)
      return
    }

    if (isHome && !deliveryAddress.trim()) {
      setErrorMsg('Debes ingresar la dirección de entrega')
      return
    }

    let dept = 'HUANUCO'
    let prov = 'HUANUCO'
    let agencyDest = ''

    if (courier === 'DELIVERY_LOCAL') {
      dept = localDepartment
      prov = localDepartment
      const distInfo = localDistrict ? ` (${localDistrict})` : ''
      agencyDest = `DELIVERY LOCAL: ${deliveryAddress.trim()}${distInfo}`
    } else if (deliveryType === 'DOMICILIO') {
      dept = agency ? agency.department : 'LIMA'
      prov = agency ? agency.province : 'LIMA'
      agencyDest = `DOMICILIO: ${deliveryAddress.trim()}`
    } else {
      dept = agency ? agency.department : 'LIMA'
      prov = agency ? agency.province : 'LIMA'
      agencyDest = `${agency?.name} (${agency?.code})`
    }

    const payload = {
      courier,
      deliveryType: isHome ? ('DOMICILIO' as const) : ('AGENCIA' as const),
      deliveryAddress,
      deliveryDistrict: localDistrict,
      recipientName,
      recipientDocType,
      recipientDocNumber,
      recipientPhone,
      destinationDepartment: dept,
      destinationProvince: prov,
      destinationAgency: agencyDest,
      packageContent,
      packageQuantity: Number(packageQuantity),
      paymentCondition,
      notes,
      operatorName: currentUser?.name || undefined,
      sellerPhone: currentUser?.phone || undefined,
      createdByEmail: currentUser?.email || undefined,
      createdById: currentUser?.id || undefined,
    }

    const validation = orderItemSchema.safeParse(payload)
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Datos incompletos')
      return
    }

    addOrder(payload)

    // Reset campos
    setRecipientName('')
    setRecipientDocNumber('')
    setRecipientPhone('')
    setNotes('')
    setDeliveryAddress('')
    setLocalDistrict('')
    if (onSuccess) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Operador Logístico */}
      <div>
        <label className="block text-slate-300 font-semibold mb-1">Modalidad / Operador *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => handleCourierChange('SHALOM')}
            className={`py-2 px-1 rounded-lg font-bold border transition-colors ${
              courier === 'SHALOM'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            ⚡ Shalom
          </button>
          <button
            type="button"
            onClick={() => handleCourierChange('DELIVERY_LOCAL')}
            className={`py-2 px-1 rounded-lg font-bold border transition-colors ${
              courier === 'DELIVERY_LOCAL'
                ? 'bg-pink-600 text-white border-pink-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            🛵 Local
          </button>
          <button
            type="button"
            onClick={() => handleCourierChange('OLVA')}
            className={`py-2 px-1 rounded-lg font-bold border transition-colors ${
              courier === 'OLVA'
                ? 'bg-yellow-600 text-white border-yellow-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            📦 Olva
          </button>
          <button
            type="button"
            onClick={() => handleCourierChange('MARVISUR')}
            className={`py-2 px-1 rounded-lg font-bold border transition-colors ${
              courier === 'MARVISUR'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            🚚 Marvisur
          </button>
        </div>
      </div>

      {/* Datos del Destinatario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-slate-300 font-semibold mb-1">Nombre Completo Destinatario *</label>
          <input
            type="text"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Ej: Juan Perez Garcia"
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Documento *</label>
          <div className="flex space-x-1.5">
            <select
              value={recipientDocType}
              onChange={(e) => setRecipientDocType(e.target.value as DocumentType)}
              className="px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">CE</option>
            </select>
            <input
              type="text"
              required
              maxLength={11}
              value={recipientDocNumber}
              onChange={(e) => setRecipientDocNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="8 u 11 dígitos"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Celular Destinatario *</label>
          <input
            type="text"
            required
            maxLength={9}
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="9 dígitos (9XXXXXXXX)"
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* CASO A: DELIVERY LOCAL */}
      {courier === 'DELIVERY_LOCAL' ? (
        <div className="p-3 bg-slate-950 rounded-xl border border-pink-500/30 space-y-2.5">
          <div className="text-pink-400 font-bold text-[11px]">Dirección para Motorizado / Local:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">Departamento *</label>
              <select
                value={localDepartment}
                onChange={(e) => setLocalDepartment(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              >
                {PERU_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">Distrito *</label>
              <input
                type="text"
                required
                value={localDistrict}
                onChange={(e) => setLocalDistrict(e.target.value)}
                placeholder="Ej: Amarilis, Pillco Marca"
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] mb-0.5">Dirección y Referencia *</label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Ej: Jr. Dos de Mayo 450 - Frente al mercado"
              className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
            />
          </div>
        </div>
      ) : (
        /* CASO B: AGENCIA SHALOM, OLVA, MARVISUR */
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Agencia {courier} Destino * (Buscar por ciudad o distrito)
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Escribe: ej. Huanuco, Trujillo, Arequipa, Grau..."
            className="w-full mb-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <select
            required
            value={selectedAgencyId}
            onChange={(e) => setSelectedAgencyId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Seleccionar Agencia {courier} --</option>
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>
                [{agency.department} - {agency.province}] {agency.name} ({agency.address})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Detalle del Paquete y Pago */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Contenido</label>
          <input
            type="text"
            value={packageContent}
            onChange={(e) => setPackageContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Bultos</label>
          <input
            type="number"
            min={1}
            value={packageQuantity}
            onChange={(e) => setPackageQuantity(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Condición de Flete</label>
          <select
            value={paymentCondition}
            onChange={(e) => setPaymentCondition(e.target.value as PaymentCondition)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="PAGO_EN_DESTINO">Pago en Destino</option>
            <option value="PAGADO">Flete Pagado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Notas / Referencias</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Opcional: Entregar con DNI, número de paquete, etc."
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
      >
        <span>+ Agregar al Lote Activo</span>
      </button>
    </form>
  )
}
