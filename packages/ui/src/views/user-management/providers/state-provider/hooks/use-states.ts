import { useContext } from 'react'

import { StateContext } from '@/views/user-management/providers/state-provider'

export const useStates = () => {
  const context = useContext(StateContext)

  if (!context) {
    throw new Error('useStates must be used within StateProvider')
  }

  return context
}
