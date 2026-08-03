// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11631-118218
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenuSlot

import figma from 'figma'

export default {
  example: figma.code`<DropdownMenu.Slot>Custom content</DropdownMenu.Slot>`,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-item-custom',
  metadata: {
    nestable: true
  }
}
