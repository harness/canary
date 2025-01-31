import { useMFEContext } from '../framework/hooks/useMFEContext'

export function useAPIPath() {
  const mfeContext = useMFEContext()
  const isMFE = mfeContext.renderUrl !== ''
  return function (path: string) {
    if (isMFE) {
      return `${window.apiUrl || ''}/code${path}${path.includes('?') ? '&' : '?'}routingId=${mfeContext.scope.accountId}`
    }
    return `${window.apiUrl || ''}${path}`
  }
}
