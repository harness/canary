import { forOwn } from 'lodash-es'

import { AnyFormValue } from '../../types'

const TEMP_PREFIX = '__temp_'

export const getTemporaryPath = (path: string) => {
  return TEMP_PREFIX + path.split('.').join('__')
}

export function removeTemporaryFieldsValue(values: AnyFormValue) {
  const retValues = { ...values }
  forOwn(retValues, (_, key) => {
    if (key.startsWith(TEMP_PREFIX)) delete retValues[key]
  })
  return retValues
}
