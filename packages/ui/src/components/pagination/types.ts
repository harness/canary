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

export type ParentPaginationProps = PaginationProps & {
  variant?: 'default' | 'data'
}
