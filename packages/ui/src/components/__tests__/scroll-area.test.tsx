import React, { useState } from 'react'

import { render, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { ScrollArea, useScrollArea } from '../scroll-area'

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

  describe('Scroll position cleanup', () => {
    test('should cleanup old scroll positions on mount', () => {
      // Add some old scroll positions
      mockSessionStorage.setItem('scroll_old-key-1', JSON.stringify({ scrollTop: 100, timestamp: Date.now() }))
      mockSessionStorage.setItem('scroll_old-key-2', JSON.stringify({ scrollTop: 200, timestamp: Date.now() }))
      mockSessionStorage.setItem('other-key', 'value')

      render(
        <ScrollArea preserveScrollPosition storageKey="current-key">
          <div>Content</div>
        </ScrollArea>
      )

      // Old scroll keys should be removed, but other keys should remain
      expect(mockSessionStorage.getItem('scroll_old-key-1')).toBeNull()
      expect(mockSessionStorage.getItem('scroll_old-key-2')).toBeNull()
      expect(mockSessionStorage.getItem('other-key')).toBe('value')
    })

    test('should not cleanup when preserveScrollPosition is false', () => {
      mockSessionStorage.setItem('scroll_old-key', JSON.stringify({ scrollTop: 100, timestamp: Date.now() }))

      render(
        <ScrollArea preserveScrollPosition={false} storageKey="current-key">
          <div>Content</div>
        </ScrollArea>
      )

      // Old key should still exist
      expect(mockSessionStorage.getItem('scroll_old-key')).toBeTruthy()
    })

    test('should not cleanup when storageKey is not provided', () => {
      mockSessionStorage.setItem('scroll_old-key', JSON.stringify({ scrollTop: 100, timestamp: Date.now() }))

      render(
        <ScrollArea preserveScrollPosition>
          <div>Content</div>
        </ScrollArea>
      )

      // Old key should still exist
      expect(mockSessionStorage.getItem('scroll_old-key')).toBeTruthy()
    })

    test('should preserve current storageKey during cleanup', () => {
      mockSessionStorage.setItem('scroll_current-key', JSON.stringify({ scrollTop: 100, timestamp: Date.now() }))
      mockSessionStorage.setItem('scroll_old-key', JSON.stringify({ scrollTop: 200, timestamp: Date.now() }))

      render(
        <ScrollArea preserveScrollPosition storageKey="current-key">
          <div>Content</div>
        </ScrollArea>
      )

      // Current key should remain
      expect(mockSessionStorage.getItem('scroll_current-key')).toBeTruthy()
      // Old key should be removed
      expect(mockSessionStorage.getItem('scroll_old-key')).toBeNull()
    })
  })

  describe('IntersectionObserver callbacks', () => {
    test('should call onScrollTop callback when triggered', () => {
      const handleScrollTop = vi.fn()
      let observerCallback: any = null

      mockIntersectionObserver.mockImplementation((callback: any) => {
        observerCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn()
        }
      })

      render(
        <ScrollArea onScrollTop={handleScrollTop}>
          <div>Content</div>
        </ScrollArea>
      )

      // Simulate intersection observer callback
      if (observerCallback) {
        observerCallback([{ isIntersecting: true } as IntersectionObserverEntry])
      }

      expect(handleScrollTop).toHaveBeenCalled()
    })

    test('should call onScrollBottom callback when triggered', () => {
      const handleScrollBottom = vi.fn()
      let observerCallback: any = null

      mockIntersectionObserver.mockImplementation((callback: any) => {
        observerCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn()
        }
      })

      render(
        <ScrollArea onScrollBottom={handleScrollBottom}>
          <div>Content</div>
        </ScrollArea>
      )

      if (observerCallback) {
        observerCallback([{ isIntersecting: true } as IntersectionObserverEntry])
      }

      expect(handleScrollBottom).toHaveBeenCalled()
    })

    test('should call onScrollLeft callback when triggered', () => {
      const handleScrollLeft = vi.fn()
      let observerCallback: any = null

      mockIntersectionObserver.mockImplementation((callback: any) => {
        observerCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn()
        }
      })

      render(
        <ScrollArea onScrollLeft={handleScrollLeft}>
          <div>Content</div>
        </ScrollArea>
      )

      if (observerCallback) {
        observerCallback([{ isIntersecting: true } as IntersectionObserverEntry])
      }

      expect(handleScrollLeft).toHaveBeenCalled()
    })

    test('should call onScrollRight callback when triggered', () => {
      const handleScrollRight = vi.fn()
      let observerCallback: any = null

      mockIntersectionObserver.mockImplementation((callback: any) => {
        observerCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn()
        }
      })

      render(
        <ScrollArea onScrollRight={handleScrollRight}>
          <div>Content</div>
        </ScrollArea>
      )

      if (observerCallback) {
        observerCallback([{ isIntersecting: true } as IntersectionObserverEntry])
      }

      expect(handleScrollRight).toHaveBeenCalled()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(ScrollArea.displayName).toBe('ScrollArea')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to content element', () => {
      const ref = vi.fn()

      render(
        <ScrollArea ref={ref}>
          <div>Content</div>
        </ScrollArea>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty children', () => {
      const { container } = render(<ScrollArea>{null}</ScrollArea>)

      const scrollArea = container.querySelector('.cn-scroll-area')
      expect(scrollArea).toBeInTheDocument()
    })

    test('should handle multiple children', () => {
      render(
        <ScrollArea>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ScrollArea>
      )

      expect(document.body.textContent).toContain('Child 1')
      expect(document.body.textContent).toContain('Child 2')
      expect(document.body.textContent).toContain('Child 3')
    })

    test('should handle error when saving scroll position fails', async () => {
      // Mock sessionStorage.setItem to throw error
      const originalSetItem = mockSessionStorage.setItem
      let errorThrown = false

      mockSessionStorage.setItem = vi.fn().mockImplementation(() => {
        errorThrown = true
        throw new Error('Storage error')
      })

      const { container } = render(
        <ScrollArea preserveScrollPosition storageKey="test-key">
          <div style={{ height: '1000px' }}>Content</div>
        </ScrollArea>
      )

      const viewport = container.querySelector('.cn-scroll-area') as HTMLDivElement
      Object.defineProperty(viewport, 'scrollTop', { value: 100, writable: true })
      viewport.dispatchEvent(new Event('scroll'))

      await new Promise(resolve => setTimeout(resolve, 1100))

      // Error was thrown and caught
      expect(errorThrown).toBe(true)

      // Restore
      mockSessionStorage.setItem = originalSetItem
    })

    test('should handle error when restoring scroll position fails', async () => {
      // Mock sessionStorage.getItem to throw error
      const originalGetItem = mockSessionStorage.getItem
      let errorThrown = false

      mockSessionStorage.getItem = vi.fn().mockImplementation(() => {
        errorThrown = true
        throw new Error('Storage error')
      })

      render(
        <ScrollArea preserveScrollPosition storageKey="test-key">
          <div>Content</div>
        </ScrollArea>
      )

      // Wait for restoration attempt
      await new Promise(resolve => setTimeout(resolve, 100))

      // Error was thrown and caught
      expect(errorThrown).toBe(true)

      // Restore
      mockSessionStorage.getItem = originalGetItem
    })
  })
})

describe('useScrollArea', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionStorage.clear()
  })

  // Component wrapper for testing the hook
  const TestComponent = ({ props, testFn }: { props?: any; testFn: (result: any) => void }) => {
    const hookResult = useScrollArea(props)
    testFn(hookResult)
    return null
  }

  test('should return initial state values', () => {
    let result: any
    render(<TestComponent testFn={r => (result = r)} />)

    expect(result.isTop).toBe(true)
    expect(result.isBottom).toBe(false)
    expect(typeof result.onScrollTop).toBe('function')
    expect(typeof result.onScrollBottom).toBe('function')
  })

  test('should update isTop state when scrolling from top', () => {
    let result: any
    const TestWrapper = () => {
      result = useScrollArea()
      const [, setUpdate] = useState(0)

      return (
        <button
          onClick={() => {
            result.onScrollTop({ isIntersecting: false } as IntersectionObserverEntry)
            setUpdate(u => u + 1)
          }}
        >
          Trigger
        </button>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Trigger').click()

    expect(result.isTop).toBe(false)
  })

  test('should update isTop state when scrolling to top', () => {
    let result: any
    const TestWrapper = () => {
      result = useScrollArea()
      const [, setUpdate] = useState(0)

      return (
        <div>
          <button
            onClick={() => {
              result.onScrollTop({ isIntersecting: false } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            Away
          </button>
          <button
            onClick={() => {
              result.onScrollTop({ isIntersecting: true } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            Top
          </button>
        </div>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Away').click()
    getByText('Top').click()

    expect(result.isTop).toBe(true)
  })

  test('should update isBottom state when scrolling to bottom', () => {
    let result: any
    const TestWrapper = () => {
      result = useScrollArea()
      const [, setUpdate] = useState(0)

      return (
        <button
          onClick={() => {
            result.onScrollBottom({ isIntersecting: true } as IntersectionObserverEntry)
            setUpdate(u => u + 1)
          }}
        >
          Bottom
        </button>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Bottom').click()

    expect(result.isBottom).toBe(true)
  })

  test('should update isBottom state when scrolling from bottom', () => {
    let result: any
    const TestWrapper = () => {
      result = useScrollArea()
      const [, setUpdate] = useState(0)

      return (
        <div>
          <button
            onClick={() => {
              result.onScrollBottom({ isIntersecting: true } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            ToBottom
          </button>
          <button
            onClick={() => {
              result.onScrollBottom({ isIntersecting: false } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            FromBottom
          </button>
        </div>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('ToBottom').click()
    getByText('FromBottom').click()

    expect(result.isBottom).toBe(false)
  })

  test('should call provided onScrollTop callback', () => {
    const handleScrollTop = vi.fn()
    let result: any

    const TestWrapper = () => {
      result = useScrollArea({ onScrollTop: handleScrollTop } as any)
      return (
        <button
          onClick={() => {
            result.onScrollTop({ isIntersecting: true } as IntersectionObserverEntry)
          }}
        >
          Trigger
        </button>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Trigger').click()

    expect(handleScrollTop).toHaveBeenCalled()
  })

  test('should call provided onScrollBottom callback', () => {
    const handleScrollBottom = vi.fn()
    let result: any

    const TestWrapper = () => {
      result = useScrollArea({ onScrollBottom: handleScrollBottom } as any)
      return (
        <button
          onClick={() => {
            result.onScrollBottom({ isIntersecting: true } as IntersectionObserverEntry)
          }}
        >
          Trigger
        </button>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Trigger').click()

    expect(handleScrollBottom).toHaveBeenCalled()
  })

  test('should handle both callbacks together', () => {
    const handleScrollTop = vi.fn()
    const handleScrollBottom = vi.fn()
    let result: any

    const TestWrapper = () => {
      result = useScrollArea({
        onScrollTop: handleScrollTop,
        onScrollBottom: handleScrollBottom
      } as any)
      const [, setUpdate] = useState(0)

      return (
        <div>
          <button
            onClick={() => {
              result.onScrollTop({ isIntersecting: false } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            Top
          </button>
          <button
            onClick={() => {
              result.onScrollBottom({ isIntersecting: true } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            Bottom
          </button>
        </div>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Top').click()
    getByText('Bottom').click()

    expect(handleScrollTop).toHaveBeenCalled()
    expect(handleScrollBottom).toHaveBeenCalled()
    expect(result.isTop).toBe(false)
    expect(result.isBottom).toBe(true)
  })

  test('should work without props', () => {
    let result: any

    const TestWrapper = () => {
      result = useScrollArea()
      const [, setUpdate] = useState(0)

      return (
        <div>
          <button
            onClick={() => {
              result.onScrollTop({ isIntersecting: false } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            Top
          </button>
          <button
            onClick={() => {
              result.onScrollBottom({ isIntersecting: true } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            Bottom
          </button>
        </div>
      )
    }

    const { getByText } = render(<TestWrapper />)
    getByText('Top').click()
    getByText('Bottom').click()

    expect(result.isTop).toBe(false)
    expect(result.isBottom).toBe(true)
  })

  test('should update state through multiple scroll events', () => {
    let result: any

    const TestWrapper = () => {
      result = useScrollArea()
      const [, setUpdate] = useState(0)

      return (
        <div>
          <button
            onClick={() => {
              result.onScrollTop({ isIntersecting: false } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            AwayTop
          </button>
          <button
            onClick={() => {
              result.onScrollBottom({ isIntersecting: true } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            ToBottom
          </button>
          <button
            onClick={() => {
              result.onScrollBottom({ isIntersecting: false } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            AwayBottom
          </button>
          <button
            onClick={() => {
              result.onScrollTop({ isIntersecting: true } as IntersectionObserverEntry)
              setUpdate(u => u + 1)
            }}
          >
            BackTop
          </button>
        </div>
      )
    }

    const { getByText } = render(<TestWrapper />)

    // Start at top
    expect(result.isTop).toBe(true)
    expect(result.isBottom).toBe(false)

    // Scroll away from top
    getByText('AwayTop').click()
    expect(result.isTop).toBe(false)

    // Scroll to bottom
    getByText('ToBottom').click()
    expect(result.isBottom).toBe(true)

    // Scroll away from bottom
    getByText('AwayBottom').click()
    expect(result.isBottom).toBe(false)

    // Scroll back to top
    getByText('BackTop').click()
    expect(result.isTop).toBe(true)
  })
})
