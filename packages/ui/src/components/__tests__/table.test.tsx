import type { PaginationProps } from '@/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Table } from '../table'

const paginationCalls: Array<Record<string, unknown>> = []
const textCalls: Array<Record<string, unknown>> = []
const layoutCalls: Array<Record<string, unknown>> = []
const tooltipCalls: Array<Record<string, unknown>> = []
const iconCalls: Array<Record<string, unknown>> = []
const separatorCalls: Array<Record<string, unknown>> = []
type RouterLinkCall = Record<string, unknown> & { onClick?: ((event?: unknown) => void) | undefined }

const routerLinkCalls: RouterLinkCall[] = []

vi.mock('@/components', () => {
  const Layout = {
    Horizontal: ({ children, gap, align, ...props }: any) => {
      layoutCalls.push({ gap, align, ...props })
      return (
        <div data-testid="layout-horizontal" data-gap={gap} data-align={align} {...props}>
          {children}
        </div>
      )
    }
  }

  const Text = ({ children, as: Comp = 'span', truncate, variant, color, ...props }: any) => {
    textCalls.push({ as: Comp, truncate, variant, color, ...props })
    return (
      <Comp
        data-testid="mock-text"
        data-truncate={String(!!truncate)}
        data-variant={variant}
        data-color={color}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  const Pagination = ({ children, getPrevPageLink, getNextPageLink, ...props }: any) => {
    paginationCalls.push({ ...props, getPrevPageLink, getNextPageLink })
    return (
      <div data-testid="mock-pagination" {...props}>
        {children}
      </div>
    )
  }

  const IconV2 = ({ name, ...props }: any) => {
    iconCalls.push({ name, ...props })
    return <span data-testid={`icon-${name}`} {...props} />
  }

  const Separator = ({ orientation, ...props }: any) => {
    separatorCalls.push({ orientation, ...props })
    return <div data-testid="mock-separator" data-orientation={orientation} {...props} />
  }

  const Tooltip = ({ children, content, ...props }: any) => {
    tooltipCalls.push({ content, ...props })
    return (
      <div data-testid="mock-tooltip" data-content={content} {...props}>
        {children}
      </div>
    )
  }

  return { Layout, Text, Pagination, IconV2, Separator, Tooltip }
})

vi.mock('@/context', () => ({
  useRouterContext: () => ({
    Link: ({ children, onClick, ...props }: any) => {
      routerLinkCalls.push({ ...props, onClick })
      const { to, href, ...rest } = props
      const resolvedHref = typeof to === 'string' ? to : (href ?? '#')

      return (
        <a data-testid="router-link" href={resolvedHref} {...rest} onClick={onClick}>
          {children}
        </a>
      )
    }
  })
}))

describe('Table.Root', () => {
  beforeEach(() => {
    paginationCalls.length = 0
  })

  it('applies size variants and highlight classes while rendering pagination', () => {
    const { container } = render(
      <Table.Root
        size="compact"
        disableHighlightOnHover
        tableClassName="custom-table"
        paginationProps={
          {
            className: 'extra-pagination',
            getPrevPageLink: () => '#prev',
            getNextPageLink: () => '#next'
          } as PaginationProps
        }
      >
        <Table.Body>
          <tr>
            <td>Row</td>
          </tr>
        </Table.Body>
      </Table.Root>
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain('cn-table-v2-container')
    expect(wrapper.className).toContain('cn-table-v2-compact')
    expect(wrapper.className).not.toContain('cn-table-v2-highlight-hover')

    const table = wrapper.querySelector('table') as HTMLTableElement
    expect(table.className).toContain('cn-table-v2-element')
    expect(table.className).toContain('custom-table')

    const pagination = screen.getByTestId('mock-pagination')
    expect(pagination.className).toContain('!mt-0')
    expect(pagination.className).toContain('px-cn-md')
    expect(pagination.className).toContain('py-cn-md')
    expect(pagination.className).toContain('border-t')
    expect(pagination.className).toContain('extra-pagination')
    expect(paginationCalls).toHaveLength(1)
  })

  it('enables highlight styling by default', () => {
    const { container } = render(
      <Table.Root>
        <Table.Body>
          <tr>
            <td>Row</td>
          </tr>
        </Table.Body>
      </Table.Root>
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain('cn-table-v2-highlight-hover')
  })
})

describe('Table.Row', () => {
  beforeEach(() => {
    routerLinkCalls.length = 0
    separatorCalls.length = 0
  })

  it('propagates navigation props to cells, updates accessibility, and marks selection', () => {
    const handleRowClick = vi.fn()

    render(
      <table>
        <tbody>
          <Table.Row selected to="/row" onClick={handleRowClick}>
            <Table.Head sortable>Header</Table.Head>
            <Table.Cell>First</Table.Cell>
            <Table.Cell>Second</Table.Cell>
            <Table.Cell disableLink>Plain</Table.Cell>
          </Table.Row>
        </tbody>
      </table>
    )

    const row = screen.getAllByRole('row')[0]
    expect(row).toHaveAttribute('data-checked', 'true')

    // First header should hide divider when rendered inside the row
    expect(screen.queryByTestId('mock-separator')).toBeNull()

    const links = screen.getAllByTestId('router-link')
    expect(links).toHaveLength(2)
    expect(routerLinkCalls[0]).toMatchObject({ to: '/row', tabIndex: -1 })
    expect(routerLinkCalls[1]).toMatchObject({ to: '/row', tabIndex: -1 })

    fireEvent.click(links[0])
    expect(handleRowClick).toHaveBeenCalledTimes(1)
  })

  it('preserves child navigation props and tab ordering when children define their own links', () => {
    routerLinkCalls.length = 0
    const handleChildClick = vi.fn()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <table>
        <tbody>
          <Table.Row to="/row" linkProps={{ className: 'row-link' }}>
            <Table.Cell to="/cell" onClick={handleChildClick}>
              Linked cell
            </Table.Cell>
            <Table.Cell>Fallback cell</Table.Cell>
          </Table.Row>
        </tbody>
      </table>
    )

    const links = screen.getAllByTestId('router-link')
    expect(links).toHaveLength(2)
    expect(routerLinkCalls[0]).toMatchObject({ to: '/cell', tabIndex: 0 })
    expect(routerLinkCalls[1]).toMatchObject({ to: '/row', tabIndex: -1 })

    fireEvent.click(links[0])
    expect(handleChildClick).toHaveBeenCalledTimes(1)
    errorSpy.mockRestore()
  })

  it('renders children without additional navigation when no linking props are provided', () => {
    routerLinkCalls.length = 0

    render(
      <table>
        <tbody>
          <Table.Row>
            <Table.Cell>Plain</Table.Cell>
          </Table.Row>
        </tbody>
      </table>
    )

    expect(routerLinkCalls).toHaveLength(0)
    expect(screen.queryByTestId('router-link')).toBeNull()
  })

  it('ignores non-element children while still applying row-level navigation', () => {
    routerLinkCalls.length = 0
    render(
      <table>
        <tbody>
          <Table.Row to="/row">
            {null}
            <Table.Cell>Clickable</Table.Cell>
          </Table.Row>
        </tbody>
      </table>
    )

    expect(routerLinkCalls).toHaveLength(1)
    expect(routerLinkCalls[0]?.to).toBe('/row')
  })

  it('clones child link props while preserving child-level click handlers', () => {
    routerLinkCalls.length = 0
    const handleCellClick = vi.fn()
    const handleRowClick = vi.fn()

    render(
      <table>
        <tbody>
          <Table.Row onClick={handleRowClick}>
            <Table.Cell linkProps={{ className: 'child-link' }} onClick={handleCellClick}>
              Child link
            </Table.Cell>
          </Table.Row>
        </tbody>
      </table>
    )

    expect(routerLinkCalls[0]).toMatchObject({ tabIndex: 0 })
    const onClick = routerLinkCalls[0]?.onClick
    expect(onClick).toBeTypeOf('function')
    const link = screen.getByTestId('router-link')
    expect(link.className).toContain('child-link')
    onClick?.({})
    expect(handleCellClick).toHaveBeenCalledTimes(1)
    expect(handleRowClick).not.toHaveBeenCalled()
  })

  it('applies row-level link props to generated clickable blocks', () => {
    routerLinkCalls.length = 0
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <table>
        <tbody>
          <Table.Row linkProps={{ className: 'row-link' }}>
            <Table.Cell>Row link</Table.Cell>
          </Table.Row>
        </tbody>
      </table>
    )

    const link = screen.getByTestId('router-link')
    expect(link.className).toContain('row-link')
    errorSpy.mockRestore()
  })
})

describe('Table.Head', () => {
  beforeEach(() => {
    iconCalls.length = 0
    tooltipCalls.length = 0
  })

  it('renders tooltip and ascending sort icon when tooltip props and asc sort provided', () => {
    render(
      <table>
        <thead>
          <tr>
            <Table.Head sortable sortDirection="asc" tooltipProps={{ content: 'Sorted column' }}>
              Name
            </Table.Head>
          </tr>
        </thead>
      </table>
    )

    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument()
    expect(tooltipCalls[0]?.content).toBe('Sorted column')
    expect(iconCalls[0]?.name).toBe('arrow-up')
  })

  it('renders default sort icon when column is sortable but direction is undefined', () => {
    iconCalls.length = 0

    render(
      <table>
        <thead>
          <tr>
            <Table.Head sortable>Label</Table.Head>
          </tr>
        </thead>
      </table>
    )

    expect(iconCalls[0]?.name).toBe('up-down')
    const headCell = screen.getByText('Label').closest('th') as HTMLElement
    expect(headCell.className).toContain('cn-table-v2-head-sortable')
  })

  it('passes container props to layout and renders descending icon', () => {
    layoutCalls.length = 0
    iconCalls.length = 0

    render(
      <table>
        <thead>
          <tr>
            <Table.Head sortable sortDirection="desc" containerProps={{ className: 'custom-layout' }}>
              Column
            </Table.Head>
          </tr>
        </thead>
      </table>
    )

    expect(layoutCalls[0]?.className).toContain('custom-layout')
    expect(iconCalls[0]?.name).toBe('arrow-down')
  })

  it('renders nothing when no children are provided', () => {
    render(
      <table>
        <thead>
          <tr>
            <Table.Head sortable />
          </tr>
        </thead>
      </table>
    )

    const headCell = screen.getAllByRole('columnheader')[0]
    expect(headCell.textContent).toBe('')
  })
})

describe('Table.Cell', () => {
  beforeEach(() => {
    routerLinkCalls.length = 0
  })

  it('renders link block when to is provided and triggers onClick', () => {
    const handleClick = vi.fn()

    render(
      <table>
        <tbody>
          <tr>
            <Table.Cell to="/details" onClick={handleClick}>
              Details
            </Table.Cell>
          </tr>
        </tbody>
      </table>
    )

    const link = screen.getByTestId('router-link')
    expect(link.className).toContain('cn-table-v2-cell-clickable-block')
    fireEvent.click(link)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders button block when only onClick is provided', () => {
    const handleClick = vi.fn()

    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Table.Cell onClick={handleClick} tabIndex={-1}>
              Clickable
            </Table.Cell>
          </tr>
        </tbody>
      </table>
    )

    const button = container.querySelector('button.cn-table-v2-cell-clickable-block') as HTMLButtonElement
    expect(button).not.toBeNull()
    expect(button).toHaveAttribute('tabIndex', '-1')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disableLink flag by not rendering interactive elements', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Table.Cell disableLink to="/ignored">
              Content
            </Table.Cell>
          </tr>
        </tbody>
      </table>
    )

    expect(container.querySelector('.cn-table-v2-cell-clickable-block')).toBeNull()
  })

  it('merges linkProps className into rendered link block', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Table.Cell linkProps={{ className: 'custom-link', 'aria-label': 'cell-link' }}>Value</Table.Cell>
          </tr>
        </tbody>
      </table>
    )

    const link = container.querySelector('a.cn-table-v2-cell-clickable-block') as HTMLAnchorElement
    expect(link).not.toBeNull()
    expect(link.className).toContain('custom-link')
    expect(link.getAttribute('aria-label')).toBe('cell-link')
  })
})

describe('Table.Caption', () => {
  beforeEach(() => {
    textCalls.length = 0
  })

  it('renders caption using text component with expected styling props', () => {
    render(
      <table>
        <Table.Caption>Helpful caption</Table.Caption>
      </table>
    )

    expect(screen.getByText('Helpful caption')).toBeInTheDocument()
    expect(textCalls[0]).toMatchObject({
      as: 'caption',
      variant: 'caption-normal',
      color: 'foreground-3'
    })
  })
})
