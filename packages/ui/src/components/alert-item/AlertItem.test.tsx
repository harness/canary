import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { AlertItem } from './index'

const linkCalls: Array<Record<string, unknown>> = []
const textCalls: Array<Record<string, unknown>> = []
const timeAgoCalls: Array<Record<string, unknown>> = []

vi.mock('../alert/AlertLink', () => ({
  AlertLink: ({ children, className, ...props }: any) => (
    <a data-testid="mock-alert-link" className={className} {...props}>
      {children}
    </a>
  )
}))

vi.mock('@/components', () => {
  const mockLink = ({ children, onClick, className, ...props }: any) => {
    linkCalls.push({ ...props, className })
    const { to, href, ...rest } = props
    const resolvedHref = typeof to === 'string' ? to : (href ?? '#')

    return (
      <a data-testid="mock-link" href={resolvedHref} className={className} {...rest} onClick={onClick}>
        {children}
      </a>
    )
  }

  const mockText = ({ children, truncate, variant, color, className, ...props }: any) => {
    textCalls.push({ truncate, variant, color, className, ...props })
    return (
      <span
        data-testid="mock-text"
        data-truncate={String(!!truncate)}
        data-variant={variant}
        data-color={color}
        className={className}
        {...props}
      >
        {children}
      </span>
    )
  }

  const mockTimeAgoCard = ({ timestamp, textProps }: any) => {
    timeAgoCalls.push({ timestamp, textProps })
    return <span data-testid="mock-time-ago">{String(timestamp)}</span>
  }

  return {
    Link: mockLink,
    Text: mockText,
    TimeAgoCard: mockTimeAgoCard
  }
})

describe('AlertItem', () => {
  beforeEach(() => {
    linkCalls.length = 0
    textCalls.length = 0
    timeAgoCalls.length = 0
  })

  it.each([
    { theme: 'info', className: 'cn-alert-item-info' },
    { theme: 'success', className: 'cn-alert-item-success' },
    { theme: 'warning', className: 'cn-alert-item-warning' },
    { theme: 'danger', className: 'cn-alert-item-danger' }
  ])('applies $theme theme class on item', ({ theme, className }) => {
    const { container } = render(
      <AlertItem theme={theme as any}>
        <AlertItem.Title>Pipeline Failed</AlertItem.Title>
      </AlertItem>
    )

    expect(container.querySelector(`.${className}`)).toBeInTheDocument()
  })

  it('renders description in meta row', () => {
    const { container } = render(
      <AlertItem theme="info">
        <AlertItem.Title>Title</AlertItem.Title>
        <AlertItem.Description>Description text</AlertItem.Description>
      </AlertItem>
    )

    expect(container.firstElementChild).toHaveClass('cn-alert-item-info')
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('shows unread indicator and unread background when read is false', () => {
    const { container } = render(
      <AlertItem theme="success" read={false} timestamp={Date.now()}>
        <AlertItem.Title>Unread alert</AlertItem.Title>
      </AlertItem>
    )

    expect(container.querySelector('.cn-alert-item-unread')).toBeInTheDocument()
    expect(screen.getByLabelText('Unread')).toBeInTheDocument()
  })

  it('hides unread indicator when read', () => {
    render(
      <AlertItem theme="success" read timestamp={Date.now()}>
        <AlertItem.Title>Read alert</AlertItem.Title>
      </AlertItem>
    )

    expect(screen.queryByLabelText('Unread')).not.toBeInTheDocument()
  })

  it('truncates description text', () => {
    render(
      <AlertItem theme="info">
        <AlertItem.Title>Title</AlertItem.Title>
        <AlertItem.Description>Long description</AlertItem.Description>
      </AlertItem>
    )

    const description = textCalls.find(call => String(call.className).includes('cn-alert-item-description'))
    expect(description?.truncate).toBe(true)
  })

  it('renders timestamp via TimeAgoCard', () => {
    const timestamp = 1734123456789

    render(
      <AlertItem theme="info" timestamp={timestamp}>
        <AlertItem.Title>Title</AlertItem.Title>
      </AlertItem>
    )

    expect(timeAgoCalls).toHaveLength(1)
    expect(timeAgoCalls[0].timestamp).toBe(timestamp)
    expect(screen.getByTestId('mock-time-ago')).toBeInTheDocument()
  })

  it('renders row link overlay when to is provided', () => {
    const { container } = render(
      <AlertItem theme="info" to="/alerts/1">
        <AlertItem.Title>Title</AlertItem.Title>
      </AlertItem>
    )

    expect(container.querySelector('.cn-alert-item-clickable-block')).toBeInTheDocument()
    expect(linkCalls.some(call => String(call.className).includes('cn-alert-item-clickable-block'))).toBe(true)
  })

  it('calls onClick on normal row link click but not with modifier keys', () => {
    const onClick = vi.fn()

    render(
      <AlertItem theme="info" to="/alerts/1" onClick={onClick}>
        <AlertItem.Title>Title</AlertItem.Title>
      </AlertItem>
    )

    const overlay = screen
      .getAllByTestId('mock-link')
      .find(link => link.classList.contains('cn-alert-item-clickable-block'))

    fireEvent.click(overlay!)
    expect(onClick).toHaveBeenCalledTimes(1)

    fireEvent.click(overlay!, { metaKey: true })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders button overlay when only onClick is provided', () => {
    const onClick = vi.fn()
    const { container } = render(
      <AlertItem theme="info" onClick={onClick}>
        <AlertItem.Title>Title</AlertItem.Title>
      </AlertItem>
    )

    const button = container.querySelector('button.cn-alert-item-clickable-block')
    expect(button).toBeInTheDocument()

    fireEvent.click(button!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders action link separately from row overlay', () => {
    render(
      <AlertItem theme="info" to="/alerts/1">
        <AlertItem.Title>Title</AlertItem.Title>
        <AlertItem.Link to="/invite">View invite</AlertItem.Link>
      </AlertItem>
    )

    expect(screen.getByText('View invite')).toBeInTheDocument()
    expect(linkCalls.filter(call => String(call.className).includes('cn-alert-item-clickable-block'))).toHaveLength(1)
  })

  describe('overlay accessible name', () => {
    it('gives the link overlay an aria-label derived from the title text', () => {
      render(
        <AlertItem theme="info" to="/alerts/1">
          <AlertItem.Title>Pipeline Failed</AlertItem.Title>
        </AlertItem>
      )

      const overlay = screen
        .getAllByTestId('mock-link')
        .find(link => link.classList.contains('cn-alert-item-clickable-block'))

      expect(overlay).toHaveAttribute('aria-label', 'Pipeline Failed')
    })

    it('prefers an explicit aria-label from linkProps over the derived title text', () => {
      render(
        <AlertItem theme="info" to="/alerts/1" linkProps={{ 'aria-label': 'Custom label' }}>
          <AlertItem.Title>Pipeline Failed</AlertItem.Title>
        </AlertItem>
      )

      const overlay = screen
        .getAllByTestId('mock-link')
        .find(link => link.classList.contains('cn-alert-item-clickable-block'))

      expect(overlay).toHaveAttribute('aria-label', 'Custom label')
    })

    it('gives the button overlay an aria-label derived from the title text', () => {
      const onClick = vi.fn()

      const { container } = render(
        <AlertItem theme="info" onClick={onClick}>
          <AlertItem.Title>Pipeline Failed</AlertItem.Title>
        </AlertItem>
      )

      const button = container.querySelector('button.cn-alert-item-clickable-block')
      expect(button).toHaveAttribute('aria-label', 'Pipeline Failed')
    })
  })

  it('renders multiple items as sibling rows without a list wrapper', () => {
    const { container } = render(
      <>
        <AlertItem theme="info">
          <AlertItem.Title>First</AlertItem.Title>
        </AlertItem>
        <AlertItem theme="warning">
          <AlertItem.Title>Second</AlertItem.Title>
        </AlertItem>
      </>
    )

    expect(container.querySelectorAll('.cn-alert-item')).toHaveLength(2)
  })
})
