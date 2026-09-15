// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6591-47146
// source=packages/ui/src/components/pagination/pagination.tsx
// component=Pagination

import figma from 'figma'

// `.PaginationPages` is a dot-prefixed internal helper hidden from the Assets panel — its
// page-number buttons can't be Code-Connect-mapped, so this example only covers the
// Previous/Next affordance that `arrows only=on` shows.

export default {
  example: figma.code`
    <Pagination
      totalItems={100}
      pageSize={10}
      currentPage={1}
      goToPage={(page) => {}}
    />
  `,
  imports: ['import { Pagination } from "@harnessio/ui/components"'],
  id: 'pagination',
  metadata: {
    nestable: false
  }
}
