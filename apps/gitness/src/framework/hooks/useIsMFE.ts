import { useMFEContext } from './useMFEContext'

export const useIsMFE = () => {
  const isMFE = useMFEContext()

  return Boolean(isMFE)
}
