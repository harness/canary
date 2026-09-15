// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=995-12100
// source=packages/ui/src/components/dropdown-menu.tsx
// component=DropdownMenu

import figma from 'figma'

const instance = figma.selectedInstance

const hasHeader = instance.getBoolean('header#5994:9')
const hasFooter = instance.getBoolean('footer#5994:10')

export default {
  example: figma.code`
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>Open</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        ${hasHeader ? '<DropdownMenu.Header>Header</DropdownMenu.Header>' : ''}
        <DropdownMenu.Item title="Item" />
        ${hasFooter ? '<DropdownMenu.Footer>Footer</DropdownMenu.Footer>' : ''}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  `,
  imports: ['import { DropdownMenu } from "@harnessio/ui/components"'],
  id: 'dropdown-menu',
  metadata: {
    nestable: false
  }
}
