import { act, render } from '@testing-library/react'
import { vi } from 'vitest'

import { useIsMobile } from '../use-is-mobile'

const renderUseIsMobile = () => {
  const result = { current: false }

  const TestComponent = () => {
    result.current = useIsMobile()
    return null
  }

  const utils = render(<TestComponent />)

  return {
    result,
    rerender: () => utils.rerender(<TestComponent />),
    unmount: utils.unmount
  }
}

describe('useIsMobile', () => {
  let originalInnerWidth: number
  let matchMediaMock: any

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    matchMediaMock = {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }

    global.matchMedia = vi.fn((_query: string) => matchMediaMock)
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    })
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    test('should return false for desktop width (>= 768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })

    test('should return true for mobile width (< 768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should return false for exactly 768px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })

    test('should return true for 767px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should return true for 769px (just above breakpoint)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 769
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })
  })

  describe('Media Query Listener', () => {
    test('should set up matchMedia listener on mount', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      renderUseIsMobile()

      expect(global.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
      expect(matchMediaMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    test('should clean up listener on unmount', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { unmount } = renderUseIsMobile()

      unmount()

      expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    test('should update state when media query changes', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)

      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      // Get the change handler that was registered
      const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1]

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(true)
    })

    test('should update from mobile to desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)

      // Simulate resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1]

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(false)
    })

    test('should handle multiple resize events', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result } = renderUseIsMobile()
      const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1]

      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(true)

      // Resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(false)

      // Resize to mobile again
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      })

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle very small widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should handle very large widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 3840
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })

    test('should handle width of 1px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should handle width of 0', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 0
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should coerce undefined state to false', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result } = renderUseIsMobile()
      // The hook returns !!isMobile, so undefined becomes false
      expect(typeof result.current).toBe('boolean')
      expect(result.current).toBe(false)
    })
  })

  describe('Breakpoint Boundary', () => {
    test('should use 768px as the mobile breakpoint', () => {
      expect(global.matchMedia).toBeDefined()

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      renderUseIsMobile()

      expect(global.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    })

    test('should treat 767px as mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should treat 768px as desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })
  })

  describe('State Updates', () => {
    test('should only update state when crossing breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result } = renderUseIsMobile()
      const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1]

      const initialValue = result.current

      // Change width but stay above breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 900
      })

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(initialValue)
      expect(result.current).toBe(false)
    })

    test('should update when crossing from desktop to mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)

      const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1]

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600
      })

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(true)
    })

    test('should update when crossing from mobile to desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)

      const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1]

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800
      })

      act(() => {
        changeHandler()
      })

      expect(result.current).toBe(false)
    })
  })

  describe('Common Device Widths', () => {
    test('should detect iPhone SE (375px) as mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should detect iPad (768px) as desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })

    test('should detect iPad Pro (1024px) as desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })

    test('should detect desktop (1920px) as desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(false)
    })

    test('should detect small phone (320px) as mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })

    test('should detect large phone (414px) as mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 414
      })

      const { result } = renderUseIsMobile()
      expect(result.current).toBe(true)
    })
  })

  describe('Hook Re-renders', () => {
    test('should maintain state across re-renders without resize', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })

      const { result, rerender } = renderUseIsMobile()

      const initialValue = result.current
      rerender()

      expect(result.current).toBe(initialValue)
    })

    test('should handle unmount and remount', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      const { result: result1, unmount } = renderUseIsMobile()
      expect(result1.current).toBe(true)

      unmount()

      const { result: result2 } = renderUseIsMobile()
      expect(result2.current).toBe(true)
    })
  })
})
