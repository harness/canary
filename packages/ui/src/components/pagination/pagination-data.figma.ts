// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=12458-64327
// source=packages/ui/src/components/pagination/pagination.tsx
// component=Pagination

import figma from 'figma'

const instance = figma.selectedInstance

const showItemsPerPage = instance.getEnum('items per page', {
  on: true,
  off: false
})

// `.PaginationSelection` is a dot-prefixed internal helper hidden from the Assets panel and
// can't be Code-Connect-mapped, so its nested items-per-page control isn't resolved dynamically here.

export default {
  example: figma.code`
    <Pagination
      totalItems={100}
      pageSize={10}
      currentPage={1}
      goToPage={(page) => {}}
      ${showItemsPerPage ? 'pageSizeOptions={[10, 25, 50]}' : ''}
      ${showItemsPerPage ? 'onPageSizeChange={(size) => {}}' : ''}
    />
  `,
  imports: ['import { Pagination } from "@harnessio/ui/components"'],
  id: 'pagination-data',
  metadata: {
    nestable: false
  }
}
