/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Supplier } from '../data/schema'

type SuppliersDialogType = 'add' | 'edit' | 'delete' | 'view'

type SuppliersContextType = {
  open: SuppliersDialogType | null
  setOpen: (str: SuppliersDialogType | null) => void
  currentRow: Supplier | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Supplier | null>>
}

const SuppliersContext = React.createContext<SuppliersContextType | null>(null)

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SuppliersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Supplier | null>(null)

  return (
    <SuppliersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SuppliersContext.Provider>
  )
}

export const useSuppliers = () => {
  const suppliersContext = React.useContext(SuppliersContext)

  if (!suppliersContext) {
    throw new Error('useSuppliers has to be used within <SuppliersContext>')
  }

  return suppliersContext}
