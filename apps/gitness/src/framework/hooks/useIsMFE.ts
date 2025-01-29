import { useMFEContext } from './useMFEContext'

export const useIsMFE = () => {
  const mfeContext = useMFEContext()
  return mfeContext.renderUrl !== ''
}
