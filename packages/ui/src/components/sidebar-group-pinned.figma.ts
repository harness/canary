// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=13130-125110
// source=packages/ui/src/components/sidebar/sidebar-units.tsx
// component=Sidebar.Group

import figma from 'figma'

// "Pinned" is not a separate variant/prop of Sidebar.Group — it's the same
// component rendered without a `label`, per SidebarView's usage.

export default {
  example: figma.code`
    <Sidebar.Group>
      <Sidebar.Item title="Item" active />
      <Sidebar.Item title="Item" />
    </Sidebar.Group>
  `,
  imports: ['import { Sidebar } from "@harnessio/ui/components"'],
  id: 'sidebar-group-pinned',
  metadata: {
    nestable: true
  }
}
