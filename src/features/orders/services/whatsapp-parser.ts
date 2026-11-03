import { OrderItem, DocumentType, PaymentCondition, CourierType, DeliveryType } from '../types'
import { detectBestAgency } from '../../shalom-agencies/services/agency-search'

export interface ParsedRawOrder {
  rawText: string
  courier: CourierType
  deliveryType: DeliveryType
  deliveryAddress?: string
  recipientName: string
  recipientDocType: DocumentType
  recipientDocNumber: string
  recipientPhone: string
  destinationDepartment: string
  destinationProvince: string
  destinationAgency: string
  packageContent: string
  packageQuantity: number
  paymentCondition: PaymentCondition
  notes?: string
  isValid: boolean
  errors: string[]
}

/**
 * Parsea un único mensaje o bloque de texto de WhatsApp
 */
export function parseSingleWhatsAppMessage(text: string): ParsedRawOrder {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const fullText = text.replace(/\r?\n/g, ' ')
  const lowerFull = fullText.toLowerCase()

  let courier: CourierType = 'SHALOM'
  let deliveryType: DeliveryType = 'AGENCIA'

  // 1. Detectar courier
  if (lowerFull.includes('marvisur')) {
    courier = 'MARVISUR'
  } else if (lowerFull.includes('olva')) {
    courier = 'OLVA'
    if (lowerFull.includes('domicilio') || lowerFull.includes('casa') || lowerFull.includes('direccion')) {
      deliveryType = 'DOMICILIO'
    }
  }

  let name = ''
  let docNumber = ''
  let phone = ''
  let content = 'Prendas / Paquete'
  let rawDestination = ''
  let deliveryAddress = ''
  let paymentCondition: PaymentCondition = 'PAGO_EN_DESTINO'

  // 2. Extraer por patrones clave de WhatsApp (Nombre:, DNI:, Celular:, etc.)
  for (const line of lines) {
    const lower = line.toLowerCase()

    if (lower.match(/^(nombre|cliente|destinatario|para)\s*[:=-]\s*(.+)/i)) {
      const match = line.match(/^(nombre|cliente|destinatario|para)\s*[:=-]\s*(.+)/i)
      if (match && match[2]) name = match[2].trim()
    } else if (lower.match(/^(dni|documento|ruc|ce)\s*[:=-]\s*([0-9a-zA-Z]+)/i)) {
      const match = line.match(/^(dni|documento|ruc|ce)\s*[:=-]\s*([0-9a-zA-Z]+)/i)
      if (match && match[2]) docNumber = match[2].trim()
    } else if (lower.match(/^(celular|telefono|tel|fono|whatsapp)\s*[:=-]\s*(\+?51)?\s*([0-9\s-]+)/i)) {
      const match = line.match(/^(celular|telefono|tel|fono|whatsapp)\s*[:=-]\s*(\+?51)?\s*([0-9\s-]+)/i)
      if (match && match[3]) phone = match[3].replace(/[^0-9]/g, '')
    } else if (lower.match(/^(destino|agencia|envio|ciudad|lugar)\s*[:=-]\s*(.+)/i)) {
      const match = line.match(/^(destino|agencia|envio|ciudad|lugar)\s*[:=-]\s*(.+)/i)
      if (match && match[2]) rawDestination = match[2].trim()
    } else if (lower.match(/^(direccion|dirección|calle|domicilio)\s*[:=-]\s*(.+)/i)) {
      const match = line.match(/^(direccion|dirección|calle|domicilio)\s*[:=-]\s*(.+)/i)
      if (match && match[2]) {
        deliveryAddress = match[2].trim()
        deliveryType = 'DOMICILIO'
      }
    } else if (lower.match(/^(contenido|pedido|producto|detalle)\s*[:=-]\s*(.+)/i)) {
      const match = line.match(/^(contenido|pedido|producto|detalle)\s*[:=-]\s*(.+)/i)
      if (match && match[2]) content = match[2].trim()
    }
  }

  // 3. Si no se encontró DNI por etiqueta, buscar por regex de 8 u 11 dígitos
  if (!docNumber) {
    const dniMatch = fullText.match(/\b([0-9]{8})\b/)
    const rucMatch = fullText.match(/\b([0-9]{11})\b/)
    if (dniMatch) {
      docNumber = dniMatch[1]
    } else if (rucMatch) {
      docNumber = rucMatch[1]
    }
  }

  // 4. Si no se encontró celular por etiqueta, buscar número peruano (9 dígitos que empiece con 9)
  if (!phone) {
    const phoneMatch = fullText.match(/\b(9[0-9]{8})\b/)
    if (phoneMatch) {
      phone = phoneMatch[1]
    }
  }

  // 5. Detectar nombre
  if (!name && lines.length > 0) {
    const firstLine = lines[0]
    if (!firstLine.match(/(hola|buenas|pedido|shalom|olva|marvisur|envio|precio)/i) && firstLine.length < 50) {
      name = firstLine
    }
  }

  // 6. Condición de pago
  if (fullText.match(/pagado|transferencia|yape|plin|abono/i)) {
    paymentCondition = 'PAGADO'
  }

  // 7. Detección de agencia
  const destinationQuery = rawDestination || fullText
  const matchedAgency = detectBestAgency(destinationQuery, courier)

  const errors: string[] = []
  if (!name) errors.push('Falta nombre del destinatario')
  if (!docNumber || (docNumber.length !== 8 && docNumber.length !== 11)) {
    errors.push('DNI/RUC no válido (debe tener 8 u 11 dígitos)')
  }
  if (!phone || !/^9\d{8}$/.test(phone)) {
    errors.push('Celular no válido (debe tener 9 dígitos y empezar con 9)')
  }
  if (deliveryType === 'AGENCIA' && !matchedAgency) {
    errors.push(`No se detectó agencia ${courier} destino`)
  }

  const docType: DocumentType = docNumber.length === 11 ? 'RUC' : 'DNI'

  return {
    rawText: text,
    courier,
    deliveryType,
    deliveryAddress,
    recipientName: name || 'Destinatario sin nombre',
    recipientDocType: docType,
    recipientDocNumber: docNumber,
    recipientPhone: phone,
    destinationDepartment: matchedAgency ? matchedAgency.department : 'LIMA',
    destinationProvince: matchedAgency ? matchedAgency.province : 'LIMA',
    destinationAgency:
      deliveryType === 'DOMICILIO'
        ? `Entrega a Domicilio: ${deliveryAddress || 'Dirección por confirmar'}`
        : matchedAgency
          ? `${matchedAgency.name} (${matchedAgency.code})`
          : '',
    packageContent: content,
    packageQuantity: 1,
    paymentCondition,
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Parsea múltiples mensajes pegados juntos
 */
export function parseMultipleWhatsAppMessages(rawInput: string): ParsedRawOrder[] {
  const rawBlocks = rawInput
    .split(/\n\s*\n|---+|===+|\*{3,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 10)

  return rawBlocks.map(parseSingleWhatsAppMessage)
}
