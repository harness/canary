import { useContext } from 'react'

import { DialogsContext } from '@/views/user-management/providers/dialogs-provider'

export const useDialogs = () => {
  const context = useContext(DialogsContext)

  if (!context) {
    throw new Error('useDialogs must be used within DialogsProvider')
  }

  return context
}
