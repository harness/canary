// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=16537-124027
// source=packages/ui/src/components/sidebar/sidebar-item.tsx
// component=Sidebar.Item

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#3278:82')
const hasBadge = instance.getBoolean('badge#13118:23')
const active = instance.getEnum('selected', { on: true, off: false })
const draggable = instance.getEnum('draggable', { on: true, off: false })

export default {
  example: figma.code`
    <Sidebar.Item
      title="${text}"
      ${active ? 'active' : ''}
      ${hasBadge ? 'badge="New"' : ''}
      ${draggable ? 'draggable' : ''}
    />
  `,
  imports: ['import { Sidebar } from "@harnessio/ui/components"'],
  id: 'sidebar-menu-button-pinned',
  metadata: {
    nestable: true
  }
}
