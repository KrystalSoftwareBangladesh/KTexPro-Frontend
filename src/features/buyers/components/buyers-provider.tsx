import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Buyer } from '@/types/buyer'

type BuyersDialogType = 'add' | 'edit' | 'delete' | 'view'

type BuyersContextType = {
  open: BuyersDialogType | null
  setOpen: (str: BuyersDialogType | null) => void
  currentRow: Buyer | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Buyer | null>>
}

const BuyersContext = React.createContext<BuyersContextType | null>(null)

export function BuyersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BuyersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Buyer | null>(null)

  return (
    <BuyersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BuyersContext.Provider>
  )
}

export const useBuyers = () => {
  const buyersContext = React.useContext(BuyersContext)

  if (!buyersContext) {
    throw new Error('useBuyers has to be used within <BuyersContext>')
  }

  return buyersContext
}
