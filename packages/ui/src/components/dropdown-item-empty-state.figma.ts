// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6968-63763
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenuNoOptions

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#11867:1')

export default {
  example: figma.code`<DropdownMenu.NoOptions>${text}</DropdownMenu.NoOptions>`,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-item-empty-state',
  metadata: {
    nestable: true
  }
}
