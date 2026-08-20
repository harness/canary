import * as React from 'react'

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CustomToast } from '../custom-toast'
import type { InfoToastSeverity } from '../types'

vi.mock('@/context', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback
  })
}))

vi.mock('@components/button', () => ({
  Button: ({
    children,
    ignoreIconOnlyTooltip: _ignoreIconOnlyTooltip,
    iconOnly: _iconOnly,
    size: _size,
    variant: _variant,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ignoreIconOnlyTooltip?: boolean
    iconOnly?: boolean
    size?: string
    variant?: string
  }) => <button {...props}>{children}</button>
}))

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, ...props }: React.HTMLAttributes<HTMLSpanElement> & { name: string }) => (
    <span data-icon={name} {...props} />
  )
}))

vi.mock('@components/layout', () => ({
  Layout: {
    Vertical: ({ children, gap: _gap, ...props }: React.HTMLAttributes<HTMLDivElement> & { gap?: string }) => (
      <div {...props}>{children}</div>
    ),
    Flex: ({
      children,
      align: _align,
      gap: _gap,
      justify: _justify,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { align?: string; gap?: string; justify?: string }) => (
      <div {...props}>{children}</div>
    ),
    Horizontal: ({
      children,
      align: _align,
      gap: _gap,
      justify: _justify,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { align?: string; gap?: string; justify?: string }) => (
      <div {...props}>{children}</div>
    )
  }
}))

vi.mock('@components/text', () => ({
  Text: ({
    children,
    color: _color,
    variant: _variant,
    ...props
  }: React.HTMLAttributes<HTMLSpanElement> & { color?: string; variant?: string }) => <span {...props}>{children}</span>
}))

const mockScrollHeight = vi.hoisted(() => ({ value: 0 }))

vi.mock('@hooks/use-resize-observer', () => ({
  useResizeObserver: (ref: React.RefObject<HTMLElement>, callback: (element: HTMLElement) => void) => {
    React.useLayoutEffect(() => {
      const element = ref.current
      if (!element) return

      Object.defineProperty(element, 'scrollHeight', { configurable: true, value: mockScrollHeight.value })
      callback(element)
    })
  }
}))

beforeEach(() => {
  mockScrollHeight.value = 0
})

afterEach(() => {
  cleanup()
})

describe('CustomToast', () => {
  it.each`
    severity      | className
    ${'Critical'} | ${'cn-toast-severity-critical'}
    ${'High'}     | ${'cn-toast-severity-high'}
    ${'Medium'}   | ${'cn-toast-severity-medium'}
    ${'Low'}      | ${'cn-toast-severity-low'}
  `('applies the $severity severity border class', ({ severity, className }) => {
    const { container } = render(
      <CustomToast toastId="1" variant="info" title="Alert" severity={severity as InfoToastSeverity} />
    )

    expect(container.firstElementChild).toHaveClass('cn-toast', 'cn-toast-info', className)
  })

  it('does not apply a severity border class when severity is omitted', () => {
    const { container } = render(<CustomToast toastId="1" variant="info" title="Info" />)

    expect(container.firstElementChild).toHaveClass('cn-toast', 'cn-toast-info')
    expect(container.firstElementChild).not.toHaveClass('cn-toast-severity-critical')
    expect(container.firstElementChild).not.toHaveClass('cn-toast-severity-high')
    expect(container.firstElementChild).not.toHaveClass('cn-toast-severity-medium')
    expect(container.firstElementChild).not.toHaveClass('cn-toast-severity-low')
  })

  it('renders a legacy primary action in the title row without a bottom actions container', () => {
    const onAction = vi.fn()
    const { container } = render(
      <CustomToast toastId="1" variant="info" title="Saved" action={{ label: 'Undo', onClick: onAction }} />
    )

    const title = container.querySelector('.cn-toast-title')!
    const actionButton = screen.getByRole('button', { name: 'Undo' })

    expect(title).toContainElement(actionButton)
    expect(container.querySelector('.cn-toast-bottom-actions')).not.toBeInTheDocument()

    fireEvent.click(actionButton)
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('renders a secondary action only in the title row by default', () => {
    const onSecondary = vi.fn()
    const { container } = render(
      <CustomToast
        toastId="1"
        variant="info"
        title="Scan complete"
        secondaryAction={{ label: 'Ignore', onClick: onSecondary }}
      />
    )

    const title = container.querySelector('.cn-toast-title')!
    const secondaryButton = screen.getByRole('button', { name: 'Ignore' })

    expect(title).toContainElement(secondaryButton)
    expect(container.querySelector('.cn-toast-bottom-actions')).not.toBeInTheDocument()

    fireEvent.click(secondaryButton)
    expect(onSecondary).toHaveBeenCalledTimes(1)
  })

  it('renders both actions in primary then secondary order in the title row by default', () => {
    const { container } = render(
      <CustomToast
        toastId="1"
        variant="info"
        title="Vulnerability found"
        action={{ label: 'View details', onClick: vi.fn() }}
        secondaryAction={{ label: 'Ignore', onClick: vi.fn() }}
      />
    )

    const title = container.querySelector('.cn-toast-title')!
    expect(
      within(title as HTMLElement)
        .getAllByRole('button')
        .filter(button => button.getAttribute('title') !== 'Close')
        .map(button => button.textContent)
    ).toEqual(['View details', 'Ignore'])
    expect(container.querySelector('.cn-toast-bottom-actions')).not.toBeInTheDocument()
  })

  it('renders both actions in the bottom-right area when ctaPosition is bottom', () => {
    const { container } = render(
      <CustomToast
        toastId="1"
        variant="info"
        title="Vulnerability found"
        description="Review the dependency before merging."
        ctaPosition="bottom"
        action={{ label: 'View details', onClick: vi.fn() }}
        secondaryAction={{ label: 'Ignore', onClick: vi.fn() }}
      />
    )

    const bottomActions = container.querySelector('.cn-toast-bottom-actions')!
    expect(
      within(bottomActions as HTMLElement)
        .getAllByRole('button')
        .map(button => button.textContent)
    ).toEqual(['View details', 'Ignore'])

    const title = container.querySelector('.cn-toast-title')!
    expect(within(title as HTMLElement).queryByRole('button', { name: 'View details' })).not.toBeInTheDocument()
  })

  it('renders a primary action in the bottom area when ctaPosition is bottom', () => {
    const onAction = vi.fn()
    const { container } = render(
      <CustomToast
        toastId="1"
        variant="info"
        title="Notice"
        ctaPosition="bottom"
        action={{ label: 'View details', onClick: onAction }}
      />
    )

    const bottomActions = container.querySelector('.cn-toast-bottom-actions')!
    const actionButton = screen.getByRole('button', { name: 'View details' })

    expect(bottomActions).toContainElement(actionButton)

    fireEvent.click(actionButton)
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('keeps title-row actions for non-info variants and ignores severity/bottom placement props', () => {
    const { container } = render(
      <CustomToast toastId="1" variant="success" title="Saved" action={{ label: 'Undo', onClick: vi.fn() }} />
    )

    const title = container.querySelector('.cn-toast-title')!
    expect(title).toContainElement(screen.getByRole('button', { name: 'Undo' }))
    expect(container.querySelector('.cn-toast-bottom-actions')).not.toBeInTheDocument()
    expect(container.firstElementChild).not.toHaveClass('cn-toast-severity-critical')
  })

  it('expands and collapses an overflowing description', () => {
    mockScrollHeight.value = 120
    const { container } = render(
      <CustomToast toastId="1" variant="info" title="Vulnerability found" description="A very long description." />
    )

    const descriptionContainer = container.querySelector('.cn-toast-description-container')!
    const expandButton = screen.getByRole('button', { name: 'Show more' })

    expect(expandButton).toHaveAttribute('aria-expanded', 'false')
    expect(descriptionContainer).not.toHaveClass('cn-toast-description-container-expanded')

    fireEvent.click(expandButton)

    const collapseButton = screen.getByRole('button', { name: 'Show less' })
    expect(collapseButton).toHaveAttribute('aria-expanded', 'true')
    expect(descriptionContainer).toHaveClass('cn-toast-description-container-expanded')

    fireEvent.click(collapseButton)

    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false')
    expect(descriptionContainer).not.toHaveClass('cn-toast-description-container-expanded')
  })
})
