import { FC } from 'react'

import { cn } from '@utils/cn'

import { PaginationItems } from './components/pagination-items'
import { PaginationPrimitive } from './pagination-primitive'
import { PaginationProps } from './types'

export const DefaultPagination: FC<PaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  goToPage,
  getPageLink,
  hasNext,
  hasPrevious,
  className,
  getPrevPageLink,
  getNextPageLink,
  onPrevious,
  onNext,
  hidePageNumbers = false,
  indeterminate = false
}) => {
  const handleGoToPage = (selectedPage?: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedPage) return

    goToPage?.(selectedPage)
  }

  const totalPages = indeterminate || !totalItems || !pageSize ? undefined : Math.ceil(totalItems / pageSize)

  // Render nothing if `totalPages` is absent or <= 1, and both `nextPage` and `previousPage` are absent
  if ((!totalPages || totalPages <= 1) && hasNext === undefined && hasPrevious === undefined) {
    return null
  }

  return (
    <>
      <PaginationPrimitive.Root className={cn('mt-cn-xl', className)}>
        {!indeterminate && totalPages && currentPage ? (
          <PaginationPrimitive.Content
            className={cn({
              'cn-pagination-hide-pages': hidePageNumbers
            })}
          >
            {/* Previous Button */}
            <PaginationPrimitive.Item className="cn-pagination-item-previous">
              <PaginationPrimitive.Previous
                onClick={goToPage ? handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined) : undefined}
                href={getPageLink?.(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
              />
            </PaginationPrimitive.Item>

            {/* Pagination Items */}
            {!hidePageNumbers && totalPages && (
              <PaginationItems
                totalPages={totalPages}
                currentPage={currentPage}
                getPageLink={getPageLink}
                goToPage={goToPage ? handleGoToPage : undefined}
                truncateLimit={5}
              />
            )}

            {/* Next Button */}
            <PaginationPrimitive.Item className="cn-pagination-item-next">
              <PaginationPrimitive.Next
                onClick={goToPage ? handleGoToPage(currentPage < totalPages ? currentPage + 1 : undefined) : undefined}
                href={getPageLink?.(currentPage < totalPages ? currentPage + 1 : currentPage)}
                disabled={currentPage === totalPages}
              />
            </PaginationPrimitive.Item>
          </PaginationPrimitive.Content>
        ) : (
          <PaginationPrimitive.Content className="cn-pagination-hide-pages">
            {/* Previous Button */}
            <PaginationPrimitive.Item className="cn-pagination-item-previous">
              <PaginationPrimitive.Previous
                href={hasPrevious ? getPrevPageLink?.() : undefined}
                onClick={onPrevious}
                disabled={!hasPrevious}
              />
            </PaginationPrimitive.Item>
            {/* Next Button */}
            <PaginationPrimitive.Item className="cn-pagination-item-next">
              <PaginationPrimitive.Next
                href={hasNext ? getNextPageLink?.() : undefined}
                onClick={onNext}
                disabled={!hasNext}
              />
            </PaginationPrimitive.Item>
          </PaginationPrimitive.Content>
        )}
      </PaginationPrimitive.Root>
    </>
  )
}

DefaultPagination.displayName = 'DefaultPagination'
