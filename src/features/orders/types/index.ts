export type DocumentType = 'DNI' | 'RUC' | 'CE'

export type PaymentCondition = 'PAGADO' | 'PAGO_EN_DESTINO'

export type OrderStatus = 'draft' | 'validated' | 'labeled' | 'exported'

export type CourierType = 'SHALOM' | 'OLVA' | 'MARVISUR' | 'DELIVERY_LOCAL'

export type DeliveryType = 'AGENCIA' | 'DOMICILIO'

export interface SenderProfile {
  id?: string
  businessName: string
  docType: DocumentType
  docNumber: string
  phone: string
  originDepartment: string
  originProvince: string
  originAgency: string
}

export interface OrderItem {
  id: string
  orderNumber: string
  // Courier y Modalidad
  courier: CourierType
  deliveryType: DeliveryType
  deliveryAddress?: string
  deliveryDistrict?: string
  deliveryReference?: string
  // Destinatario
  recipientName: string
  recipientDocType: DocumentType
  recipientDocNumber: string
  recipientPhone: string
  // Destino / Agencia / Ubigeo
  destinationDepartment: string
  destinationProvince: string
  destinationAgency: string
  // Carga
  packageContent: string
  packageQuantity: number
  paymentCondition: PaymentCondition
  notes?: string
  // Operador / Vendedor que originó el pedido
  operatorName?: string
  sellerPhone?: string
  createdByEmail?: string
  createdById?: string
  // Estado
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface OrderBatch {
  id: string
  batchCode: string
  sender: SenderProfile
  orders: OrderItem[]
  createdAt: string
}
