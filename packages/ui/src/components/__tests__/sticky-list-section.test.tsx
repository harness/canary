import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { StickyListSection } from '../sticky-list-section'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})
window.IntersectionObserver = mockIntersectionObserver as any

describe('StickyListSection', () => {
  test('Root renders children with correct class', () => {
    render(
      <StickyListSection.Root data-testid="root">
        <div>child</div>
      </StickyListSection.Root>
    )

    const root = screen.getByTestId('root')
    expect(root).toHaveClass('cn-sticky-list-section')
    expect(root).toHaveTextContent('child')
  })

  test('Root merges custom className', () => {
    render(
      <StickyListSection.Root className="custom" data-testid="root">
        <div />
      </StickyListSection.Root>
    )

    expect(screen.getByTestId('root')).toHaveClass('cn-sticky-list-section', 'custom')
  })

  test('Header renders children with correct class', () => {
    render(
      <StickyListSection.Root>
        <StickyListSection.Header data-testid="header">
          <span>Service</span>
        </StickyListSection.Header>
      </StickyListSection.Root>
    )

    const header = screen.getByTestId('header')
    expect(header).toHaveClass('cn-sticky-list-section-header')
    expect(header).toHaveTextContent('Service')
  })

  test('Content renders children with correct class', () => {
    render(
      <StickyListSection.Root>
        <StickyListSection.Content data-testid="content">
          <ul>
            <li>item</li>
          </ul>
        </StickyListSection.Content>
      </StickyListSection.Root>
    )

    const content = screen.getByTestId('content')
    expect(content).toHaveClass('cn-sticky-list-section-content')
    expect(content).toHaveTextContent('item')
  })

  test('Root renders an invisible sentinel div for IntersectionObserver', () => {
    const { container } = render(
      <StickyListSection.Root>
        <StickyListSection.Header>Header</StickyListSection.Header>
        <StickyListSection.Content>Content</StickyListSection.Content>
      </StickyListSection.Root>
    )

    const sentinel = container.querySelector('.cn-sticky-list-section-sentinel')
    expect(sentinel).toBeInTheDocument()
  })

  test('full compound renders all three sub-components', () => {
    render(
      <StickyListSection.Root data-testid="root">
        <StickyListSection.Header data-testid="header">Service</StickyListSection.Header>
        <StickyListSection.Content data-testid="content">
          <div>Card 1</div>
          <div>Card 2</div>
        </StickyListSection.Content>
      </StickyListSection.Root>
    )

    expect(screen.getByTestId('root')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })
})
