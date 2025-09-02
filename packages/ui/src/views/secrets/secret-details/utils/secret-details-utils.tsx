import { cloneDeep } from 'lodash-es'

import { IFormDefinition } from '@harnessio/forms'

/**
 * Adopt secret form definition to be used in secret details view
 */
export function adoptSecretFormDefinitionToView(formDefinition: IFormDefinition) {
  const viewDef = cloneDeep(formDefinition)

  // collect inputs at root level (inputs that are not in group)
  const notInGroupInputs = viewDef.inputs.filter(input => !['group', 'accordion'].includes(input.inputType))

  // remove inputs from root level (inputs that are not in group)
  viewDef.inputs = viewDef.inputs.filter(input => ['group', 'accordion'].includes(input.inputType))

  // NOTE: this works if we use accordion in all secret forms
  let resourcesGroup = viewDef.inputs
    .find(input => input.inputType === 'accordion')
    ?.inputs?.find(input => input.path === 'resources')

  // append notInGroupInputs at the beginning of resources group
  if (resourcesGroup) {
    resourcesGroup.inputs = [...notInGroupInputs, ...(resourcesGroup.inputs ?? [])]
  }
  // create new resources group with notInGroupInputs inputs and append at the beginning of formDef.inputs
  else {
    resourcesGroup = {
      inputType: 'group',
      path: `resources`,
      label: 'Resources',
      inputs: notInGroupInputs
    }
    viewDef.inputs.unshift(resourcesGroup)
  }

  return viewDef
}
