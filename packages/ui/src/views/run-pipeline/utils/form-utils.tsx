import { set } from 'lodash-es'

import { IFormDefinition } from '@harnessio/forms'

export function collectDefaultValues(formDefinition: IFormDefinition): Record<string, unknown> {
  let values = {}

  formDefinition.inputs.forEach(input => {
    if (input.default) {
      values = set(values, input.path, input.default)
    }
  })

  return values
}
