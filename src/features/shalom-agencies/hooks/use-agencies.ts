'use client'

import { useState, useMemo } from 'react'
import { searchAgencies, getAllDepartments } from '../services/agency-search'
import { Agency } from '../types'
import { CourierType } from '../../orders/types'

export function useAgencies(initialCourier: CourierType = 'SHALOM') {
  const [selectedCourier, setSelectedCourier] = useState<CourierType>(initialCourier)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('TODOS')

  const departments = useMemo(() => getAllDepartments(selectedCourier), [selectedCourier])

  const filteredAgencies = useMemo<Agency[]>(() => {
    return searchAgencies(searchQuery, selectedCourier, selectedDepartment)
  }, [searchQuery, selectedCourier, selectedDepartment])

  return {
    selectedCourier,
    setSelectedCourier,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    agencies: filteredAgencies,
  }
}
