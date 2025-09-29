import { FC } from 'react'

import { PaginationPrimitive } from '../pagination-primitive'
import { ParentPaginationProps } from '../types'

interface PaginationItemsProps {
  totalPages: number
  currentPage: number
  goToPage?: (pageNum: number) => (e: React.MouseEvent) => void
  getPageLink?: (pageNum: number) => string
  truncateLimit: number
  variant?: ParentPaginationProps['variant']
}
export const PaginationItems: FC<PaginationItemsProps> = ({
  totalPages,
  currentPage,
  goToPage,
  getPageLink,
  truncateLimit,
  variant = 'default'
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
  const items: React.ReactElement[] = []

  // Always show the first page
  items.push(
    <PaginationPrimitive.Item key={1} className="cn-pagination-pages">
      <PaginationPrimitive.Link
        variant={variant}
        href={getPageLink?.(1)}
        onClick={goToPage?.(1)}
        isActive={currentPage === 1}
      >
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
        <PaginationPrimitive.Link
          variant={variant}
          isActive={currentPage === i}
          href={getPageLink?.(i)}
          onClick={goToPage?.(i)}
        >
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
          variant={variant}
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
