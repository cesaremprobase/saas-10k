import { CourierType } from '../../orders/types'

export interface Agency {
  id: string
  code: string
  courier: CourierType
  department: string
  province: string
  district: string
  name: string
  address: string
  searchTerms: string
}

export type ShalomAgency = Agency
