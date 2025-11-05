import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Pagination } from '../pagination'
import { PaginationPrimitive } from '../pagination-primitive'

// Mock router context
vi.mock('@/context', async () => {
  const actual = await vi.importActual('@/context')
  return {
    ...actual,
    useRouterContext: () => ({
      Link: ({ to, children, ...props }: any) => (
        <a href={to} {...props}>
          {children}
        </a>
      )
    }),
    useTranslation: () => ({
      t: (key: string, defaultValue: string) => defaultValue
    })
  }
})

const renderComponent = (props: React.ComponentProps<typeof Pagination>) => {
  return render(<Pagination {...props} />)
}

describe('Pagination', () => {
  describe('Basic Rendering', () => {
    test('should render pagination component', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      expect(screen.getByText('Page 1 of 10')).toBeInTheDocument()
    })

    test('should render nothing when no totalPages and no navigation props', () => {
      const { container } = renderComponent({
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      } as any)

      expect(container.firstChild).toBeNull()
    })

    test('should calculate total pages correctly', () => {
      renderComponent({
        totalItems: 95,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      expect(screen.getByText('Page 1 of 10')).toBeInTheDocument()
    })

    test('should handle exact division of total items', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      expect(screen.getByText('Page 1 of 10')).toBeInTheDocument()
    })
  })

  describe('Navigation with goToPage', () => {
    test('should render previous button', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 2,
        goToPage: vi.fn()
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton).toBeInTheDocument()
    })

    test('should render next button', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      const nextButton = screen.getByLabelText('Go to next page')
      expect(nextButton).toBeInTheDocument()
    })

    test('should call goToPage on previous click', async () => {
      const goToPage = vi.fn()
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 5,
        goToPage
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      await userEvent.click(prevButton)

      expect(goToPage).toHaveBeenCalledWith(4)
    })

    test('should call goToPage on next click', async () => {
      const goToPage = vi.fn()
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 5,
        goToPage
      })

      const nextButton = screen.getByLabelText('Go to next page')
      await userEvent.click(nextButton)

      expect(goToPage).toHaveBeenCalledWith(6)
    })

    test('should disable previous on first page', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton.closest('button')).toBeDisabled()
    })

    test('should disable next on last page', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 10,
        goToPage: vi.fn()
      })

      const nextButton = screen.getByLabelText('Go to next page')
      expect(nextButton.closest('button')).toBeDisabled()
    })

    test('should not call goToPage when on first page clicking previous', async () => {
      const goToPage = vi.fn()
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      await userEvent.click(prevButton)

      expect(goToPage).not.toHaveBeenCalled()
    })

    test('should not call goToPage when on last page clicking next', async () => {
      const goToPage = vi.fn()
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 10,
        goToPage
      })

      const nextButton = screen.getByLabelText('Go to next page')
      await userEvent.click(nextButton)

      expect(goToPage).not.toHaveBeenCalled()
    })
  })

  describe('Navigation with getPageLink', () => {
    test('should render links when getPageLink provided', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 5,
        getPageLink: (page: number) => `/items?page=${page}`
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton).toHaveAttribute('href', '/items?page=4')
    })

    test('should set correct href for next link', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 5,
        getPageLink: (page: number) => `/items?page=${page}`
      })

      const nextButton = screen.getByLabelText('Go to next page')
      expect(nextButton).toHaveAttribute('href', '/items?page=6')
    })

    test('should keep same page link when disabled', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        getPageLink: (page: number) => `/items?page=${page}`
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton).toHaveAttribute('href', '/items?page=1')
    })
  })

  describe('Indeterminate Pagination', () => {
    test('should render with hasNext and hasPrevious', () => {
      renderComponent({
        indeterminate: true,
        hasNext: true,
        hasPrevious: true,
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        currentPage: 2
      })

      expect(screen.getByText('Page 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()
    })

    test('should call onPrevious when clicking previous', async () => {
      const onPrevious = vi.fn()
      renderComponent({
        indeterminate: true,
        hasNext: true,
        hasPrevious: true,
        onNext: vi.fn(),
        onPrevious
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      await userEvent.click(prevButton)

      expect(onPrevious).toHaveBeenCalled()
    })

    test('should call onNext when clicking next', async () => {
      const onNext = vi.fn()
      renderComponent({
        indeterminate: true,
        hasNext: true,
        hasPrevious: true,
        onNext,
        onPrevious: vi.fn()
      })

      const nextButton = screen.getByLabelText('Go to next page')
      await userEvent.click(nextButton)

      expect(onNext).toHaveBeenCalled()
    })

    test('should disable previous when hasPrevious is false', () => {
      renderComponent({
        indeterminate: true,
        hasNext: true,
        hasPrevious: false,
        onNext: vi.fn(),
        onPrevious: vi.fn()
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      expect(prevButton.closest('button')).toBeDisabled()
    })

    test('should disable next when hasNext is false', () => {
      renderComponent({
        indeterminate: true,
        hasNext: false,
        hasPrevious: true,
        onNext: vi.fn(),
        onPrevious: vi.fn()
      })

      const nextButton = screen.getByLabelText('Go to next page')
      expect(nextButton.closest('button')).toBeDisabled()
    })

    test('should use link navigation with getPrevPageLink and getNextPageLink', () => {
      renderComponent({
        indeterminate: true,
        hasNext: true,
        hasPrevious: true,
        getPrevPageLink: () => '/prev',
        getNextPageLink: () => '/next'
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      const nextButton = screen.getByLabelText('Go to next page')

      expect(prevButton).toHaveAttribute('href', '/prev')
      expect(nextButton).toHaveAttribute('href', '/next')
    })
  })

  describe('Page Size Selector', () => {
    test('should render page size selector when onPageSizeChange provided', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn(),
        onPageSizeChange: vi.fn()
      })

      expect(screen.getByText('items per page')).toBeInTheDocument()
    })

    test('should not render page size selector when onPageSizeChange not provided', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      expect(screen.queryByText('items per page')).not.toBeInTheDocument()
    })

    test('should use default page size options', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn(),
        onPageSizeChange: vi.fn()
      })

      // Default options are [10, 25, 50]
      expect(screen.getByText('items per page')).toBeInTheDocument()
    })

    test('should use custom page size options', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 20,
        currentPage: 1,
        goToPage: vi.fn(),
        onPageSizeChange: vi.fn(),
        pageSizeOptions: [20, 40, 60]
      })

      expect(screen.getByText('items per page')).toBeInTheDocument()
    })

    test('should display both page size selector and page info', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn(),
        onPageSizeChange: vi.fn()
      })

      // Both components should be visible
      expect(screen.getByText('items per page')).toBeInTheDocument()
      expect(screen.getByText('Page 1 of 10')).toBeInTheDocument()
    })

    test('should handle page size change through Select component', () => {
      const onPageSizeChange = vi.fn()
      const { container } = renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn(),
        onPageSizeChange,
        pageSizeOptions: [10, 25, 50]
      })

      // The Select component should be rendered
      const select = container.querySelector('.cn-select')
      expect(select).toBeInTheDocument()
    })
  })

  describe('Page Info Display', () => {
    test('should display page info with total pages', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 5,
        goToPage: vi.fn()
      })

      expect(screen.getByText('Page 5 of 10')).toBeInTheDocument()
    })

    test('should display page info without total when indeterminate', () => {
      renderComponent({
        indeterminate: true,
        currentPage: 3,
        hasNext: true,
        hasPrevious: true,
        onNext: vi.fn(),
        onPrevious: vi.fn()
      })

      expect(screen.getByText('Page 3')).toBeInTheDocument()
    })

    test('should not display page info when currentPage not provided', () => {
      renderComponent({
        indeterminate: true,
        hasNext: true,
        hasPrevious: true,
        onNext: vi.fn(),
        onPrevious: vi.fn()
      })

      expect(screen.queryByText(/Page/)).not.toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn(),
        className: 'custom-pagination'
      })

      const pagination = container.querySelector('.custom-pagination')
      expect(pagination).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle single page', () => {
      renderComponent({
        totalItems: 5,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      })

      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()

      const prevButton = screen.getByLabelText('Go to previous page')
      const nextButton = screen.getByLabelText('Go to next page')

      expect(prevButton.closest('button')).toBeDisabled()
      expect(nextButton.closest('button')).toBeDisabled()
    })

    test('should handle large page numbers', () => {
      renderComponent({
        totalItems: 10000,
        pageSize: 10,
        currentPage: 999,
        goToPage: vi.fn()
      })

      expect(screen.getByText('Page 999 of 1000')).toBeInTheDocument()
    })

    test('should handle last page navigation', async () => {
      const goToPage = vi.fn()
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 10,
        goToPage
      })

      const prevButton = screen.getByLabelText('Go to previous page')
      await userEvent.click(prevButton)

      expect(goToPage).toHaveBeenCalledWith(9)
    })
  })

  describe('Complete Pagination', () => {
    test('should render full pagination with all features', () => {
      renderComponent({
        totalItems: 100,
        pageSize: 10,
        currentPage: 5,
        goToPage: vi.fn(),
        onPageSizeChange: vi.fn(),
        pageSizeOptions: [10, 25, 50, 100]
      })

      expect(screen.getByText('Page 5 of 10')).toBeInTheDocument()
      expect(screen.getByText('items per page')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()
    })
  })
})

describe('PaginationPrimitive', () => {
  describe('PaginationPrimitive.Link', () => {
    test('should throw error when neither onClick nor href provided', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<PaginationPrimitive.Link>Link</PaginationPrimitive.Link>)
      }).toThrow('PaginationPrimitiveLink must have either onClick or href')

      consoleError.mockRestore()
    })

    test('should render as button when onClick provided', () => {
      const onClick = vi.fn()
      render(<PaginationPrimitive.Link onClick={onClick}>Click Me</PaginationPrimitive.Link>)

      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    test('should render as link when href provided', () => {
      render(<PaginationPrimitive.Link href="/page/2">Page 2</PaginationPrimitive.Link>)

      const link = screen.getByRole('link', { name: /page 2/i })
      expect(link).toBeInTheDocument()
    })

    test('should prevent click on disabled link', async () => {
      render(
        <PaginationPrimitive.Link href="/page/2" disabled>
          Page 2
        </PaginationPrimitive.Link>
      )

      const link = screen.getByRole('link', { name: /page 2/i })
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      link.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should apply active state', () => {
      const { container } = render(
        <PaginationPrimitive.Link href="/page/2" isActive>
          Page 2
        </PaginationPrimitive.Link>
      )

      const link = container.querySelector('.cn-button-active')
      expect(link).toBeInTheDocument()
    })

    test('should apply disabled state', () => {
      const { container } = render(
        <PaginationPrimitive.Link href="/page/2" disabled>
          Page 2
        </PaginationPrimitive.Link>
      )

      const link = container.querySelector('.cn-button-disabled')
      expect(link).toBeInTheDocument()
    })
  })

  describe('PaginationPrimitive.Ellipsis', () => {
    test('should render ellipsis', () => {
      render(<PaginationPrimitive.Ellipsis />)

      expect(screen.getByText('...')).toBeInTheDocument()
    })

    test('should have aria-hidden attribute', () => {
      const { container } = render(<PaginationPrimitive.Ellipsis />)

      const ellipsis = container.querySelector('[aria-hidden]')
      expect(ellipsis).toBeInTheDocument()
    })

    test('should render sr-only text', () => {
      render(<PaginationPrimitive.Ellipsis />)

      expect(screen.getByText('More pages')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(<PaginationPrimitive.Ellipsis className="custom-ellipsis" />)

      const ellipsis = container.querySelector('.custom-ellipsis')
      expect(ellipsis).toBeInTheDocument()
    })
  })

  describe('PaginationPrimitive.Root', () => {
    test('should render with navigation role', () => {
      const { container } = render(<PaginationPrimitive.Root />)

      const nav = container.querySelector('[role="navigation"]')
      expect(nav).toBeInTheDocument()
    })

    test('should have pagination aria-label', () => {
      const { container } = render(<PaginationPrimitive.Root />)

      const nav = container.querySelector('[aria-label="pagination"]')
      expect(nav).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(PaginationPrimitive.Root.displayName).toBe('PaginationPrimitiveRoot')
    })
  })

  describe('PaginationPrimitive.Content', () => {
    test('should render as ul element', () => {
      const { container } = render(<PaginationPrimitive.Content />)

      const ul = container.querySelector('ul')
      expect(ul).toBeInTheDocument()
    })

    test('should apply cn-pagination-content class', () => {
      const { container } = render(<PaginationPrimitive.Content />)

      const ul = container.querySelector('.cn-pagination-content')
      expect(ul).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(PaginationPrimitive.Content.displayName).toBe('PaginationPrimitiveContent')
    })
  })

  describe('PaginationPrimitive.Item', () => {
    test('should render as li element', () => {
      const { container } = render(
        <ul>
          <PaginationPrimitive.Item>Item</PaginationPrimitive.Item>
        </ul>
      )

      const li = container.querySelector('li')
      expect(li).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(PaginationPrimitive.Item.displayName).toBe('PaginationPrimitiveItem')
    })
  })
})
