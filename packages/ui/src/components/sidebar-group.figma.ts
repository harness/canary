// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=9125-92264
// source=packages/ui/src/components/sidebar/sidebar-units.tsx
// component=Sidebar.Group

import figma from 'figma'

export default {
  example: figma.code`
    <Sidebar.Group label="Group label">
      <Sidebar.Item title="Item" />
      <Sidebar.Item title="Item" />
    </Sidebar.Group>
  `,
  imports: ['import { Sidebar } from "@harnessio/ui/components"'],
  id: 'sidebar-group',
  metadata: {
    nestable: true
  }
}
