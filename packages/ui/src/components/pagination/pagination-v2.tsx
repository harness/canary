import { Layout } from '@components/layout'
import { Text } from '@components/text'
import { isEmpty } from 'lodash-es'

import { PaginationProps } from './pagination'
import { PaginationPrimitive } from './pagination-primitive'

export function PaginationV2({
  totalItems,
  pageSize,
  currentPage,
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
    <Layout.Horizontal className="w-full" align="center" justify="between">
      <div>
        {!isEmpty(totalPages) && !isEmpty(currentPage) && (
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
            <PaginationPrimitive.NextV2
              onClick={goToPage ? handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined) : undefined}
              href={getPageLink?.(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
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

        {/* <PaginationPrimitive.PreviousV2
          onClick={goToPage ? handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined) : undefined}
          href={getPageLink?.(currentPage > 1 ? currentPage - 1 : currentPage)}
          disabled={currentPage === 1}
        />

        <PaginationPrimitive.NextV2
          onClick={goToPage ? handleGoToPage(currentPage < totalPages ? currentPage + 1 : undefined) : undefined}
          href={getPageLink?.(currentPage < totalPages ? currentPage + 1 : currentPage)}
          disabled={currentPage === totalPages}
        /> */}
      </Layout.Horizontal>
    </Layout.Horizontal>
  )
}
