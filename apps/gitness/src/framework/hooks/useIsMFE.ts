import { isEmpty } from 'lodash-es'

import { useMFEContext } from '@harnessio/mfe-wrapper'

export const useIsMFE = () => {
  const mfeContext = useMFEContext()
  return !isEmpty(mfeContext.renderUrl)
}
