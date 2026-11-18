import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PipelineGraphNested } from '../pipeline-graph-nested'

// Expose framer-motion's `initial` prop as an attribute so we can assert whether the mount animation
// would play (`"hidden"` = grow/stagger in, `false` = render straight to target), pass the `style`
// through so we can read the overflow clip, and surface the animation + presence callbacks as buttons
// so we can drive onAnimationStart / onAnimationComplete / onExitComplete.
vi.mock('framer-motion', async () => {
  const React = await import('react')
  // forwardRef so the component's `ref={nodesContainerRef}` resolves to the real DOM node — the nested
  // graph's redraw bails unless that ref is set, so without this the edge draw never runs.
  const MockMotion = React.forwardRef(
    (
      {
        children,
        initial,
        style,
        onAnimationStart,
        onAnimationComplete
      }: {
        children?: ReactNode
        initial?: unknown
        style?: Record<string, unknown>
        onAnimationStart?: () => void
        onAnimationComplete?: () => void
      },
      ref: React.Ref<HTMLDivElement>
    ) =>
      React.createElement(
        'div',
        { 'data-testid': 'motion-body', 'data-initial': JSON.stringify(initial ?? null), style, ref },
        React.createElement('button', { 'data-testid': 'anim-start', onClick: () => onAnimationStart?.() }),
        React.createElement('button', { 'data-testid': 'anim-complete', onClick: () => onAnimationComplete?.() }),
        children
      )
  )
  MockMotion.displayName = 'MockMotion'
  const motion = new Proxy({}, { get: () => MockMotion })
  return {
    motion,
    // Passthrough presence, plus a button to fire onExitComplete so we can assert it is wired through.
    AnimatePresence: ({ children, onExitComplete }: { children?: ReactNode; onExitComplete?: () => void }) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement('button', { 'data-testid': 'fire-exit-complete', onClick: () => onExitComplete?.() }),
        children
      )
  }
})

const h = vi.hoisted(() => ({ drawEdges: vi.fn() }))

vi.mock('../render/draw-edges', () => ({ drawEdges: h.drawEdges }))
vi.mock('../render/render-node', () => ({ renderNode: () => null }))
// addPaths is layout maths we don't exercise here — pass the data through unchanged.
vi.mock('../utils/path-utils', () => ({ addPaths: (data: unknown) => data }))

const data = [{ type: 'Step', path: 'nested.children.0', containerType: 'leaf' }]

const renderNested = (props: Record<string, unknown> = {}) =>
  render(<PipelineGraphNested data={data as never} nodes={[]} {...props} />)

const svgEl = () => document.querySelector('.PipelineGraph-Svg') as SVGElement
const bodyStyle = () => screen.getByTestId('motion-body').style

describe('PipelineGraphNested', () => {
  beforeEach(() => {
    h.drawEdges.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('mount animation gate', () => {
    it('renders the row straight to its target (no mount animation) by default', () => {
      renderNested()

      // `false` = framer renders straight to visible, no grow/stagger on mount.
      expect(screen.getByTestId('motion-body').getAttribute('data-initial')).toBe('false')
      // At rest the SVG is shown and overflow is visible so ports/add-buttons at the edge aren't clipped.
      expect(svgEl().style.opacity).toBe('1')
      expect(bodyStyle().overflow).toBe('visible')
    })

    it('animates the row open on mount when animateOnMount is set', () => {
      renderNested({ animateOnMount: true })

      expect(screen.getByTestId('motion-body').getAttribute('data-initial')).toBe('"hidden"')
    })
  })

  describe('animation lifecycle', () => {
    it('hides the edges and clips overflow while animating, then reveals + redraws on complete', () => {
      const onResize = vi.fn()
      renderNested({ onResize })

      // The mount layout effect already drew once; isolate the on-complete redraw.
      h.drawEdges.mockClear()
      onResize.mockClear()

      fireEvent.click(screen.getByTestId('anim-start'))
      // While animating: edges hidden and the box clips so its width tracks the grow/shrink.
      expect(svgEl().style.opacity).toBe('0')
      expect(bodyStyle().overflow).toBe('hidden')

      fireEvent.click(screen.getByTestId('anim-complete'))
      // On complete: edges revealed, overflow restored, and the sub-graph redraws + bubbles onResize.
      expect(svgEl().style.opacity).toBe('1')
      expect(bodyStyle().overflow).toBe('visible')
      expect(h.drawEdges).toHaveBeenCalled()
      expect(onResize).toHaveBeenCalled()
    })
  })

  describe('open toggle and presence', () => {
    it('unmounts the row when open is false and wires onExitComplete to the presence boundary', () => {
      const onExitComplete = vi.fn()
      renderNested({ open: false, onExitComplete })

      // open=false → the node row is not rendered (it animates out via the local AnimatePresence).
      expect(screen.queryByTestId('motion-body')).toBeNull()

      // onExitComplete must be wired to the AnimatePresence so the host can scroll the card back.
      fireEvent.click(screen.getByTestId('fire-exit-complete'))
      expect(onExitComplete).toHaveBeenCalled()
    })
  })
})
