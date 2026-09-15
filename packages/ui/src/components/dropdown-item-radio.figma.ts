// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6020-319491
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenuRadioItem

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#5994:55')

const hasDescription = instance.getBoolean('description#5994:60')
const description = hasDescription ? instance.getString('description text#5994:65') : null

const hasLabel = instance.getBoolean('label#6020:89')
const label = hasLabel ? instance.getString('label-text#6020:80') : null

const hasShortcut = instance.getBoolean('shortcut#5994:40')
const shortcut = hasShortcut ? instance.getString('shortcut-text#6023:112') : null

export default {
  example: figma.code`
    <DropdownMenu.RadioGroup value="item">
      <DropdownMenu.RadioItem
        value="item"
        title="${text}"
        ${description ? figma.code`description="${description}"` : ''}
        ${label ? figma.code`label="${label}"` : ''}
        ${shortcut ? figma.code`shortcut="${shortcut}"` : ''}
      />
    </DropdownMenu.RadioGroup>
  `,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-item-radio',
  metadata: {
    nestable: true
  }
}
