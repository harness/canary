import { Select } from '@components/form-primitives'
import { Layout } from '@components/layout'
import { Separator } from '@components/separator'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { PaginationPrimitive } from './pagination-primitive'
import { type PaginationProps } from './types'

export function Pagination({
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  currentPage,
  goToPage,
  getPageLink,
  hasNext,
  hasPrevious,
  getPrevPageLink,
  getNextPageLink,
  onPrevious,
  onNext,
  indeterminate = false,
  className
}: PaginationProps) {
  const handleGoToPage = (selectedPage?: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedPage) return

    goToPage?.(selectedPage)
  }

  const totalPages = indeterminate || !totalItems || !pageSize ? undefined : Math.ceil(totalItems / pageSize)

  // Render nothing if `totalPages` is absent, and both `nextPage` and `previousPage` are absent
  if (!totalPages && hasNext === undefined && hasPrevious === undefined) {
    return null
  }

  const handleChangePageSize = (value: number) => {
    onPageSizeChange?.(value)
  }

  const renderItemsPerPageBlock = () => {
    if (!onPageSizeChange) return null

    const options = pageSizeOptions.map(option => ({ label: option, value: option }))

    return (
      <>
        <Layout.Horizontal align="center" gap="xs">
          <Select options={options} value={pageSize} onChange={handleChangePageSize} size="sm" />
          <Text>items per page</Text>
        </Layout.Horizontal>

        <Separator orientation="vertical" className="h-8" />
      </>
    )
  }

  return (
    <Layout.Horizontal className={cn('mt-cn-xl w-full', className)} align="center" justify="between">
      <div>
        {totalPages && currentPage && (
          <Layout.Horizontal align="center" gap="md">
            {renderItemsPerPageBlock()}

            <Text>
              Page {currentPage} of {totalPages}
            </Text>
          </Layout.Horizontal>
        )}
      </div>

      <Layout.Horizontal gap="xs">
        {!indeterminate && totalPages && currentPage ? (
          <>
            <PaginationPrimitive.Previous
              onClick={goToPage ? handleGoToPage(currentPage > 1 ? currentPage - 1 : undefined) : undefined}
              href={getPageLink?.(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
            />

            {/* Pagination Items */}
            {/* {!showPageNumbers && totalPages && (
              <ul className="cn-pagination-content gap-cn-xs">
                <PaginationItems
                  totalPages={totalPages}
                  currentPage={currentPage}
                  getPageLink={getPageLink}
                  goToPage={goToPage ? handleGoToPage : undefined}
                  truncateLimit={5}
                />
              </ul>
            )} */}

            <PaginationPrimitive.Next
              onClick={goToPage ? handleGoToPage(currentPage < totalPages ? currentPage + 1 : undefined) : undefined}
              href={getPageLink?.(currentPage < totalPages ? currentPage + 1 : currentPage)}
              disabled={currentPage === totalPages}
            />
          </>
        ) : (
          <>
            <PaginationPrimitive.Previous
              href={hasPrevious ? getPrevPageLink?.() : undefined}
              onClick={onPrevious}
              disabled={!hasPrevious}
            />
            <PaginationPrimitive.Next
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
