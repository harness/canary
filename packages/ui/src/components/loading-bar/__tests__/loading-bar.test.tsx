import { createRef } from 'react'

import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import loadingBarStyles from '../../../../tailwind-utils-config/components/loading-bar'
import { LoadingBar } from '../loading-bar'
import { createLoadingBarController, loadingBar } from '../loading-bar-controller'

const SHOW_DELAY = 120
const CUSTOM_LABEL = 'Page loading'
const make = () => createLoadingBarController({ showDelay: SHOW_DELAY, minVisibleTime: 0, random: () => 0.5 })
const fill = (root: HTMLElement) => root.querySelector('.cn-loading-bar-fill') as HTMLElement

describe('LoadingBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('controller mode', () => {
    it('is hidden and exposes progressbar semantics when idle', () => {
      render(<LoadingBar controller={make()} />)
      const el = screen.getByRole('progressbar', { hidden: true })
      expect(el).toHaveAttribute('data-state', 'hidden')
      expect(el).toHaveAttribute('aria-hidden', 'true')
      expect(el).toHaveAttribute('aria-busy', 'false')
      expect(el).toHaveAttribute('aria-valuemin', '0')
      expect(el).toHaveAttribute('aria-valuemax', '100')
      expect(el).toHaveAttribute('aria-valuenow', '0')
      expect(el).toHaveAttribute('aria-label', 'Loading')
    })

    it('is not exposed to assistive tech while idle', () => {
      render(<LoadingBar controller={make()} />)
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('shows and follows the controller', () => {
      const bar = make()
      render(<LoadingBar controller={bar} />)
      act(() => {
        bar.start('a')
        vi.advanceTimersByTime(SHOW_DELAY)
      })
      const el = screen.getByRole('progressbar')
      expect(el).toHaveAttribute('data-state', 'visible')
      expect(el).toHaveAttribute('aria-busy', 'true')
      expect(el).toHaveAttribute('aria-hidden', 'false')
      expect(el).toHaveAttribute('aria-valuenow', '8')
      expect(fill(el).style.transform).toBe('scaleX(0.08)')
    })

    it('advances, completes and hides again', () => {
      const bar = make()
      render(<LoadingBar controller={bar} />)
      act(() => {
        bar.start('a')
        vi.advanceTimersByTime(SHOW_DELAY + 1000)
      })
      const el = screen.getByRole('progressbar')
      expect(Number(el.getAttribute('aria-valuenow'))).toBeGreaterThan(8)
      act(() => {
        bar.done('a')
      })
      expect(el).toHaveAttribute('aria-valuenow', '100')
      act(() => {
        vi.advanceTimersByTime(400)
      })
      expect(el).toHaveAttribute('data-state', 'hidden')
      expect(el).toHaveAttribute('aria-valuenow', '0')
    })

    it('follows the shared loadingBar by default', () => {
      render(<LoadingBar />)
      act(() => {
        loadingBar.start('shared')
        vi.advanceTimersByTime(SHOW_DELAY)
      })
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'visible')
      act(() => {
        loadingBar.reset()
        vi.advanceTimersByTime(1000)
      })
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('two bars on one controller stay in sync', () => {
      const bar = make()
      render(
        <>
          <LoadingBar controller={bar} data-testid="one" />
          <LoadingBar controller={bar} data-testid="two" />
        </>
      )
      act(() => {
        bar.start('a')
        vi.advanceTimersByTime(SHOW_DELAY)
      })
      expect(screen.getByTestId('one')).toHaveAttribute('data-state', 'visible')
      expect(screen.getByTestId('two')).toHaveAttribute('data-state', 'visible')
    })

    it('unsubscribes from the controller on unmount', () => {
      const bar = make()
      const { unmount } = render(<LoadingBar controller={bar} />)
      unmount()
      expect(() =>
        act(() => {
          bar.start('a')
          vi.advanceTimersByTime(SHOW_DELAY)
        })
      ).not.toThrow()
    })
  })

  describe('controlled mode', () => {
    it('renders the given progress and visibility', () => {
      render(<LoadingBar progress={0.4} visible />)
      const el = screen.getByRole('progressbar')
      expect(el).toHaveAttribute('aria-valuenow', '40')
      expect(el).toHaveAttribute('data-state', 'visible')
      expect(fill(el).style.transform).toBe('scaleX(0.4)')
    })

    it('clamps out-of-range values', () => {
      const { rerender } = render(<LoadingBar progress={2} visible />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      rerender(<LoadingBar progress={-1} visible />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })

    it('is visible when only a positive progress is given', () => {
      render(<LoadingBar progress={0.5} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'visible')
    })

    it('is hidden when only progress 0 is given', () => {
      render(<LoadingBar progress={0} />)
      expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('data-state', 'hidden')
    })

    it('can be hidden explicitly', () => {
      render(<LoadingBar progress={0.5} visible={false} />)
      expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('data-state', 'hidden')
    })

    it('shows at 0 when only visible is given', () => {
      render(<LoadingBar visible />)
      const el = screen.getByRole('progressbar')
      expect(el).toHaveAttribute('data-state', 'visible')
      expect(el).toHaveAttribute('aria-valuenow', '0')
    })

    it('ignores the controller', () => {
      const bar = make()
      render(<LoadingBar controller={bar} progress={0.3} visible />)
      act(() => {
        bar.start('a')
        vi.advanceTimersByTime(SHOW_DELAY)
      })
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30')
    })

    it('rounds the reported value', () => {
      render(<LoadingBar progress={0.126} visible />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '13')
    })
  })

  describe('rendering', () => {
    it('applies the base class and the inline modifier', () => {
      const { rerender } = render(<LoadingBar progress={0.1} visible />)
      expect(screen.getByRole('progressbar')).toHaveClass('cn-loading-bar')
      expect(screen.getByRole('progressbar')).not.toHaveClass('cn-loading-bar-inline')
      rerender(<LoadingBar progress={0.1} visible inline />)
      expect(screen.getByRole('progressbar')).toHaveClass('cn-loading-bar', 'cn-loading-bar-inline')
    })

    it('is fixed to the top of the viewport and click-through by default', () => {
      render(<LoadingBar progress={0.1} visible />)
      const el = screen.getByRole('progressbar')
      expect(el).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'pointer-events-none')
      expect(el).not.toHaveClass('absolute')
    })

    it('is absolutely positioned instead of fixed when inline', () => {
      render(<LoadingBar progress={0.1} visible inline />)
      const el = screen.getByRole('progressbar')
      expect(el).toHaveClass('absolute', 'top-0', 'left-0', 'right-0', 'pointer-events-none')
      expect(el).not.toHaveClass('fixed')
    })

    it('lets a consumer className override the default utilities', () => {
      render(<LoadingBar progress={0.1} visible className="top-4" />)
      const el = screen.getByRole('progressbar')
      expect(el).toHaveClass('top-4')
      expect(el).not.toHaveClass('top-0')
    })

    it('merges className and forwards native props', () => {
      render(
        <LoadingBar progress={0.1} visible className="custom" data-testid="bar" id="top" aria-label={CUSTOM_LABEL} />
      )
      const el = screen.getByTestId('bar')
      expect(el).toHaveClass('cn-loading-bar', 'custom')
      expect(el).toHaveAttribute('id', 'top')
      expect(el).toHaveAccessibleName(CUSTOM_LABEL)
    })

    it('forwards the ref to the root element', () => {
      const ref = createRef<HTMLDivElement>()
      render(<LoadingBar ref={ref} progress={0.1} visible />)
      expect(ref.current).toBe(screen.getByRole('progressbar'))
    })

    it('renders the fill and the peg', () => {
      render(<LoadingBar progress={0.1} visible />)
      const el = screen.getByRole('progressbar')
      expect(el.querySelector('.cn-loading-bar-fill .cn-loading-bar-peg')).toBeInTheDocument()
      expect(fill(el)).toHaveClass('absolute', 'inset-0', 'size-full', 'origin-left')
    })

    it('has a display name', () => {
      expect(LoadingBar.displayName).toBe('LoadingBar')
    })
  })
})

describe('loading bar styles', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = (loadingBarStyles as Record<string, any>)['.cn-loading-bar']

  it('leaves position, offsets and pointer events to inline utility classes', () => {
    expect(root.position).toBeUndefined()
    expect(root.top).toBeUndefined()
    expect(root['pointer-events']).toBeUndefined()
    expect(root['&-inline']).toBeUndefined()
  })

  it('uses the brand colour token for the fill', () => {
    expect(root['&-fill']['background-color']).toBe('var(--cn-set-brand-primary-bg)')
  })

  it('never animates the fill while hidden', () => {
    expect(root['&[data-state="hidden"] .cn-loading-bar-fill'].transition).toBe('none')
  })

  it('disables motion for users who prefer reduced motion', () => {
    const reduced = root['@media (prefers-reduced-motion: reduce)']
    expect(reduced.transition).toBe('none')
    expect(reduced['.cn-loading-bar-fill'].transition).toBe('none')
    expect(reduced['.cn-loading-bar-peg'].display).toBe('none')
  })
})
