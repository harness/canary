import { useParams } from 'react-router-dom'

import { useIsMFE } from './useIsMFE'
import { useMFEContext } from './useMFEContext'

export function useGetPathParams<T>(): Partial<T> {
  const isMFE = useIsMFE()
  return isMFE ? (useMFEContext()?.customHooks?.useParams() as T) : (useParams() as T)
}
