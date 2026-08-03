// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=10002-84504
// source=packages/ui/src/components/table.tsx
// component=Table.Footer

import figma from 'figma'

// This maps to Table.Root's paginationProps, not a standalone Table.Footer usage —
// Table.Footer is a defined primitive but DataTable renders pagination via Table.Root instead.

export default {
  example: figma.code`<Table.Root paginationProps={{ totalItems: 100, pageSize: 10, currentPage: 1 }}>...</Table.Root>`,
  imports: ['import { Table } from "@harnessio/ui/components"'],
  id: 'table-template-footer',
  metadata: {
    nestable: false
  }
}
