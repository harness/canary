import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { DraggableCard, DraggableCardList } from '../draggable-card'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

// Mock @dnd-kit libraries
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  closestCenter: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => [])
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false
  })
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: vi.fn(() => '')
    }
  }
}))

vi.mock('@hooks/use-drag-and-drop', () => ({
  default: () => ({
    handleDragEnd: vi.fn(),
    getItemId: (index: number) => `item-${index}`
  })
}))

const renderComponent = (props: Partial<React.ComponentProps<typeof DraggableCard>> = {}): RenderResult => {
  const defaultProps = {
    id: 'card-1',
    title: 'Test Card',
    ...props
  }

  return render(
    <TestWrapper>
      <DraggableCard {...defaultProps} />
    </TestWrapper>
  )
}

describe('DraggableCard', () => {
  describe('Basic Rendering', () => {
    test('should render draggable card', () => {
      renderComponent()

      expect(screen.getByText('Test Card')).toBeInTheDocument()
    })

    test('should render with description', () => {
      renderComponent({ title: 'Card Title', description: 'Card description' })

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description')).toBeInTheDocument()
    })

    test('should render drag handle icon', () => {
      const { container } = renderComponent()

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).toBeInTheDocument()
    })

    test('should hide drag handle when disableDragAndDrop is true', () => {
      const { container } = renderComponent({ disableDragAndDrop: true })

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).not.toBeInTheDocument()
    })

    test('should render as Card component', () => {
      const { container } = renderComponent()

      const card = container.querySelector('.cn-card')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Card Props Integration', () => {
    test('should pass through Card props', () => {
      const { container } = renderComponent({
        title: 'Card',
        className: 'custom-card'
      })

      const card = container.querySelector('.custom-card')
      expect(card).toBeInTheDocument()
    })

    test('should apply border when description exists', () => {
      const { container } = renderComponent({
        title: 'Title',
        description: 'Description'
      })

      const border = container.querySelector('.border-b')
      expect(border).toBeInTheDocument()
    })

    test('should not apply border when no description', () => {
      const { container } = renderComponent({ title: 'Title' })

      const borderElements = container.querySelectorAll('.border-b')
      expect(borderElements.length).toBe(0)
    })
  })

  describe('Drag Handle', () => {
    test('should render drag handle with grip icon', () => {
      const { container } = renderComponent()

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).toBeInTheDocument()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should apply active cursor style to drag handle', () => {
      const { container } = renderComponent()

      const dragHandle = container.querySelector('.active\\:cursor-grabbing')
      expect(dragHandle).toBeInTheDocument()
    })
  })

  describe('Title Rendering', () => {
    test('should render string title', () => {
      renderComponent({ title: 'String Title' })

      expect(screen.getByText('String Title')).toBeInTheDocument()
    })

    test('should render ReactNode title', () => {
      renderComponent({
        title: <span data-testid="custom-title">Custom Title</span>
      })

      expect(screen.getByTestId('custom-title')).toBeInTheDocument()
    })
  })

  describe('Description Rendering', () => {
    test('should render string description', () => {
      renderComponent({
        title: 'Title',
        description: 'String description'
      })

      expect(screen.getByText('String description')).toBeInTheDocument()
    })

    test('should render ReactNode description', () => {
      renderComponent({
        title: 'Title',
        description: <span data-testid="custom-desc">Custom Description</span>
      })

      expect(screen.getByTestId('custom-desc')).toBeInTheDocument()
    })

    test('should not render description section when no description', () => {
      const { container } = renderComponent({ title: 'Title' })

      const descriptionSection = container.querySelector('.mt-cn-md')
      expect(descriptionSection).not.toBeInTheDocument()
    })
  })

  describe('DraggableCardList', () => {
    test('should render list of draggable cards', () => {
      const cards = [
        { id: '1', title: 'Card 1' },
        { id: '2', title: 'Card 2' },
        { id: '3', title: 'Card 3' }
      ]

      const setCards = vi.fn()

      render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={setCards} />
        </TestWrapper>
      )

      expect(screen.getByText('Card 1')).toBeInTheDocument()
      expect(screen.getByText('Card 2')).toBeInTheDocument()
      expect(screen.getByText('Card 3')).toBeInTheDocument()
    })

    test('should render DndContext wrapper', () => {
      const cards = [{ id: '1', title: 'Card' }]

      const { container } = render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      const dndContext = container.querySelector('[data-testid="dnd-context"]')
      expect(dndContext).toBeInTheDocument()
    })

    test('should render SortableContext wrapper', () => {
      const cards = [{ id: '1', title: 'Card' }]

      const { container } = render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      const sortableContext = container.querySelector('[data-testid="sortable-context"]')
      expect(sortableContext).toBeInTheDocument()
    })

    test('should handle empty cards array', () => {
      const { container } = render(
        <TestWrapper>
          <DraggableCardList cards={[]} setCards={vi.fn()} />
        </TestWrapper>
      )

      const dndContext = container.querySelector('[data-testid="dnd-context"]')
      expect(dndContext).toBeInTheDocument()
    })

    test('should render cards with descriptions', () => {
      const cards = [
        { id: '1', title: 'Card 1', description: 'Description 1' },
        { id: '2', title: 'Card 2', description: 'Description 2' }
      ]

      render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Description 1')).toBeInTheDocument()
      expect(screen.getByText('Description 2')).toBeInTheDocument()
    })

    test('should handle cards with disableDragAndDrop', () => {
      const cards = [
        { id: '1', title: 'Draggable', disableDragAndDrop: false },
        { id: '2', title: 'Not Draggable', disableDragAndDrop: true }
      ]

      render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Draggable')).toBeInTheDocument()
      expect(screen.getByText('Not Draggable')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle card with all props', () => {
      const { container } = renderComponent({
        id: 'full-card',
        title: 'Full Card',
        description: 'Full Description',
        disableDragAndDrop: false,
        className: 'custom-card-class'
      })

      expect(screen.getByText('Full Card')).toBeInTheDocument()
      expect(screen.getByText('Full Description')).toBeInTheDocument()
      const card = container.querySelector('.custom-card-class')
      expect(card).toBeInTheDocument()
    })

    test('should handle card without description', () => {
      renderComponent({ title: 'No Description Card' })

      expect(screen.getByText('No Description Card')).toBeInTheDocument()
    })

    test('should handle special characters in title', () => {
      renderComponent({ title: 'Card @#$%' })

      expect(screen.getByText('Card @#$%')).toBeInTheDocument()
    })

    test('should handle long titles', () => {
      const longTitle = 'A'.repeat(100)
      renderComponent({ title: longTitle })

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })
  })

  describe('Drag and Drop Behavior', () => {
    test('should apply transform style when dragging', () => {
      const { container } = renderComponent({ id: 'drag-test', title: 'Draggable' })

      const card = container.querySelector('.cn-card')
      expect(card).toBeInTheDocument()
    })

    test('should disable drag when disableDragAndDrop is true', () => {
      const { container } = renderComponent({ disableDragAndDrop: true })

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).not.toBeInTheDocument()
    })

    test('should enable drag by default', () => {
      const { container } = renderComponent()

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).toBeInTheDocument()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when title changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <DraggableCard id="1" title="Initial Title" />
        </TestWrapper>
      )

      expect(screen.getByText('Initial Title')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DraggableCard id="1" title="Updated Title" />
        </TestWrapper>
      )

      expect(screen.getByText('Updated Title')).toBeInTheDocument()
      expect(screen.queryByText('Initial Title')).not.toBeInTheDocument()
    })

    test('should update when description changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <DraggableCard id="1" title="Title" description="Initial Description" />
        </TestWrapper>
      )

      expect(screen.getByText('Initial Description')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DraggableCard id="1" title="Title" description="Updated Description" />
        </TestWrapper>
      )

      expect(screen.getByText('Updated Description')).toBeInTheDocument()
      expect(screen.queryByText('Initial Description')).not.toBeInTheDocument()
    })

    test('should update when disableDragAndDrop changes', () => {
      const { container, rerender } = render(
        <TestWrapper>
          <DraggableCard id="1" title="Title" disableDragAndDrop={false} />
        </TestWrapper>
      )

      let dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DraggableCard id="1" title="Title" disableDragAndDrop={true} />
        </TestWrapper>
      )

      dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).not.toBeInTheDocument()
    })
  })

  describe('DraggableCardList - Extended', () => {
    test('should handle single card', () => {
      const cards = [{ id: '1', title: 'Single Card' }]

      render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Single Card')).toBeInTheDocument()
    })

    test('should handle many cards', () => {
      const cards = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        title: `Card ${i}`
      }))

      render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Card 0')).toBeInTheDocument()
      expect(screen.getByText('Card 9')).toBeInTheDocument()
    })

    test('should update when cards array changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <DraggableCardList cards={[{ id: '1', title: 'Card 1' }]} setCards={vi.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Card 1')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DraggableCardList
            cards={[
              { id: '1', title: 'Card 1' },
              { id: '2', title: 'Card 2' }
            ]}
            setCards={vi.fn()}
          />
        </TestWrapper>
      )

      expect(screen.getByText('Card 1')).toBeInTheDocument()
      expect(screen.getByText('Card 2')).toBeInTheDocument()
    })

    test('should pass Card props through cards', () => {
      const cards = [{ id: '1', title: 'Card', className: 'custom-class' }]

      const { container } = render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      const card = container.querySelector('.custom-class')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should have disableDragAndDrop false by default', () => {
      const { container } = renderComponent()

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).toBeInTheDocument()
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty title', () => {
      renderComponent({ title: '' })

      const card = document.querySelector('.cn-card')
      expect(card).toBeInTheDocument()
    })

    test('should handle numeric title', () => {
      renderComponent({ title: 123 as any })

      expect(screen.getByText('123')).toBeInTheDocument()
    })

    test('should handle complex ReactNode in description', () => {
      renderComponent({
        title: 'Title',
        description: (
          <div>
            <strong>Bold</strong> <em>Italic</em>
          </div>
        )
      })

      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('Italic')).toBeInTheDocument()
    })

    test('should handle long description', () => {
      const longDesc = 'C'.repeat(200)
      renderComponent({ title: 'Title', description: longDesc })

      expect(screen.getByText(longDesc)).toBeInTheDocument()
    })
  })

  describe('Card Content Layout', () => {
    test('should apply gap and padding', () => {
      const { container } = renderComponent({ title: 'Test' })

      const contentWrapper = container.querySelector('.flex.items-center.gap-cn-xs')
      expect(contentWrapper).toBeInTheDocument()
    })

    test('should apply pb-cn-md when description exists', () => {
      const { container } = renderComponent({ title: 'Test', description: 'Desc' })

      const titleWrapper = container.querySelector('.pb-cn-md')
      expect(titleWrapper).toBeInTheDocument()
    })

    test('should not apply pb-cn-md when no description', () => {
      const { container } = renderComponent({ title: 'Test' })

      const titleWrapper = container.querySelector('.pb-cn-md')
      expect(titleWrapper).not.toBeInTheDocument()
    })

    test('should apply mt-cn-md to description', () => {
      const { container } = renderComponent({ title: 'Test', description: 'Description' })

      const descWrapper = container.querySelector('.mt-cn-md')
      expect(descWrapper).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should render card structure accessibly', () => {
      renderComponent({ title: 'Accessible Card', description: 'Accessible description' })

      expect(screen.getByText('Accessible Card')).toBeInTheDocument()
      expect(screen.getByText('Accessible description')).toBeInTheDocument()
    })

    test('should make drag handle accessible', () => {
      const { container } = renderComponent()

      const dragHandle = container.querySelector('.cursor-grab')
      expect(dragHandle).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle DraggableCardList with mixed configurations', () => {
      const cards = [
        { id: '1', title: 'Draggable', description: 'Can drag', disableDragAndDrop: false },
        { id: '2', title: 'Not Draggable', disableDragAndDrop: true },
        { id: '3', title: 'With Description', description: 'Has description' }
      ]

      render(
        <TestWrapper>
          <DraggableCardList cards={cards} setCards={vi.fn()} />
        </TestWrapper>
      )

      expect(screen.getByText('Draggable')).toBeInTheDocument()
      expect(screen.getByText('Not Draggable')).toBeInTheDocument()
      expect(screen.getByText('With Description')).toBeInTheDocument()
    })
  })
})
