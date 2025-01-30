import { useMFEContext } from '../framework/hooks/useMFEContext'

export function useAPIPath(path: string, addRoutingId: boolean = true) {
  const mfeContext = useMFEContext()
  const isMFE = mfeContext.renderUrl !== ''
  if (isMFE) {
    return !addRoutingId
      ? `${window.apiUrl || ''}/code${path}`
      : `${window.apiUrl || ''}/code${path}${path.includes('?') ? '&' : '?'}routingId=${mfeContext.scope.accountId}`
  }
  return path
}
