import { createRef } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { StackedList, type StackedListPaginationProps } from '../stacked-list'

const linkCalls: Array<Record<string, unknown>> = []
const paginationCalls: Array<Record<string, unknown>> = []
const textCalls: Array<Record<string, unknown>> = []

vi.mock('@/components', () => {
  const mockLink = ({ children, onClick, ...props }: any) => {
    linkCalls.push(props)
    const { to, href, ...rest } = props
    const resolvedHref = typeof to === 'string' ? to : (href ?? '#')

    return (
      <a data-testid="mock-link" href={resolvedHref} {...rest} onClick={onClick}>
        {children}
      </a>
    )
  }

  const mockPagination = ({ children, getPrevPageLink, getNextPageLink, ...props }: any) => {
    paginationCalls.push({ ...props, getPrevPageLink, getNextPageLink })
    return (
      <div data-testid="mock-pagination" {...props}>
        {children}
      </div>
    )
  }

  const mockText = ({ children, truncate, variant, color, ...props }: any) => {
    textCalls.push({ truncate, variant, color, ...props })
    return (
      <span
        data-testid="mock-text"
        data-truncate={String(!!truncate)}
        data-variant={variant}
        data-color={color}
        {...props}
      >
        {children}
      </span>
    )
  }

  return {
    Link: mockLink,
    Pagination: mockPagination,
    Text: mockText,
    withTooltip: (Comp: any) => Comp
  }
})

describe('StackedList.Root', () => {
  beforeEach(() => {
    linkCalls.length = 0
    paginationCalls.length = 0
    textCalls.length = 0
  })

  it('applies variant classes and renders pagination with spacing overrides', () => {
    const { container } = render(
      <StackedList.Root
        border={false}
        rounded="top"
        paginationProps={
          {
            paddingX: 'lg',
            paddingY: 'sm',
            className: 'extra-pagination',
            getPrevPageLink: () => '#prev',
            getNextPageLink: () => '#next'
          } as StackedListPaginationProps
        }
      >
        <div>Row</div>
      </StackedList.Root>
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('cn-stacked-list')
    expect(root.className).toContain('cn-stacked-list-border-no')
    expect(root.className).toContain('cn-stacked-list-rounded-top')

    const pagination = screen.getByTestId('mock-pagination')
    expect(pagination.className).toContain('!mt-0')
    expect(pagination.className).toContain('px-cn-lg')
    expect(pagination.className).toContain('py-cn-sm')
    expect(pagination.className).toContain('extra-pagination')
    expect(paginationCalls).toHaveLength(1)
  })
})

describe('StackedList.Item', () => {
  beforeEach(() => {
    linkCalls.length = 0
  })

  it('creates clickable link block and forwards onClick handler', () => {
    const handleClick = vi.fn()

    const { container } = render(
      <StackedList.Item
        to="/details"
        onClick={handleClick}
        thumbnail={<span data-testid="thumb" />}
        actions={<span data-testid="action" />}
      >
        Content
      </StackedList.Item>
    )

    const item = container.firstElementChild as HTMLElement
    expect(item.className).toContain('cn-stacked-list-item')
    expect(item.className).toContain('cn-stacked-list-item-with-hover')
    expect(item.className).toContain('cn-stacked-list-item-clickable')

    const link = screen.getByTestId('mock-link')
    expect(linkCalls[0]?.to).toBe('/details')
    fireEvent.click(link)
    expect(handleClick).toHaveBeenCalledTimes(1)

    expect(screen.getByTestId('thumb').parentElement).toHaveClass('cn-stacked-list-item-thumbnail')
    expect(screen.getByTestId('action').parentElement).toHaveClass('cn-stacked-list-item-actions')
  })

  it('renders clickable button when only onClick is provided', () => {
    const handleClick = vi.fn()

    const { container } = render(<StackedList.Item onClick={handleClick}>Clickable</StackedList.Item>)

    const button = container.querySelector('button.cn-stacked-list-item-clickable-block') as HTMLButtonElement
    expect(button).not.toBeNull()
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('supports asChild by decorating slotted element with stacked list classes', () => {
    render(
      <StackedList.Item asChild className="custom-class">
        <article data-testid="custom-slot">Slotted</article>
      </StackedList.Item>
    )

    const slotted = screen.getByTestId('custom-slot')
    expect(slotted.className).toContain('cn-stacked-list-item')
    expect(slotted.className).toContain('custom-class')
  })

  it('merges linkProps into link-only configuration', () => {
    render(
      <StackedList.Item linkProps={{ className: 'custom-link', 'aria-label': 'item-link' }}>
        Link props item
      </StackedList.Item>
    )

    const link = screen.getByTestId('mock-link')
    expect(link.className).toContain('custom-link')
    expect(link.getAttribute('aria-label')).toBe('item-link')
  })
})

describe('StackedList.Header', () => {
  it('renders header with disabled hover and adjusted padding', () => {
    const { container } = render(<StackedList.Header>Header</StackedList.Header>)

    const header = container.firstElementChild as HTMLElement
    expect(header.className).toContain('cn-stacked-list-item-header')
    expect(header.className).not.toContain('cn-stacked-list-item-with-hover')
    expect(header.className).toContain('py-cn-xs')
  })
})

describe('StackedList.Field', () => {
  beforeEach(() => {
    textCalls.length = 0
  })

  it('renders title and description with truncate handling and right alignment', () => {
    render(<StackedList.Field title="Name" description="User description" right disableTruncate />)

    const field = screen.getByText('Name').parentElement as HTMLElement
    expect(field.className).toContain('cn-stacked-list-field-right')

    expect(textCalls[0]).toMatchObject({ color: 'foreground-1', truncate: false })
    expect(textCalls[1]?.truncate).toBe(false)
    expect(screen.getByText('User description')).toBeInTheDocument()
  })

  it('defaults to truncated text when disableTruncate is not specified', () => {
    render(<StackedList.Field title="Name only" />)

    expect(textCalls[0]?.truncate).toBe(true)
  })
})

describe('StackedList refs', () => {
  it('forwards ref from item to the underlying element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<StackedList.Item ref={ref}>Content</StackedList.Item>)

    expect(ref.current).not.toBeNull()
    expect(ref.current).toHaveClass('cn-stacked-list-item')
  })
})
