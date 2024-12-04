import { useContext } from 'react'

import { ExitConfirmContext } from '../context/ExitConfirmContext'

export const useExitConfirm = () => {
  const context = useContext(ExitConfirmContext)
  if (!context) {
    throw new Error('useExitConfirm must be used within a ExitConfirmProvider')
  }
  return context
}
