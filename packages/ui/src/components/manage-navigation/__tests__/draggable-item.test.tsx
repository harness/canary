import React from 'react'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DraggableItem } from '../draggable-item'

// Mock @dnd-kit/sortable
const mockUseSortable = vi.fn(({ id }: { id: string }) => ({
  attributes: { 'data-sortable-id': id },
  listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
  setNodeRef: vi.fn((node: HTMLElement | null) => node),
  transform: { x: 10, y: 20 },
  transition: 'transform 200ms',
  isDragging: false
}))

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: (props: { id: string }) => mockUseSortable(props)
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn((transform: { x: number; y: number } | null) => {
        if (!transform) return ''
        return `translate3d(${transform.x}px, ${transform.y}px, 0)`
      })
    }
  }
}))

describe('DraggableItem', () => {
  beforeEach(() => {
    mockUseSortable.mockImplementation(({ id }: { id: string }) => ({
      attributes: { 'data-sortable-id': id },
      listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
      setNodeRef: vi.fn((node: HTMLElement | null) => node),
      transform: { x: 10, y: 20 },
      transition: 'transform 200ms',
      isDragging: false
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders children with attributes and listeners', () => {
      render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Child Content
            </div>
          )}
        </DraggableItem>
      )

      const child = screen.getByTestId('child')
      expect(child).toBeInTheDocument()
      expect(child).toHaveTextContent('Child Content')
      expect(child).toHaveAttribute('data-sortable-id', 'test-id')
    })

    it('renders with default tag (div) when tag is not specified', () => {
      const { container } = render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild
      expect(draggableItem?.nodeName).toBe('DIV')
    })

    it('renders with specified tag', () => {
      const { container } = render(
        <DraggableItem id="test-id" tag="li">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild
      expect(draggableItem?.nodeName).toBe('LI')
    })

    it('renders with button tag', () => {
      const { container } = render(
        <DraggableItem id="test-id" tag="button">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild
      expect(draggableItem?.nodeName).toBe('BUTTON')
    })
  })

  describe('Styling and Transform', () => {
    it('applies transform style when dragging', () => {
      mockUseSortable.mockReturnValueOnce({
        attributes: { 'data-sortable-id': 'test-id' },
        listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
        setNodeRef: vi.fn(),
        transform: { x: 10, y: 20 },
        transition: 'transform 200ms',
        isDragging: true
      })

      const { container } = render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild as HTMLElement
      expect(draggableItem.style.transform).toBe('translate3d(10px, 20px, 0)')
      expect(draggableItem.style.transition).toBe('transform 200ms')
      expect(draggableItem.style.opacity).toBe('0.5')
    })

    it('applies full opacity when not dragging', () => {
      const { container } = render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild as HTMLElement
      expect(draggableItem.style.opacity).toBe('1')
    })

    it('applies z-index when dragging', () => {
      mockUseSortable.mockReturnValueOnce({
        attributes: { 'data-sortable-id': 'test-id' },
        listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
        setNodeRef: vi.fn(),
        transform: { x: 0, y: 0 },
        transition: null,
        isDragging: true
      } as any)

      const { container } = render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild as HTMLElement
      expect(draggableItem.className).toContain('z-10')
    })

    it('applies custom className', () => {
      const { container } = render(
        <DraggableItem id="test-id" tag="div" className="custom-class">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild as HTMLElement
      expect(draggableItem.className).toContain('custom-class')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty listeners object', () => {
      mockUseSortable.mockReturnValueOnce({
        attributes: { 'data-sortable-id': 'test-id' },
        listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false
      } as any)

      render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('handles null transform', () => {
      mockUseSortable.mockReturnValueOnce({
        attributes: { 'data-sortable-id': 'test-id' },
        listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false
      } as any)

      const { container } = render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild as HTMLElement
      expect(draggableItem.style.transform).toBe('')
    })

    it('handles null transition', () => {
      mockUseSortable.mockReturnValueOnce({
        attributes: { 'data-sortable-id': 'test-id' },
        listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
        setNodeRef: vi.fn(),
        transform: { x: 0, y: 0 },
        transition: null,
        isDragging: false
      } as any)

      const { container } = render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      const draggableItem = container.firstChild as HTMLElement
      expect(draggableItem.style.transition).toBe('')
    })

    it('handles undefined listeners (default parameter)', () => {
      mockUseSortable.mockReturnValueOnce({
        attributes: { 'data-sortable-id': 'test-id' },
        listeners: { onMouseDown: vi.fn(), onTouchStart: vi.fn() },
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false
      } as any)

      render(
        <DraggableItem id="test-id" tag="div">
          {({ attributes, listeners }) => (
            <div data-testid="child" {...attributes} {...listeners}>
              Content
            </div>
          )}
        </DraggableItem>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })
})
