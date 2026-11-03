import { AGENCIES } from '../data/agencies'
import { Agency } from '../types'
import { CourierType } from '../../orders/types'

/**
 * Normaliza texto para búsqueda insensible a acentos y mayúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Búsqueda inteligente de agencias por texto libre, departamento y courier (Shalom / Olva / Marvisur)
 */
export function searchAgencies(
  query: string,
  courierFilter?: CourierType,
  departmentFilter?: string
): Agency[] {
  const cleanQuery = normalizeText(query)

  let list = AGENCIES

  // Filtrar por courier
  if (courierFilter) {
    list = list.filter((a) => a.courier === courierFilter)
  }

  // Filtrar por departamento
  if (departmentFilter && departmentFilter !== 'TODOS') {
    const cleanDept = normalizeText(departmentFilter)
    list = list.filter((a) => normalizeText(a.department) === cleanDept)
  }

  if (!cleanQuery) {
    return list
  }

  const tokens = cleanQuery.split(/\s+/).filter(Boolean)

  return list.filter((agency) => {
    const fullSearchCorpus = normalizeText(
      `${agency.name} ${agency.department} ${agency.province} ${agency.district} ${agency.address} ${agency.searchTerms}`
    )
    return tokens.every((token) => fullSearchCorpus.includes(token))
  })
}

export const searchShalomAgencies = (q: string, dept?: string) => searchAgencies(q, 'SHALOM', dept)

/**
 * Encuentra automáticamente la mejor agencia candidata
 */
export function detectBestAgency(destinationText: string, courier: CourierType = 'SHALOM'): Agency | null {
  if (!destinationText) return null

  const clean = normalizeText(destinationText)
  const list = AGENCIES.filter((a) => a.courier === courier)

  // Prioridad 1: Coincidencia en provincia o distrito exacto
  for (const agency of list) {
    const prov = normalizeText(agency.province)
    const dist = normalizeText(agency.district)
    const name = normalizeText(agency.name)

    if (clean.includes(name) || clean.includes(prov) || clean.includes(dist)) {
      return agency
    }
  }

  // Prioridad 2: Coincidencia en departamento
  for (const agency of list) {
    const dept = normalizeText(agency.department)
    if (clean.includes(dept)) {
      return agency
    }
  }

  // Prioridad 3: Términos de búsqueda comunes
  for (const agency of list) {
    const terms = agency.searchTerms.split(' ')
    if (terms.some((t) => t.length > 3 && clean.includes(t))) {
      return agency
    }
  }

  return null
}

export const detectBestShalomAgency = (text: string) => detectBestAgency(text, 'SHALOM')

export const PERU_DEPARTMENTS = [
  'AMAZONAS',
  'ANCASH',
  'APURIMAC',
  'AREQUIPA',
  'AYACUCHO',
  'CAJAMARCA',
  'CALLAO',
  'CUSCO',
  'HUANCAVELICA',
  'HUANUCO',
  'ICA',
  'JUNIN',
  'LA LIBERTAD',
  'LAMBAYEQUE',
  'LIMA',
  'LORETO',
  'MADRE DE DIOS',
  'MOQUEGUA',
  'PASCO',
  'PIURA',
  'PUNO',
  'SAN MARTIN',
  'TACNA',
  'TUMBES',
  'UCAYALI',
]

export function getAllDepartments(courier?: CourierType): string[] {
  if (courier === 'DELIVERY_LOCAL') {
    return PERU_DEPARTMENTS
  }
  const depts = new Set<string>()
  const list = courier ? AGENCIES.filter((a) => a.courier === courier) : AGENCIES
  list.forEach((a) => depts.add(a.department))
  return Array.from(depts).sort()
}
