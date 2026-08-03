// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11276-28703
// source=packages/ui/src/components/table.tsx
// component=Table.Cell

import figma from 'figma'

// The "variant" property on this Figma component (avatar+text, checkbox, commit, branch, etc.)
// represents illustrative cell content, not a code prop — Table.Cell just renders children.

export default {
  example: figma.code`<Table.Cell>Content</Table.Cell>`,
  imports: ['import { Table } from "@harnessio/ui/components"'],
  id: 'table-row-cell-default',
  metadata: {
    nestable: true
  }
}
