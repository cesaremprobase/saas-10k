import { z } from 'zod'

export const senderProfileSchema = z.object({
  businessName: z.string().min(2, 'El nombre o razón social es requerido'),
  docType: z.enum(['DNI', 'RUC', 'CE']),
  docNumber: z.string().refine((val) => /^\d{8}$|^\d{11}$|^\w{9}$/.test(val), {
    message: 'Número de documento inválido (DNI: 8 dígitos, RUC: 11 dígitos, CE: 9 caracteres)',
  }),
  phone: z.string().regex(/^(?:\+?51)?9\d{7,9}$/, 'El teléfono remitente debe ser un número celular válido'),
  originDepartment: z.string().min(2, 'Departamento de origen requerido'),
  originProvince: z.string().min(2, 'Provincia de origen requerida'),
  originAgency: z.string().min(2, 'Agencia de origen requerida'),
})

export const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  orderNumber: z.string().optional(),
  courier: z.enum(['SHALOM', 'OLVA', 'MARVISUR', 'DELIVERY_LOCAL']).default('SHALOM'),
  deliveryType: z.enum(['AGENCIA', 'DOMICILIO']).default('AGENCIA'),
  deliveryAddress: z.string().optional().default(''),
  deliveryDistrict: z.string().optional().default(''),
  deliveryReference: z.string().optional().default(''),
  recipientName: z.string().min(3, 'El nombre completo del destinatario es obligatorio'),
  recipientDocType: z.enum(['DNI', 'RUC', 'CE']).default('DNI'),
  recipientDocNumber: z.string().refine((val) => /^\d{8}$|^\d{11}$|^\w{9}$/.test(val), {
    message: 'Documento debe tener 8 dígitos (DNI) u 11 dígitos (RUC)',
  }),
  recipientPhone: z.string().regex(/^9\d{8}$/, 'El celular debe tener 9 dígitos e iniciar con 9'),
  destinationDepartment: z.string().min(2, 'Selecciona el departamento de entrega'),
  destinationProvince: z.string().min(2, 'Selecciona la provincia de entrega'),
  destinationAgency: z.string().min(2, 'Debes indicar la agencia o dirección de entrega'),
  packageContent: z.string().min(2, 'Especifica el contenido del paquete (ej: Ropa, Accesorios)').default('Prendas de Vestir'),
  packageQuantity: z.number().int().min(1, 'Mínimo 1 bulto').default(1),
  paymentCondition: z.enum(['PAGADO', 'PAGO_EN_DESTINO']).default('PAGO_EN_DESTINO'),
  notes: z.string().optional().default(''),
  operatorName: z.string().optional().default(''),
  sellerPhone: z.string().optional().default(''),
})

export type OrderItemInput = z.infer<typeof orderItemSchema>
export type SenderProfileInput = z.infer<typeof senderProfileSchema>
