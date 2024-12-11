import { createContext, useCallback, useMemo, useState } from 'react'

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
      <ExitConfirmDialog {...confirm} onCancel={onCancel} onConfirm={onConfirm} open={open} />
      {children}
    </ExitConfirmContext.Provider>
  )
}
