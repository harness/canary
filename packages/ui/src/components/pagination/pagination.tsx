import { FC, MouseEvent, ReactElement } from 'react'

import { Spacer } from '@/components'
import { cn } from '@utils/cn'

import { PaginationPrimitive } from './pagination-primitive'

interface PaginationItemsProps {
  totalPages: number
  currentPage: number
  goToPage?: (pageNum: number) => (e: React.MouseEvent) => void
  getPageLink?: (pageNum: number) => string
  truncateLimit: number
}

const PaginationItems: FC<PaginationItemsProps> = ({
  totalPages,
  currentPage,
  goToPage,
  getPageLink,
  truncateLimit
}) => {
  // Calculate how many siblings to show around the current page
  // The total visible pages would be: first + last + current + (siblings * 2) + 2 ellipses (at most)
  // So we derive siblings from truncateLimit to ensure we don't exceed the limit
  const siblings = Math.max(1, Math.floor((truncateLimit - 3) / 2))

  // Special handling for pages near the beginning or end
  let leftBound, rightBound

  if (currentPage <= Math.ceil(truncateLimit / 2)) {
    // Near the beginning - show first truncateLimit pages
    leftBound = 2
    rightBound = Math.min(totalPages - 1, truncateLimit)
  } else if (currentPage > totalPages - Math.ceil(truncateLimit / 2)) {
    // Near the end - show last truncateLimit pages
    leftBound = Math.max(2, totalPages - truncateLimit + 1)
    rightBound = totalPages - 1
  } else {
    // In the middle - show siblings on both sides
    leftBound = Math.max(2, currentPage - siblings)
    rightBound = Math.min(totalPages - 1, currentPage + siblings)
  }
  const items: ReactElement[] = []

  // Always show the first page
  items.push(
    <PaginationPrimitive.Item key={1} className="cn-pagination-pages">
      <PaginationPrimitive.Link href={getPageLink?.(1)} onClick={goToPage?.(1)} isActive={currentPage === 1}>
        1
      </PaginationPrimitive.Link>
    </PaginationPrimitive.Item>
  )

  // Add ellipsis if needed
  if (leftBound > 2) {
    items.push(
      <PaginationPrimitive.Item key="start-ellipsis" className="cn-pagination-pages">
        <PaginationPrimitive.Ellipsis />
      </PaginationPrimitive.Item>
    )
  }

  // Pages around the current page
  for (let i = leftBound; i <= rightBound; i++) {
    items.push(
      <PaginationPrimitive.Item key={i} className="cn-pagination-pages">
        <PaginationPrimitive.Link isActive={currentPage === i} href={getPageLink?.(i)} onClick={goToPage?.(i)}>
          {i}
        </PaginationPrimitive.Link>
      </PaginationPrimitive.Item>
    )
  }

  // Add ellipsis if needed
  if (rightBound < totalPages - 1) {
    items.push(
      <PaginationPrimitive.Item key="end-ellipsis" className="cn-pagination-pages">
        <PaginationPrimitive.Ellipsis />
      </PaginationPrimitive.Item>
    )
  }

  // Always show the last page if it's different from the first page
  if (totalPages > 1) {
    items.push(
      <PaginationPrimitive.Item key={totalPages} className="cn-pagination-pages">
        <PaginationPrimitive.Link
          href={getPageLink?.(totalPages)}
          onClick={goToPage?.(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationPrimitive.Link>
      </PaginationPrimitive.Item>
    )
  }

  return <>{items}</>
}

interface PaginationBaseProps {
  className?: string
}

type DeterminatePaginationNavProps =
  | { goToPage: (page: number) => void; getPageLink?: never }
  | { goToPage?: never; getPageLink: (page: number) => string }

type IndeterminatePaginationNavProps =
  | { onPrevious: () => void; onNext: () => void; getPrevPageLink?: never; getNextPageLink?: never }
  | { onPrevious?: never; onNext?: never; getPrevPageLink: () => string; getNextPageLink: () => string }

type DeterminatePaginationProps = PaginationBaseProps &
  DeterminatePaginationNavProps & {
    totalItems: number
    pageSize: number
    currentPage: number
    hidePageNumbers?: boolean
    indeterminate?: false

    hasPrevious?: never
    hasNext?: never
    getPrevPageLink?: never
    getNextPageLink?: never
    onPrevious?: never
    onNext?: never
  }

type IndeterminatePaginationProps = PaginationBaseProps &
  IndeterminatePaginationNavProps & {
    hasPrevious?: boolean
    hasNext?: boolean
    indeterminate: true

    goToPage?: never
    getPageLink?: never
    totalItems?: never
    pageSize?: never
    currentPage?: never
    hidePageNumbers?: never
  }

export type PaginationProps = DeterminatePaginationProps | IndeterminatePaginationProps

export const Pagination: FC<PaginationProps> = ({
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
  if ((!totalPages || totalPages <= 1) && !hasNext && !hasPrevious) {
    return null
  }

  return (
    <>
      <Spacer size={6} />
      <PaginationPrimitive.Root className={className}>
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
              <PaginationPrimitive.Previous href={getPrevPageLink?.()} onClick={onPrevious} disabled={!hasPrevious} />
            </PaginationPrimitive.Item>
            {/* Next Button */}
            <PaginationPrimitive.Item className="cn-pagination-item-next">
              <PaginationPrimitive.Next href={getNextPageLink?.()} onClick={onNext} disabled={!hasNext} />
            </PaginationPrimitive.Item>
          </PaginationPrimitive.Content>
        )}
      </PaginationPrimitive.Root>
    </>
  )
}

Pagination.displayName = 'Pagination'
