// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=13118-101797
// source=packages/ui/src/components/sidebar/sidebar-units.tsx
// component=Sidebar.Group

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#16356:0')

// GroupLabel is not a standalone component in code — it's the `label` (and
// optional `actionIcon`/`onActionClick`) prop rendered inside Sidebar.Group.

export default {
  example: figma.code`<Sidebar.Group label="${text}" actionIcon="plus" onActionClick={() => {}}>...</Sidebar.Group>`,
  imports: ['import { Sidebar } from "@harnessio/ui/components"'],
  id: 'sidebar-group-label',
  metadata: {
    nestable: false
  }
}
