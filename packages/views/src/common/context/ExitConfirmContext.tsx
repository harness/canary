import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { ExitConfirmDialog, ExitConfirmOptions } from '@harnessio/ui/components'

export interface ExitConfirmContextType {
  show: (options: ExitConfirmOptions) => void
}

export const ExitConfirmContext = createContext<ExitConfirmContextType>({
  show: (_options: ExitConfirmOptions) => undefined
})

export function ExitConfirmProvider({ children }: { children: React.ReactNode }) {
  const [confirm, setConfirm] = useState<ExitConfirmOptions>()
  const [open, setOpen] = useState(false)

  const show = useCallback(
    (confirmOptions?: ExitConfirmOptions) => {
      setConfirm(confirmOptions)
      setOpen(true)
    },
    [setOpen]
  )

  const onConfirm = () => {
    confirm?.onConfirm?.()
    setOpen(false)
  }

  const onCancel = () => {
    confirm?.onCancel?.()
    setOpen(false)
  }

  const value = useMemo(() => ({ show }), [show])

  return (
    <ExitConfirmContext.Provider value={value}>
      {children}
      <ExitConfirmDialog {...confirm} onCancel={onCancel} onConfirm={onConfirm} open={open} />
    </ExitConfirmContext.Provider>
  )
}

export const useExitConfirm = () => {
  const context = useContext(ExitConfirmContext)
  if (!context) {
    throw new Error('useExitConfirm must be used within a ExitConfirmProvider')
  }
  return context
}
