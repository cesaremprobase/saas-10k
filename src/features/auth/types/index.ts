export type UserRole = 'ADMIN' | 'OPERATOR'

export interface SystemUser {
  id: string
  name: string
  email: string
  phone: string // Número WhatsApp personal (9 dígitos)
  role: UserRole
  active: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password?: string
}

