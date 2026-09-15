// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11631-118134
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenu

import figma from 'figma'

const instance = figma.selectedInstance

const hasHeader = instance.getBoolean('header#11631:2')
const hasFooter = instance.getBoolean('footer#11631:3')

export default {
  example: figma.code`
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>Open</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        ${hasHeader ? '<DropdownMenu.Header>Header</DropdownMenu.Header>' : ''}
        <DropdownMenu.Slot>Custom content</DropdownMenu.Slot>
        ${hasFooter ? '<DropdownMenu.Footer>Footer</DropdownMenu.Footer>' : ''}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  `,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-menu-custom',
  metadata: {
    nestable: false
  }
}
