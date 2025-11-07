import React, { cloneElement, createRef, forwardRef } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { MoreActionsTooltip } from '../more-actions-tooltip'

const buttonMockCalls: any[] = []
const dropdownContentCalls: any[] = []
const dropdownIconItemCalls: any[] = []
const dropdownItemCalls: any[] = []
const tooltipCalls: any[] = []
const linkCalls: any[] = []
const iconCalls: any[] = []

vi.mock('@/context', () => ({
  useRouterContext: () => ({
    Link: ({ children, ...props }: any) => {
      linkCalls.push(props)
      return (
        <a data-testid={`router-link-${linkCalls.length - 1}`} {...props}>
          {children}
        </a>
      )
    }
  })
}))

vi.mock('@components/button', () => {
  const ButtonMock = forwardRef<HTMLButtonElement, any>(
    ({ children, theme, variant, size, className, ...props }, ref) => {
      buttonMockCalls.push({ theme, variant, size, className, props })
      return (
        <button ref={ref} data-theme={theme} data-variant={variant} data-size={size} className={className} {...props}>
          {children}
        </button>
      )
    }
  )
  ButtonMock.displayName = 'ButtonMock'
  return {
    Button: ButtonMock
  }
})

vi.mock('@components/dropdown-menu', () => {
  const Root = ({ children }: any) => <div data-testid="dropdown-root">{children}</div>

  const Trigger = forwardRef<any, any>(({ children, disabled }, ref) => {
    const child = cloneElement(children, { ref, disabled })
    return (
      <div data-testid="dropdown-trigger" data-disabled={disabled}>
        {child}
      </div>
    )
  })
  Trigger.displayName = 'DropdownTriggerMock'

  const Content = ({ children, ...props }: any) => {
    dropdownContentCalls.push(props)
    return (
      <div data-testid="dropdown-content" data-props={JSON.stringify(props)}>
        {children}
      </div>
    )
  }

  const IconItem = ({ children, ...props }: any) => {
    dropdownIconItemCalls.push(props)
    return (
      <button data-testid={`dropdown-icon-item-${dropdownIconItemCalls.length - 1}`} {...props}>
        {children}
      </button>
    )
  }

  const Item = ({ children, ...props }: any) => {
    dropdownItemCalls.push(props)
    return (
      <button data-testid={`dropdown-item-${dropdownItemCalls.length - 1}`} {...props}>
        {children}
      </button>
    )
  }

  return {
    DropdownMenu: {
      Root,
      Trigger,
      Content,
      IconItem,
      Item
    }
  }
})

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, ...props }: any) => {
    iconCalls.push({ name, props })
    return <span data-testid={`icon-${iconCalls.length - 1}`} data-name={name} {...props} />
  }
}))

vi.mock('@components/tooltip', () => ({
  Tooltip: ({ children, ...props }: any) => {
    tooltipCalls.push(props)
    return <div data-testid={`tooltip-${tooltipCalls.length - 1}`}>{children}</div>
  }
}))

vi.mock('@components/text', () => ({
  Text: ({ children, ...props }: any) => (
    <span data-testid="text" data-props={JSON.stringify(props)}>
      {children}
    </span>
  )
}))

const basicActions = [{ title: 'Edit', onClick: vi.fn() }]

beforeEach(() => {
  buttonMockCalls.length = 0
  dropdownContentCalls.length = 0
  dropdownIconItemCalls.length = 0
  dropdownItemCalls.length = 0
  tooltipCalls.length = 0
  linkCalls.length = 0
  iconCalls.length = 0
  basicActions[0].onClick = vi.fn()
})

const renderComponent = (props: Partial<React.ComponentProps<typeof MoreActionsTooltip>> = {}) =>
  render(<MoreActionsTooltip actions={basicActions} {...props} />)

describe('MoreActionsTooltip', () => {
  test('does not render when actions array is empty', () => {
    const { container } = render(<MoreActionsTooltip actions={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders trigger button with default configuration', () => {
    renderComponent()

    const button = screen.getByRole('button', { name: 'Show more actions' })
    expect(button).toBeInTheDocument()

    expect(buttonMockCalls[0]).toMatchObject({
      theme: undefined,
      variant: 'ghost',
      size: 'md'
    })
    expect(iconCalls[0]).toMatchObject({ name: 'more-vert' })
    expect(dropdownContentCalls[0]).toMatchObject({
      className: 'min-w-[208px]',
      align: 'end',
      sideOffset: 2,
      alignOffset: 0
    })
  })

  test('applies custom configuration to trigger and content', () => {
    renderComponent({
      theme: 'danger',
      buttonVariant: 'outline',
      buttonSize: 'sm',
      iconName: 'star',
      className: 'custom-dropdown',
      sideOffset: 10,
      alignOffset: 5
    })

    expect(buttonMockCalls[0]).toMatchObject({ theme: 'danger', variant: 'outline', size: 'sm' })
    expect(dropdownContentCalls[0]).toMatchObject({ sideOffset: 10, alignOffset: 5, align: 'end' })
    expect(dropdownContentCalls[0].className).toContain('custom-dropdown')
    expect(dropdownContentCalls[0].className).toContain('min-w-[208px]')
    expect(iconCalls[0]).toMatchObject({ name: 'star' })
  })

  test('wraps actions with tooltip when tooltip prop is provided', () => {
    render(<MoreActionsTooltip actions={[{ title: 'With Tooltip', tooltip: { title: 'Info', content: 'Details' } }]} />)

    expect(tooltipCalls).toHaveLength(1)
    expect(tooltipCalls[0]).toMatchObject({ title: 'Info', content: 'Details' })
  })

  test('renders link action with icon and disables pointer events when disabled', () => {
    render(
      <MoreActionsTooltip
        actions={[
          {
            title: 'Navigate',
            to: '/destination',
            iconName: 'edit-pencil',
            disabled: true,
            isDanger: true
          }
        ]}
      />
    )

    expect(linkCalls[0]).toMatchObject({ to: '/destination', style: { pointerEvents: 'none' } })
    expect(dropdownIconItemCalls[0]).toMatchObject({
      icon: 'edit-pencil',
      disabled: true
    })
  })

  test('renders link action without icon', () => {
    render(<MoreActionsTooltip actions={[{ title: 'Navigate', to: '/navigate' }]} />)

    expect(linkCalls[0]).toMatchObject({ to: '/navigate' })
    expect(dropdownItemCalls[0]).toMatchObject({ disabled: undefined })
  })

  test('renders link action with icon without danger styling by default', () => {
    render(<MoreActionsTooltip actions={[{ title: 'Link', to: '/link', iconName: 'edit-pencil' }]} />)

    expect(dropdownIconItemCalls[0].iconClassName).toBeFalsy()
  })

  test('renders link action without icon with danger styling', () => {
    render(<MoreActionsTooltip actions={[{ title: 'Danger Link', to: '/danger', isDanger: true }]} />)

    expect(dropdownItemCalls[0]?.title?.props?.color).toBe('danger')
  })

  test('invokes click action handler and stops propagation for icon actions', () => {
    const onClick = vi.fn()

    render(<MoreActionsTooltip actions={[{ title: 'Click', iconName: 'star', onClick }]} />)

    const event = { stopPropagation: vi.fn() }
    dropdownIconItemCalls[0].onClick?.(event as any)

    expect(event.stopPropagation).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalled()
  })

  test('applies danger styling for non-link icon actions', () => {
    render(<MoreActionsTooltip actions={[{ title: 'Danger Icon', iconName: 'star', isDanger: true }]} />)

    expect(dropdownIconItemCalls[0].iconClassName).toContain('text-cn-danger')
  })

  test('invokes click action handler and stops propagation for non-icon actions', () => {
    const onClick = vi.fn()

    render(<MoreActionsTooltip actions={[{ title: 'Plain Action', onClick }]} />)

    const event = { stopPropagation: vi.fn() }
    dropdownItemCalls[0].onClick?.(event as any)

    expect(event.stopPropagation).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalled()
  })

  test('applies danger styling for non-link non-icon actions', () => {
    render(<MoreActionsTooltip actions={[{ title: 'Danger Plain', onClick: vi.fn(), isDanger: true }]} />)

    expect(dropdownItemCalls[0]?.title?.props?.color).toBe('danger')
  })

  test('stops propagation for link navigation actions', () => {
    render(
      <MoreActionsTooltip
        actions={[
          {
            title: 'Open',
            to: '/open'
          }
        ]}
      />
    )

    const event = { stopPropagation: vi.fn() }
    linkCalls[0].onClick?.(event as any)

    expect(event.stopPropagation).toHaveBeenCalled()
  })

  test('forwards ref to trigger button', () => {
    const ref = createRef<HTMLButtonElement>()

    render(<MoreActionsTooltip ref={ref} actions={basicActions} />)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  test('renders disabled trigger when disabled prop is true', () => {
    renderComponent({ disabled: true })

    const button = screen.getByRole('button', { name: 'Show more actions' })
    expect(button).toBeDisabled()
  })
})
