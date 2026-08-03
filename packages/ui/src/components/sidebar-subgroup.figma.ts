// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=9109-81776
// source=packages/ui/src/components/sidebar/sidebar-item.tsx
// component=Sidebar.Item

import figma from 'figma'

// SubGroup is not a standalone component — it's Sidebar.Item rendered with
// `children`, which switches it into a collapsible-submenu trigger, with
// Sidebar.MenuSubItem rows nested inside.

export default {
  example: figma.code`
    <Sidebar.Item title="Group">
      <Sidebar.MenuSubItem title="Sub item" to="#" />
      <Sidebar.MenuSubItem title="Sub item" to="#" />
    </Sidebar.Item>
  `,
  imports: ['import { Sidebar } from "@harnessio/ui/components"'],
  id: 'sidebar-subgroup',
  metadata: {
    nestable: true
  }
}
