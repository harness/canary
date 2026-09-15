// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=7731-39502
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenuGroup

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('text#7731:21')

export default {
  example: figma.code`<DropdownMenu.Group label="${label}" />`,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-item-group-header',
  metadata: {
    nestable: true
  }
}
