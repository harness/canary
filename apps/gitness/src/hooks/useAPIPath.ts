import { useMFEContext } from '../framework/hooks/useMFEContext'

export function useAPIPath(path: string) {
  const mfeContext = useMFEContext()
  const isMFE = mfeContext.renderUrl !== ''
  if (isMFE) {
    return `${window.apiUrl || ''}/code${path}${path.includes('?') ? '&' : '?'}routingId=${mfeContext.scope.accountId}`
  }
  return path
}
