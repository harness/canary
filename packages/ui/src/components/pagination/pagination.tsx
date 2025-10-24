import { FC, MouseEvent, ReactElement } from 'react'

import { Spacer } from '@/components'
import { TFunction } from 'i18next'

import { PaginationPrimitive } from './pagination-primitive'

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
    <PaginationPrimitive.Item key={1}>
      <PaginationPrimitive.Link size="sm_icon" href="#" onClick={goToPage(1)} isActive={currentPage === 1}>
        1
      </PaginationPrimitive.Link>
    </PaginationPrimitive.Item>
  )

  // Add ellipsis if needed
  if (currentPage > 2 + siblings) {
    items.push(
      <PaginationPrimitive.Item key="start-ellipsis">
        <PaginationPrimitive.Ellipsis />
      </PaginationPrimitive.Item>
    )
  }

  // Pages around the current page
  for (let i = Math.max(2, currentPage - siblings); i <= Math.min(totalPages - 1, currentPage + siblings); i++) {
    items.push(
      <PaginationPrimitive.Item key={i}>
        <PaginationPrimitive.Link isActive={currentPage === i} size="sm_icon" href="#" onClick={goToPage(i)}>
          {i}
        </PaginationPrimitive.Link>
      </PaginationPrimitive.Item>
    )
  }

  // Add ellipsis if needed
  if (currentPage < totalPages - siblings - 1) {
    items.push(
      <PaginationPrimitive.Item key="end-ellipsis">
        <PaginationPrimitive.Ellipsis />
      </PaginationPrimitive.Item>
    )
  }

  // Always show the last page
  items.push(
    <PaginationPrimitive.Item key={totalPages}>
      <PaginationPrimitive.Link size="sm_icon" onClick={goToPage(totalPages)} isActive={currentPage === totalPages}>
        {totalPages}
      </PaginationPrimitive.Link>
    </PaginationPrimitive.Item>
  )

  return <>{items}</>
}

interface PaginationProps {
  currentPage: number
  goToPage: (pageNum: number) => void
  totalPages?: number
  nextPage?: number
  previousPage?: number
  className?: string
  t: TFunction
}

export const Pagination: FC<PaginationProps> = ({
  totalPages,
  nextPage,
  previousPage,
  currentPage,
  goToPage,
  className,
  t
}) => {
  const handleGoToPage = (val?: number) => (e: MouseEvent<HTMLAnchorElement>) => {
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
      <PaginationPrimitive.Root className={className}>
        {totalPages ? (
          <PaginationPrimitive.Content>
            {/* Previous Button */}
            <PaginationPrimitive.Item>
              <PaginationPrimitive.Previous
                size="sm"
                onClick={handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined)}
                disabled={currentPage === 1}
                t={t}
              />
            </PaginationPrimitive.Item>

            {/* Pagination Items */}
            {totalPages && (
              <PaginationItems totalPages={totalPages} currentPage={currentPage} goToPage={handleGoToPage} />
            )}

            {/* Next Button */}
            <PaginationPrimitive.Item>
              <PaginationPrimitive.Next
                size="sm"
                onClick={handleGoToPage(currentPage < totalPages ? currentPage + 1 : undefined)}
                disabled={currentPage === totalPages}
                t={t}
              />
            </PaginationPrimitive.Item>
          </PaginationPrimitive.Content>
        ) : (
          <PaginationPrimitive.Content>
            {/* Previous Button */}
            <PaginationPrimitive.Item>
              <PaginationPrimitive.Previous
                size="sm"
                onClick={handleGoToPage(previousPage ?? undefined)}
                disabled={!previousPage}
                t={t}
              />
            </PaginationPrimitive.Item>
            {/* Next Button */}
            <PaginationPrimitive.Item>
              <PaginationPrimitive.Next
                size="sm"
                onClick={handleGoToPage(nextPage ?? undefined)}
                disabled={!nextPage}
                t={t}
              />
            </PaginationPrimitive.Item>
          </PaginationPrimitive.Content>
        )}
      </PaginationPrimitive.Root>
    </>
  )
}

Pagination.displayName = 'Pagination'
