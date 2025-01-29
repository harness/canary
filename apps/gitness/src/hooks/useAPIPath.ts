import { useIsMFE } from '../framework/hooks/useIsMFE'

export function useAPIPath(path: string) {
  const isMFE = useIsMFE()
  if (isMFE) {
    return `/code${path}`
  }
  return path
}
