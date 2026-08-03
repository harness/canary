// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=5231-7711
// source=packages/ui/src/components/form-primitives/label.tsx
// component=Label

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('text#1985:0')
const optional = instance.getBoolean('show (optional)#6270:0')

const informer = instance.getEnum('informer', {
  on: true,
  off: false
})

const tooltipContent = informer
  ? instance.findText('text', { traverseInstances: true, path: ['❖Label/TooltipProp', '❖ Tooltip'] }).textContent
  : null

export default {
  example: figma.code`
    <Label
      optional={${optional}}
      ${tooltipContent ? figma.code`tooltipContent="${tooltipContent}"` : ''}
    >
      ${label}
    </Label>
  `,
  imports: ['import { Label } from "@harnessio/ui/components"'],
  id: 'label',
  metadata: {
    nestable: true
  }
}
