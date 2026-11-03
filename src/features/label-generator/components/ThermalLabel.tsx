'use client'

import React from 'react'
import { OrderItem, SenderProfile } from '../../orders/types'
import { BarcodeSvg } from './BarcodeSvg'

export function ThermalLabel({
  order,
  sender,
  index = 1,
  total = 1,
}: {
  order: OrderItem
  sender: SenderProfile
  index?: number
  total?: number
}) {
  return (
    <div className="w-[100mm] h-[150mm] max-w-[100mm] max-h-[150mm] bg-white text-black p-4 flex flex-col justify-between border-2 border-black font-sans box-border select-none print:m-0 print:border-black print:page-break-after-always">
      {/* Cabecera */}
      <div className="border-b-2 border-black pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tighter bg-black text-white px-2 py-0.5 rounded uppercase">
              {order.courier === 'DELIVERY_LOCAL'
                ? 'MOTORIZADO'
                : order.courier === 'OLVA'
                  ? 'OLVA COURIER'
                  : order.courier === 'MARVISUR'
                    ? 'MARVISUR'
                    : 'SHALOM'}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700">
              TIKSHIP
            </span>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-600">Bulto: {index} / {total}</div>
            <div className="text-xs font-mono font-bold">{order.orderNumber}</div>
          </div>
        </div>

        {/* Flete badge */}
        <div className="mt-2 text-center py-1 bg-black text-white font-black text-sm uppercase tracking-wider rounded">
          {order.paymentCondition === 'PAGO_EN_DESTINO' ? '★ FLETE PAGO EN DESTINO ★' : '✓ FLETE PAGADO'}
        </div>
      </div>

      {/* Bloque DESTINATARIO (Destacado) */}
      <div className="border-b-2 border-black py-2.5 flex-1 flex flex-col justify-center space-y-1">
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
          {order.courier === 'DELIVERY_LOCAL' || order.deliveryType === 'DOMICILIO'
            ? 'DESTINATARIO (ENTREGA A DOMICILIO)'
            : 'DESTINATARIO (ENTREGA EN AGENCIA)'}
        </span>
        <div className="text-base font-black leading-tight uppercase line-clamp-2">
          {order.recipientName}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
          <div>
            <span className="text-[9px] text-slate-500 block">{order.recipientDocType}:</span>
            <span className="font-mono text-sm">{order.recipientDocNumber}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">CELULAR:</span>
            <span className="font-mono text-sm">{order.recipientPhone}</span>
          </div>
        </div>

        {/* Destino Agencia o Domicilio */}
        <div className="mt-2 bg-slate-100 p-2 rounded border border-black text-center">
          <div className="text-[10px] font-bold text-slate-600 uppercase">
            {order.courier === 'DELIVERY_LOCAL'
              ? 'ENTREGA MOTORIZADO LOCAL:'
              : `ENTREGA ${order.courier || 'SHALOM'}:`}
          </div>
          <div className="text-sm font-black uppercase text-black leading-tight">
            {order.destinationAgency}
          </div>
          <div className="text-[10px] font-bold text-slate-700">
            {order.destinationDepartment} - {order.destinationProvince}
          </div>
        </div>
      </div>

      {/* Bloque REMITENTE */}
      <div className="border-b-2 border-black py-2 text-[10px]">
        <span className="font-black text-slate-500 block mb-0.5">REMITENTE:</span>
        <div className="flex items-center justify-between font-bold">
          <span className="uppercase truncate max-w-[200px]">{sender.businessName}</span>
          <span className="font-mono">{sender.phone}</span>
        </div>
        <div className="text-slate-600 truncate text-[9px]">
          Origen: {sender.originAgency} ({sender.originDepartment})
        </div>
      </div>

      {/* Contenido & Código de barras */}
      <div className="pt-2 text-center">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
          <span>Contenido: {order.packageContent}</span>
          <span>Cant: {order.packageQuantity} bulto(s)</span>
        </div>

        <BarcodeSvg value={order.recipientDocNumber || order.orderNumber} />

        <div className="text-[8px] text-slate-500 mt-1 flex justify-between font-mono">
          <span>TikShip Live Logistics</span>
          <span>{new Date().toLocaleDateString('es-PE')}</span>
        </div>
      </div>
    </div>
  )
}

