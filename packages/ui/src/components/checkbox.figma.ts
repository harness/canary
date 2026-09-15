// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=742-57572
// source=packages/ui/src/components/checkbox.tsx
// component=Checkbox

import figma from 'figma'

const instance = figma.selectedInstance

const selected = instance.getEnum('selected', {
  on: true,
  off: false
})

const indeterminate = instance.getEnum('indeterminate', {
  on: true,
  off: false
})

const checked = indeterminate ? "'indeterminate'" : selected

const disabled = instance.getEnum('disabled', {
  off: false,
  on: true
})

const error = instance.getEnum('error', {
  off: false,
  on: true
})

const checkboxOnly = instance.getEnum('checkbox only', {
  on: true,
  off: false
})

const showDescription = instance.getBoolean('show description#48:23')
const description = instance.getString('description text#48:20')

const label = checkboxOnly
  ? null
  : instance.findText('text', { traverseInstances: true, path: ['❖ label'] }).textContent

export default {
  example: figma.code`
    <Checkbox
      checked={${checked}}
      disabled={${disabled}}
      error={${error}}
      ${label ? figma.code`label="${label}"` : ''}
      ${showDescription ? figma.code`caption="${description}"` : ''}
    />
  `,
  imports: ['import { Checkbox } from "@harnessio/ui/components"'],
  id: 'checkbox',
  metadata: {
    nestable: true
  }
}
