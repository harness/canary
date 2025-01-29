import { FC, MouseEvent, ReactElement } from 'react'

import { TFunction } from 'i18next'

import { Spacer } from './index'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './pagination'

interface PaginationItemsProps {
  totalPages: number
  currentPage: number
  goToPage: (pageNum: number) => (e: MouseEvent<HTMLAnchorElement>) => void
}

const PaginationItems: FC<PaginationItemsProps> = ({ totalPages, currentPage, goToPage }) => {
  const siblings = 2
  const items: ReactElement[] = []

  // Always show the first page
  items.push(
    <PaginationItem key={1}>
      <PaginationLink size="sm_icon" href="#" onClick={goToPage(1)} isActive={currentPage === 1}>
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
        <PaginationLink isActive={currentPage === i} size="sm_icon" href="#" onClick={goToPage(i)}>
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
      <PaginationLink size="sm_icon" onClick={goToPage(totalPages)} isActive={currentPage === totalPages}>
        {totalPages}
      </PaginationLink>
    </PaginationItem>
  )

  return <>{items}</>
}

interface PaginationComponentProps {
  currentPage: number
  goToPage: (pageNum: number) => void
  totalPages?: number
  nextPage?: number
  previousPage?: number
  t: TFunction
  className?: string
}

export const PaginationComponent: FC<PaginationComponentProps> = ({
  totalPages,
  nextPage,
  previousPage,
  currentPage,
  goToPage,
  className,
  t
}) => {
  /**
   * Handler for onClick that prevents the native navigation caused by href and calls goToPage.
   * @param val
   */
  const handleGoToPage = (val: number | undefined) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!val) return

    goToPage(val)
  }

  // Render nothing if `totalPages` is absent or <= 1, and both `nextPage` and `previousPage` are absent
  if ((!totalPages || totalPages <= 1) && !nextPage && !previousPage) {
    return null
  }

  return (
    <>
      <Spacer size={6} />
      <Pagination className={className}>
        {totalPages ? (
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                onClick={handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined)}
                disabled={currentPage === 1}
                t={t}
              />
            </PaginationItem>

            {/* Pagination Items */}
            {totalPages && (
              <PaginationItems totalPages={totalPages} currentPage={currentPage} goToPage={handleGoToPage} />
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                size="sm"
                onClick={handleGoToPage(currentPage < totalPages ? currentPage + 1 : undefined)}
                disabled={currentPage === totalPages}
                t={t}
              />
            </PaginationItem>
          </PaginationContent>
        ) : (
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                onClick={handleGoToPage(previousPage ? previousPage : undefined)}
                disabled={!previousPage}
                t={t}
              />
            </PaginationItem>
            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                size="sm"
                onClick={handleGoToPage(nextPage ? nextPage : undefined)}
                disabled={!nextPage}
                t={t}
              />
            </PaginationItem>
          </PaginationContent>
        )}
      </Pagination>
    </>
  )
}
