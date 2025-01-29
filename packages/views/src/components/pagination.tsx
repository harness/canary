import { noop } from 'lodash-es'

import {
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@harnessio/canary'

interface PaginationComponentProps {
  currentPage: number
  goToPage: (pageNum: number) => void
  totalPages?: number
  nextPage?: number
  previousPage?: number
}

interface PaginationItemsProps {
  totalPages: number
  currentPage: number
  goToPage: (pageNum: number) => void
}

const PaginationItems: React.FC<PaginationItemsProps> = ({ totalPages, currentPage, goToPage }) => {
  const siblings = 2
  const items: React.ReactElement[] = []

  // Always show the first page
  items.push(
    <PaginationItem key={1}>
      <PaginationLink size="sm_icon" href="#" onClick={() => goToPage(1)} isActive={currentPage === 1}>
        1
      </PaginationLink>
    </PaginationItem>
  )

  // Add ellipsis if needed
  if (currentPage > 2 + siblings) {
    items.push(
      <PaginationItem key="start-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    )
  }

  // Pages around the current page
  for (let i = Math.max(2, currentPage - siblings); i <= Math.min(totalPages - 1, currentPage + siblings); i++) {
    items.push(
      <PaginationItem key={i}>
        <PaginationLink isActive={currentPage === i} size="sm_icon" href="#" onClick={() => goToPage(i)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    )
  }

  // Add ellipsis if needed
  if (currentPage < totalPages - siblings - 1) {
    items.push(
      <PaginationItem key="end-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    )
  }

  // Always show the last page
  items.push(
    <PaginationItem key={totalPages}>
      <PaginationLink
        size="sm_icon"
        href="#"
        onClick={() => goToPage(totalPages)}
        isActive={currentPage === totalPages}
      >
        {totalPages}
      </PaginationLink>
    </PaginationItem>
  )

  return <>{items}</>
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalPages,
  nextPage,
  previousPage,
  currentPage,
  goToPage
}) => {
  // Render nothing if `totalPages` is absent or <= 1, and both `nextPage` and `previousPage` are absent
  if ((!totalPages || totalPages <= 1) && !nextPage && !previousPage) {
    return null
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <ListPagination.Root>
      <Pagination>
        {totalPages ? (
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                href="#"
                onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {/* Pagination Items */}
            {totalPages && <PaginationItems totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                size="sm"
                href="#"
                onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        ) : (
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                href="#"
                onClick={() => (previousPage ? goToPage(previousPage) : noop)}
                disabled={!previousPage}
              />
            </PaginationItem>
            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                size="sm"
                href="#"
                onClick={() => (nextPage ? goToPage(nextPage) : noop)}
                disabled={!nextPage}
              />
            </PaginationItem>
          </PaginationContent>
        )}
      </Pagination>
    </ListPagination.Root>
  )
}
