// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6020-319743
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenuAvatarItem

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#5994:55')

const hasDescription = instance.getEnum('description', { on: true, off: false })
const description = hasDescription ? instance.getString('description text#5994:65') : null

const hasLabel = instance.getBoolean('label#6020:89')
const label = hasLabel ? instance.getString('label-text#6020:80') : null

const hasShortcut = instance.getBoolean('shortcut#5994:40')
const shortcut = hasShortcut ? instance.getString('shortcut-text#6023:121') : null

export default {
  example: figma.code`
    <DropdownMenu.AvatarItem
      name="${text}"
      title="${text}"
      ${description ? figma.code`description="${description}"` : ''}
      ${label ? figma.code`label="${label}"` : ''}
      ${shortcut ? figma.code`shortcut="${shortcut}"` : ''}
    />
  `,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-item-avatar',
  metadata: {
    nestable: true
  }
}
