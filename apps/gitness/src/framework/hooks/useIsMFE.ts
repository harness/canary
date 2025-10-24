import { isEmpty } from 'lodash-es'

import { useMFEContext } from './useMFEContext'

export const useIsMFE = () => {
  const mfeContext = useMFEContext()
  return !isEmpty(mfeContext.renderUrl)
}
