// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6020-320102
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenuIndicatorItem

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#5994:55')

const hasDescription = instance.getBoolean('description#5994:60')
const description = hasDescription ? instance.getString('description text#5994:65') : null

const hasLabel = instance.getBoolean('label#6020:70')
const label = hasLabel ? instance.getString('label-text#6020:75') : null

const checked = instance.getBoolean('selected-item#5994:36')

export default {
  example: figma.code`
    <DropdownMenu.IndicatorItem
      color="blue"
      title="${text}"
      ${description ? figma.code`description="${description}"` : ''}
      ${label ? figma.code`label="${label}"` : ''}
      ${checked ? 'checkmark' : ''}
    />
  `,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-item-color-selection',
  metadata: {
    nestable: true
  }
}
