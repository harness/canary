import { useCallback } from 'react'

import { useMFEContext } from '../framework/hooks/useMFEContext'

export function useAPIPath() {
  const mfeContext = useMFEContext()

  return useCallback(
    (path: string) => {
      const isMFE = mfeContext.renderUrl !== ''

      if (isMFE) {
        return `${window.apiUrl || ''}/code${path}${path.includes('?') ? '&' : '?'}routingId=${mfeContext.scope.accountId}`
      }

      return `${window.apiUrl || ''}${path}`
    },
    [mfeContext]
  )
}
