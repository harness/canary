import { useCallback } from 'react'

import { useMFEContext } from '@harnessio/mfe-wrapper'

export function useAPIPath() {
  const { renderUrl, scope } = useMFEContext()

  return useCallback(
    (path: string) => {
      const isMFE = renderUrl !== ''

      if (isMFE) {
        return `${window.apiUrl || ''}/code${path}${path.includes('?') ? '&' : '?'}routingId=${scope.accountId}`
      }

      return `${window.apiUrl || ''}${path}`
    },
    [renderUrl, scope]
  )
}
