import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { DraggableCardList } from '../draggable-card'

// Mock IntersectionObserver since jsdom doesn't provide it
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn()
  }))
)

const mockCards = [
  { id: '1', title: 'Card 1' },
  { id: '2', title: 'Card 2' }
]

describe('DraggableCardList header and sticky props', () => {
  test('renders header above card list when header prop is provided', () => {
    render(
      <DraggableCardList
        header={<div data-testid="header-content">My Header</div>}
        cards={mockCards}
        setCards={() => {}}
      />
    )

    expect(screen.getByTestId('header-content')).toBeInTheDocument()
    expect(screen.getByText('Card 1')).toBeInTheDocument()
    expect(screen.getByText('Card 2')).toBeInTheDocument()
  })

  test('renders without header when header prop is not provided', () => {
    const { container } = render(<DraggableCardList cards={mockCards} setCards={() => {}} />)

    expect(container.querySelector('.cn-sticky-list-section')).not.toBeInTheDocument()
  })

  test('wraps in StickyListSection when both header and sticky are provided', () => {
    const { container } = render(
      <DraggableCardList
        header={<div data-testid="header-content">Sticky Header</div>}
        sticky
        cards={mockCards}
        setCards={() => {}}
      />
    )

    expect(container.querySelector('.cn-sticky-list-section')).toBeInTheDocument()
    expect(container.querySelector('.cn-sticky-list-section-header')).toBeInTheDocument()
    expect(container.querySelector('.cn-sticky-list-section-content')).toBeInTheDocument()
    expect(screen.getByTestId('header-content')).toBeInTheDocument()
  })

  test('renders header without StickyListSection when sticky is false', () => {
    const { container } = render(
      <DraggableCardList
        header={<div data-testid="header-content">Plain Header</div>}
        sticky={false}
        cards={mockCards}
        setCards={() => {}}
      />
    )

    expect(screen.getByTestId('header-content')).toBeInTheDocument()
    expect(container.querySelector('.cn-sticky-list-section')).not.toBeInTheDocument()
  })

  test('ignores sticky prop when no header is provided', () => {
    const { container } = render(<DraggableCardList sticky cards={mockCards} setCards={() => {}} />)

    expect(container.querySelector('.cn-sticky-list-section')).not.toBeInTheDocument()
  })
})
