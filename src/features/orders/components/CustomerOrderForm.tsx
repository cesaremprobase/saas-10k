'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useOrderStore, DEFAULT_SENDER } from '../store/use-order-store'
import { useAgencies } from '../../shalom-agencies/hooks/use-agencies'
import { PERU_DEPARTMENTS } from '../../shalom-agencies/services/agency-search'
import { DocumentType, PaymentCondition, CourierType, DeliveryType } from '../types'
import { orderItemSchema } from '../schemas/order.schema'

export function CustomerOrderForm() {
  const searchParams = useSearchParams()
  const { addOrder, sender } = useOrderStore()

  // Courier Selection
  const [selectedCourier, setSelectedCourier] = useState<CourierType>('SHALOM')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('AGENCIA')

  // Local / Home delivery fields
  const [localDepartment, setLocalDepartment] = useState('HUANUCO')
  const [localProvince, setLocalProvince] = useState('HUANUCO')
  const [localDistrict, setLocalDistrict] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryReference, setDeliveryReference] = useState('')

  const {
    agencies,
    searchQuery,
    setSearchQuery,
    setSelectedCourier: setHookCourier,
  } = useAgencies(selectedCourier === 'DELIVERY_LOCAL' ? 'SHALOM' : selectedCourier)

  const handleCourierChange = (courier: CourierType) => {
    setSelectedCourier(courier)
    if (courier === 'DELIVERY_LOCAL') {
      setDeliveryType('DOMICILIO')
    } else if (courier === 'OLVA') {
      setHookCourier('OLVA')
      setSelectedAgencyId('')
    } else {
      setDeliveryType('AGENCIA')
      setHookCourier(courier)
      setSelectedAgencyId('')
    }
  }

  const merchantName = searchParams.get('merchant') || sender.businessName || DEFAULT_SENDER.businessName
  const phoneParam = searchParams.get('phone')
  const operatorParam = searchParams.get('operator')

  // Form State
  const [recipientName, setRecipientName] = useState('')
  const [recipientDocType, setRecipientDocType] = useState<DocumentType>('DNI')
  const [recipientDocNumber, setRecipientDocNumber] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [selectedAgencyId, setSelectedAgencyId] = useState('')
  const [packageContent, setPackageContent] = useState('')
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('PAGO_EN_DESTINO')
  const [notes, setNotes] = useState('')

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderNumber: string
    agencyName: string
    courierName: string
  } | null>(null)

  const selectedAgency = agencies.find((a) => a.id === selectedAgencyId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const isHomeDelivery = selectedCourier === 'DELIVERY_LOCAL' || deliveryType === 'DOMICILIO'

    if (!isHomeDelivery && !selectedAgency) {
      setErrorMsg(`Debes seleccionar la Agencia ${selectedCourier} donde recogerás tu paquete`)
      return
    }

    if (isHomeDelivery && !deliveryAddress.trim()) {
      setErrorMsg('Debes ingresar tu dirección exacta de entrega a domicilio')
      return
    }

    let dept = 'HUANUCO'
    let prov = 'HUANUCO'
    let agencyDestination = ''

    if (selectedCourier === 'DELIVERY_LOCAL') {
      dept = localDepartment
      prov = localProvince || localDepartment
      const distInfo = localDistrict ? ` (${localDistrict})` : ''
      const refInfo = deliveryReference ? ` - Ref: ${deliveryReference.trim()}` : ''
      agencyDestination = `DELIVERY LOCAL: ${deliveryAddress.trim()}${distInfo}${refInfo}`
    } else if (deliveryType === 'DOMICILIO') {
      dept = selectedAgency ? selectedAgency.department : 'LIMA'
      prov = selectedAgency ? selectedAgency.province : 'LIMA'
      agencyDestination = `DOMICILIO OLVA: ${deliveryAddress.trim()}`
    } else {
      dept = selectedAgency ? selectedAgency.department : 'LIMA'
      prov = selectedAgency ? selectedAgency.province : 'LIMA'
      agencyDestination = `${selectedAgency?.name} (${selectedAgency?.code})`
    }

    const payload = {
      courier: selectedCourier,
      deliveryType: isHomeDelivery ? ('DOMICILIO' as const) : ('AGENCIA' as const),
      deliveryAddress: deliveryAddress.trim(),
      deliveryDistrict: localDistrict.trim(),
      deliveryReference: deliveryReference.trim(),
      recipientName: recipientName.trim(),
      recipientDocType,
      recipientDocNumber: recipientDocNumber.trim(),
      recipientPhone: recipientPhone.trim(),
      destinationDepartment: dept,
      destinationProvince: prov,
      destinationAgency: agencyDestination,
      packageContent: packageContent.trim() || 'Prendas / Pedido TikTok',
      packageQuantity: 1,
      paymentCondition,
      notes: notes.trim(),
      operatorName: operatorParam ? operatorParam.trim() : undefined,
      sellerPhone: phoneParam ? phoneParam.replace(/[^0-9]/g, '') : undefined,
    }

    const validation = orderItemSchema.safeParse(payload)
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Por favor completa todos los campos requeridos')
      return
    }

    addOrder(payload)

    const estimatedNumber = `TK-${Math.floor(100 + Math.random() * 900)}`
    const courierDisplay =
      selectedCourier === 'DELIVERY_LOCAL'
        ? 'DELIVERY MOTORIZADO'
        : selectedCourier

    setSubmittedOrder({
      orderNumber: estimatedNumber,
      agencyName: agencyDestination,
      courierName: courierDisplay,
    })
  }

  // Pantalla de Éxito / Confirmación
  if (submittedOrder) {
    const whatsappMsg = encodeURIComponent(
      `¡Hola ${merchantName}! Ya registré mis datos de envío en TikShip para mi pedido. Modalidad: ${submittedOrder.courierName} - Destino: ${submittedOrder.agencyName}`
    )

    return (
      <div className="w-full max-w-lg mx-auto p-5 sm:p-7 bg-slate-900/95 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20">
          ✓
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            ¡Datos Registrados con Éxito!
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Listo para tu Envío</h2>
          <p className="text-xs text-slate-400 mt-2">
            Tus datos fueron enviados a <strong className="text-slate-200">{merchantName}</strong> para preparar tu paquete vía <strong className="text-indigo-400">{submittedOrder.courierName}</strong>.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2.5 text-left text-xs font-mono">
          <div className="flex justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-500">Modalidad:</span>
            <span className="text-indigo-400 font-bold">{submittedOrder.courierName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-500">Destinatario:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{recipientName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-500">Documento:</span>
            <span className="text-slate-200">{recipientDocType}: {recipientDocNumber}</span>
          </div>
          <div className="border-b border-slate-800/80 pb-2">
            <span className="text-slate-500 block mb-0.5">Destino / Entrega:</span>
            <span className="text-indigo-300 font-bold break-words">{submittedOrder.agencyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Condición Flete:</span>
            <span className="text-amber-400 font-semibold">
              {paymentCondition === 'PAGO_EN_DESTINO' ? 'Pagas el flete al recibir' : 'Flete Pagado'}
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          {(() => {
            const raw = (phoneParam || (sender.phone && sender.phone !== '999888777' && sender.phone !== '9000475318' ? sender.phone : '900475318')).replace(/[^0-9]/g, '')
            const clean = raw.length === 9 ? raw : '900475318'
            const targetPhone = clean.startsWith('51') ? clean : `51${clean}`
            return (
              <a
                href={`https://wa.me/${targetPhone}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>📲 Avisar por WhatsApp {operatorParam ? `a ${operatorParam}` : 'a la Tienda'}</span>
              </a>
            )
          })()}

          <button
            onClick={() => {
              setSubmittedOrder(null)
              setRecipientName('')
              setRecipientDocNumber('')
              setRecipientPhone('')
              setSelectedAgencyId('')
              setDeliveryAddress('')
              setLocalDistrict('')
              setDeliveryReference('')
              setPackageContent('')
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-300 font-semibold text-xs transition-colors"
          >
            Registrar Otro Envío
          </button>
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          {selectedCourier === 'DELIVERY_LOCAL'
            ? 'El motorizado se comunicará a tu celular cuando esté en ruta a tu domicilio.'
            : 'Recuerda llevar tu DNI físico original para recoger tu paquete en la agencia.'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800/90 shadow-2xl p-5 sm:p-8 space-y-6">
      {/* Header del Comercio */}
      <div className="border-b border-slate-800 pb-5 text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <span>📦</span>
          <span>Despacho Oficial &bull; Nacional y Local</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Formulario de Envío
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Tienda: <strong className="text-indigo-300 font-semibold">{merchantName}</strong>
          {operatorParam && (
            <span className="ml-2 text-[11px] text-emerald-400">
              &bull; Atendido por: <strong className="text-emerald-300 font-bold">{operatorParam}</strong>
            </span>
          )}
        </p>
        <p className="text-[11px] text-slate-500 max-w-md mx-auto">
          Completa tus datos para emitir tu guía oficial y rótulo de despacho sin errores.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center space-x-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* SECCIÓN 0: Selección de Modalidad / Courier */}
        <div className="space-y-2.5">
          <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px] text-indigo-400">
            ¿Cómo deseas recibir tu pedido? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Botón Shalom */}
            <button
              type="button"
              onClick={() => handleCourierChange('SHALOM')}
              className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition-all touch-manipulation ${selectedCourier === 'SHALOM'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
            >
              <span className="text-base">⚡</span>
              <span>Shalom</span>
              <span className="text-[10px] font-normal opacity-75">Agencia</span>
            </button>

            {/* Botón Delivery Local */}
            <button
              type="button"
              onClick={() => handleCourierChange('DELIVERY_LOCAL')}
              className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition-all touch-manipulation ${selectedCourier === 'DELIVERY_LOCAL'
                  ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-600/30 ring-2 ring-pink-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
            >
              <span className="text-base">🛵</span>
              <span>Delivery Local</span>
              <span className="text-[10px] font-normal opacity-75">A Domicilio</span>
            </button>

            {/* Botón Olva Courier */}
            <button
              type="button"
              onClick={() => handleCourierChange('OLVA')}
              className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition-all touch-manipulation ${selectedCourier === 'OLVA'
                  ? 'bg-yellow-600 text-white border-yellow-500 shadow-md shadow-yellow-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
            >
              <span className="text-base">📦</span>
              <span>Olva Courier</span>
              <span className="text-[10px] font-normal opacity-75">Nacional</span>
            </button>

            {/* Botón Marvisur */}
            <button
              type="button"
              onClick={() => handleCourierChange('MARVISUR')}
              className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1.5 transition-all touch-manipulation ${selectedCourier === 'MARVISUR'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
            >
              <span className="text-base">🚚</span>
              <span>Marvisur</span>
              <span className="text-[10px] font-normal opacity-75">Carga/Provincia</span>
            </button>
          </div>
        </div>

        {/* Modalidad para Olva: Domicilio vs Agencia */}
        {selectedCourier === 'OLVA' && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-slate-300 font-semibold text-xs">Modalidad Olva Courier:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('AGENCIA')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border ${deliveryType === 'AGENCIA'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
              >
                Recojo en Agencia Olva
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('DOMICILIO')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border ${deliveryType === 'DOMICILIO'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
              >
                Envío a Domicilio
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: Datos Personales */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block border-b border-slate-800/80 pb-1">
            1. Datos de Quien Recibe
          </span>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Nombres y Apellidos Completos *
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ej: Carlos Alberto Mendoza Ríos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Documento *</label>
              <select
                value={recipientDocType}
                onChange={(e) => setRecipientDocType(e.target.value as DocumentType)}
                className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              >
                <option value="DNI">DNI</option>
                <option value="CE">C. Extr.</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">N° de Documento *</label>
              <input
                type="text"
                required
                maxLength={11}
                value={recipientDocNumber}
                onChange={(e) => setRecipientDocNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="DNI de 8 dígitos (ej: 74839201)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Teléfono Celular / WhatsApp *
            </label>
            <input
              type="text"
              required
              maxLength={9}
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Número de 9 dígitos (ej: 987654321)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Se te notificará por SMS / llamada a este número cuando el paquete esté en ruta o llegue a agencia.
            </span>
          </div>
        </div>

        {/* SECCIÓN 2: Destino / Entrega Local o Agencia */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block border-b border-slate-800/80 pb-1">
            2. Destino de Entrega (
            {selectedCourier === 'DELIVERY_LOCAL'
              ? '🛵 Delivery Local a Domicilio'
              : `${selectedCourier} - ${deliveryType === 'DOMICILIO' ? 'A Domicilio' : 'En Agencia'}`}
            )
          </span>

          {/* CASO A: DELIVERY LOCAL (Opción Local dentro del Departamento) */}
          {selectedCourier === 'DELIVERY_LOCAL' ? (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-pink-500/30">
              <div className="flex items-center space-x-2 text-pink-400 font-bold text-xs pb-1 border-b border-slate-800">
                <span>📍</span>
                <span>Entrega por Motorizado / Courier Local</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Departamento de Entrega *
                  </label>
                  <select
                    value={localDepartment}
                    onChange={(e) => {
                      setLocalDepartment(e.target.value)
                      setLocalProvince(e.target.value)
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-pink-500 text-xs sm:text-sm"
                  >
                    {PERU_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Distrito / Zona *
                  </label>
                  <input
                    type="text"
                    required
                    value={localDistrict}
                    onChange={(e) => setLocalDistrict(e.target.value)}
                    placeholder="Ej: Amarilis, Pillco Marca, Huánuco, etc."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-pink-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Dirección Exacta (Calle, Jr, Av, Número, Dpto) *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ej: Jr. Dos de Mayo 850, 2do Piso / Av. Universitaria Mz B Lte 4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-pink-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Referencia del Domicilio (Muy Importante) *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryReference}
                  onChange={(e) => setDeliveryReference(e.target.value)}
                  placeholder="Ej: Frente al parque infantil, rejas negras, casa de 3 pisos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-pink-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          ) : deliveryType === 'DOMICILIO' ? (
            /* CASO B: OLVA A DOMICILIO */
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-yellow-500/30">
              <div className="flex items-center space-x-2 text-yellow-400 font-bold text-xs pb-1 border-b border-slate-800">
                <span>📦</span>
                <span>Entrega a Domicilio por Olva Courier</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Dirección Completa (Ciudad, Distrito, Calle y N°) *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ej: Huánuco, Amarilis, Jr. Tarapacá 420 - Dpto 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          ) : (
            /* CASO C: RECOJO EN AGENCIA (SHALOM / OLVA / MARVISUR) */
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Buscar Ciudad, Provincia o Distrito para Agencia {selectedCourier} *
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe tu ciudad: ej. Huanuco, Trujillo, Arequipa, Chiclayo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm mb-2"
              />

              <select
                required
                value={selectedAgencyId}
                onChange={(e) => setSelectedAgencyId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              >
                <option value="">-- Elige la Agencia {selectedCourier} donde recogerás --</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    [{agency.department} - {agency.province}] {agency.name} ({agency.address})
                  </option>
                ))}
              </select>

              {agencies.length === 0 && searchQuery && (
                <p className="text-[11px] text-amber-400 mt-1">
                  No se encontraron agencias de {selectedCourier} para &ldquo;{searchQuery}&rdquo;. Intenta con otro término o consulta con la tienda.
                </p>
              )}

              {selectedAgency && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <span>📍</span>
                    <span>{selectedAgency.name} ({selectedAgency.code})</span>
                  </div>
                  <div className="text-slate-400 text-xs">Dirección: {selectedAgency.address}</div>
                  <div className="text-slate-500 text-[11px]">
                    {selectedAgency.district}, {selectedAgency.province}, {selectedAgency.department}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECCIÓN 3: Pago y Notas */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block border-b border-slate-800/80 pb-1">
            3. Detalles del Pedido y Pago
          </span>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              ¿Qué compraste? (Contenido) *
            </label>
            <input
              type="text"
              required
              value={packageContent}
              onChange={(e) => setPackageContent(e.target.value)}
              placeholder="Ej: 2 poleras oversize, 1 casaca negra, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Condición del Flete de Envío *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentCondition('PAGO_EN_DESTINO')}
                className={`p-3 rounded-xl border text-left transition-all touch-manipulation ${paymentCondition === 'PAGO_EN_DESTINO'
                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold ring-1 ring-amber-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
              >
                <div className="text-xs sm:text-sm">Pago en Destino</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pagas el flete al recibir tu paquete</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentCondition('PAGADO')}
                className={`p-3 rounded-xl border text-left transition-all touch-manipulation ${paymentCondition === 'PAGADO'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
              >
                <div className="text-xs sm:text-sm">Flete Pagado</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ya le pagué el envío a la tienda</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Notas u Observaciones (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Llamar antes de entregar, dejar con recepción"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 sm:py-4 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 touch-manipulation"
        >
          <span>Confirmar y Enviar Mis Datos de Envío &rarr;</span>
        </button>

        <div className="text-center pt-1">
          <Link href="/" className="text-[11px] text-slate-500 hover:text-slate-400">
            Powered by TikShip &bull; Logística TikTok Live
          </Link>
        </div>
      </form>
    </div>
  )
}
