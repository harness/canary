import { Layout } from '@components/layout'
import { Text } from '@components/text'

import { PaginationItems } from './components/pagination-items'
import { PaginationPrimitive } from './pagination-primitive'
import { type PaginationProps } from './types'

export function DataPagination({
  totalItems,
  pageSize,
  currentPage,
  hidePageNumbers = true,
  goToPage,
  getPageLink,
  hasNext,
  hasPrevious,
  getPrevPageLink,
  getNextPageLink,
  onPrevious,
  onNext,
  indeterminate = false
}: PaginationProps) {
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
    <Layout.Horizontal className="w-full mt-cn-xl" align="center" justify="between">
      <div>
        {totalPages && currentPage && (
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
        )}
      </div>

      <Layout.Horizontal gap="xs">
        {!indeterminate && totalPages && currentPage ? (
          <>
            <PaginationPrimitive.PreviousV2
              onClick={goToPage ? handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined) : undefined}
              href={getPageLink?.(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
            />

            {/* Pagination Items */}
            {!hidePageNumbers && totalPages && (
              <ul className="cn-pagination-content gap-cn-xs">
                <PaginationItems
                  variant="data"
                  totalPages={totalPages}
                  currentPage={currentPage}
                  getPageLink={getPageLink}
                  goToPage={goToPage ? handleGoToPage : undefined}
                  truncateLimit={5}
                />
              </ul>
            )}

            <PaginationPrimitive.NextV2
              onClick={goToPage ? handleGoToPage(currentPage < totalPages ? currentPage + 1 : undefined) : undefined}
              href={getPageLink?.(currentPage < totalPages ? currentPage + 1 : currentPage)}
              disabled={currentPage === totalPages}
            />
          </>
        ) : (
          <>
            <PaginationPrimitive.PreviousV2
              href={hasPrevious ? getPrevPageLink?.() : undefined}
              onClick={onPrevious}
              disabled={!hasPrevious}
            />
            <PaginationPrimitive.NextV2
              href={hasNext ? getNextPageLink?.() : undefined}
              onClick={onNext}
              disabled={!hasNext}
            />
          </>
        )}
      </Layout.Horizontal>
    </Layout.Horizontal>
  )
}
