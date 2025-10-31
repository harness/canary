import { render, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { ScrollArea } from '../scroll-area'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})
window.IntersectionObserver = mockIntersectionObserver as any

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length
    }
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
})

describe('ScrollArea', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionStorage.clear()
  })

  describe('Rendering', () => {
    test('should render children', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>
      )
      expect(container.textContent).toContain('Content')
    })

    test('should apply default className', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>
      )
      const scrollArea = container.querySelector('.cn-scroll-area')
      expect(scrollArea).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(
        <ScrollArea className="custom-class">
          <div>Content</div>
        </ScrollArea>
      )
      const scrollArea = container.querySelector('.cn-scroll-area')
      expect(scrollArea).toHaveClass('custom-class')
    })

    test('should apply custom classNameContent', () => {
      const { container } = render(
        <ScrollArea classNameContent="custom-content-class">
          <div>Content</div>
        </ScrollArea>
      )
      const content = container.querySelector('.cn-scroll-area-content')
      expect(content).toHaveClass('custom-content-class')
    })

    test('should set direction attribute', () => {
      const { container } = render(
        <ScrollArea direction="rtl">
          <div>Content</div>
        </ScrollArea>
      )
      const scrollArea = container.querySelector('.cn-scroll-area')
      expect(scrollArea).toHaveAttribute('dir', 'rtl')
    })
  })

  describe('Intersection observers', () => {
    test('should render top marker when onScrollTop is provided', () => {
      const { container } = render(
        <ScrollArea onScrollTop={vi.fn()}>
          <div>Content</div>
        </ScrollArea>
      )
      const topMarker = container.querySelector('.cn-scroll-area-marker-top')
      expect(topMarker).toBeInTheDocument()
    })

    test('should render bottom marker when onScrollBottom is provided', () => {
      const { container } = render(
        <ScrollArea onScrollBottom={vi.fn()}>
          <div>Content</div>
        </ScrollArea>
      )
      const bottomMarker = container.querySelector('.cn-scroll-area-marker-bottom')
      expect(bottomMarker).toBeInTheDocument()
    })

    test('should render left marker when onScrollLeft is provided', () => {
      const { container } = render(
        <ScrollArea onScrollLeft={vi.fn()}>
          <div>Content</div>
        </ScrollArea>
      )
      const leftMarker = container.querySelector('.cn-scroll-area-marker-left')
      expect(leftMarker).toBeInTheDocument()
    })

    test('should render right marker when onScrollRight is provided', () => {
      const { container } = render(
        <ScrollArea onScrollRight={vi.fn()}>
          <div>Content</div>
        </ScrollArea>
      )
      const rightMarker = container.querySelector('.cn-scroll-area-marker-right')
      expect(rightMarker).toBeInTheDocument()
    })

    test('should not render markers when callbacks are not provided', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>
      )
      const topMarker = container.querySelector('.cn-scroll-area-marker-top')
      const bottomMarker = container.querySelector('.cn-scroll-area-marker-bottom')
      const leftMarker = container.querySelector('.cn-scroll-area-marker-left')
      const rightMarker = container.querySelector('.cn-scroll-area-marker-right')
      expect(topMarker).not.toBeInTheDocument()
      expect(bottomMarker).not.toBeInTheDocument()
      expect(leftMarker).not.toBeInTheDocument()
      expect(rightMarker).not.toBeInTheDocument()
    })

    test('should create IntersectionObserver for each callback', () => {
      render(
        <ScrollArea onScrollTop={vi.fn()} onScrollBottom={vi.fn()}>
          <div>Content</div>
        </ScrollArea>
      )
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })
  })

  describe('Scroll position preservation', () => {
    test('should save scroll position when preserveScrollPosition is true', async () => {
      const { container } = render(
        <ScrollArea preserveScrollPosition storageKey="test-key">
          <div style={{ height: '1000px' }}>Content</div>
        </ScrollArea>
      )

      const viewport = container.querySelector('.cn-scroll-area') as HTMLDivElement
      Object.defineProperty(viewport, 'scrollTop', { value: 100, writable: true })

      viewport.dispatchEvent(new Event('scroll'))

      await waitFor(
        () => {
          const stored = mockSessionStorage.getItem('scroll_test-key')
          expect(stored).toBeTruthy()
        },
        { timeout: 2000 }
      )
    })

    test('should not save scroll position when preserveScrollPosition is false', async () => {
      const { container } = render(
        <ScrollArea preserveScrollPosition={false} storageKey="test-key">
          <div style={{ height: '1000px' }}>Content</div>
        </ScrollArea>
      )

      const viewport = container.querySelector('.cn-scroll-area') as HTMLDivElement
      Object.defineProperty(viewport, 'scrollTop', { value: 100, writable: true })

      viewport.dispatchEvent(new Event('scroll'))

      await new Promise(resolve => setTimeout(resolve, 1100))

      const stored = mockSessionStorage.getItem('scroll_test-key')
      expect(stored).toBeNull()
    })

    test('should restore scroll position on mount', async () => {
      mockSessionStorage.setItem('scroll_test-key', JSON.stringify({ scrollTop: 200, timestamp: Date.now() }))

      const { container } = render(
        <ScrollArea preserveScrollPosition storageKey="test-key">
          <div style={{ height: '1000px' }}>Content</div>
        </ScrollArea>
      )

      await waitFor(() => {
        const viewport = container.querySelector('.cn-scroll-area') as HTMLDivElement
        expect(viewport.scrollTop).toBe(200)
      })
    })

    test('should not restore expired scroll position', async () => {
      const expiredTimestamp = Date.now() - 31 * 60 * 1000 // 31 minutes ago
      mockSessionStorage.setItem('scroll_test-key', JSON.stringify({ scrollTop: 200, timestamp: expiredTimestamp }))

      const { container } = render(
        <ScrollArea preserveScrollPosition storageKey="test-key">
          <div style={{ height: '1000px' }}>Content</div>
        </ScrollArea>
      )

      await new Promise(resolve => setTimeout(resolve, 100))

      const viewport = container.querySelector('.cn-scroll-area') as HTMLDivElement
      expect(viewport.scrollTop).toBe(0)
    })
  })

  describe('Custom rootMargin and threshold', () => {
    test('should accept rootMargin as string', () => {
      render(
        <ScrollArea onScrollTop={vi.fn()} rootMargin="10px">
          <div>Content</div>
        </ScrollArea>
      )
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    test('should accept rootMargin as object', () => {
      render(
        <ScrollArea onScrollTop={vi.fn()} rootMargin={{ top: '10px', bottom: '20px' }}>
          <div>Content</div>
        </ScrollArea>
      )
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    test('should accept custom threshold', () => {
      render(
        <ScrollArea onScrollTop={vi.fn()} threshold={0.5}>
          <div>Content</div>
        </ScrollArea>
      )
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    test('should accept threshold as array', () => {
      render(
        <ScrollArea onScrollTop={vi.fn()} threshold={[0, 0.25, 0.5, 0.75, 1]}>
          <div>Content</div>
        </ScrollArea>
      )
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })
  })

  describe('Additional HTML attributes', () => {
    test('should forward additional props to content element', () => {
      const { container } = render(
        <ScrollArea data-testid="scroll-area">
          <div>Content</div>
        </ScrollArea>
      )
      const content = container.querySelector('[data-testid="scroll-area"]')
      expect(content).toBeInTheDocument()
    })
  })
})
