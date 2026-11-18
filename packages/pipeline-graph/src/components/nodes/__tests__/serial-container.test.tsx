import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import SerialNodeContainer from '../serial-container'

// Expose framer-motion's `initial` prop as an attribute so we can assert whether the enter
// animation would play (`"hidden"` = animate open, `false` = render straight to target), and expose
// the animation lifecycle callbacks as buttons so we can drive `handleAnimationComplete`.
vi.mock('framer-motion', async () => {
  const React = await import('react')
  const motion = new Proxy(
    {},
    {
      get:
        () =>
        ({
          children,
          initial,
          onAnimationStart,
          onAnimationComplete
        }: {
          children?: ReactNode
          initial?: unknown
          onAnimationStart?: () => void
          onAnimationComplete?: (type: string) => void
        }) => {
          // The container ROOT is now a motion.div too (stagger participation), but only the
          // children-wrapping body is wired with the animation lifecycle callbacks. Tag just the body
          // as `motion` (and give it the lifecycle buttons) so the assertions keep targeting it; the
          // root renders as a plain passthrough.
          const isAnimatingBody = Boolean(onAnimationComplete)
          if (!isAnimatingBody) {
            return React.createElement(
              'div',
              { 'data-testid': 'motion-root', 'data-initial': JSON.stringify(initial ?? null) },
              children
            )
          }
          return React.createElement(
            'div',
            { 'data-testid': 'motion', 'data-initial': JSON.stringify(initial ?? null) },
            React.createElement('button', { 'data-testid': 'anim-start', onClick: () => onAnimationStart?.() }),
            React.createElement('button', {
              'data-testid': 'anim-complete-visible',
              onClick: () => onAnimationComplete?.('visible')
            }),
            React.createElement('button', {
              'data-testid': 'anim-complete-exit',
              onClick: () => onAnimationComplete?.('exit')
            }),
            children
          )
        }
    }
  )
  return {
    motion,
    AnimatePresence: ({ children }: { children?: ReactNode }) => React.createElement(React.Fragment, null, children)
  }
})

// Render the children and expose the collapse toggle the library wires to the card button.
vi.mock('../../../render/render-node-content', async () => {
  const React = await import('react')
  return {
    RenderNodeContent: ({
      children,
      setCollapsed
    }: {
      children?: ReactNode
      setCollapsed?: (c: boolean) => void
    }) =>
      React.createElement(
        'div',
        null,
        React.createElement('button', { 'data-testid': 'expand', onClick: () => setCollapsed?.(false) }),
        React.createElement('button', { 'data-testid': 'collapse', onClick: () => setCollapsed?.(true) }),
        children
      )
  }
})

vi.mock('../../../render/render-node', () => ({ renderNode: () => null }))
vi.mock('../port', () => ({ default: () => null }))

const h = vi.hoisted(() => ({
  collapsedMap: {} as Record<string, boolean>,
  collapse: vi.fn(),
  setShowSvg: vi.fn(),
  rerender: vi.fn(),
  isMounted: { current: false },
  pendingRevealRef: { current: 0 },
  layout: { type: 'center' } as Record<string, unknown>,
  portComponent: undefined as unknown
}))

vi.mock('../../../context/graph-provider', () => ({
  useGraphContext: () => ({
    // New arrow each render so the container's `collapsed` useMemo recomputes when the map flips.
    isCollapsed: (path: string) => !!h.collapsedMap[path],
    collapse: h.collapse,
    setShowSvg: h.setShowSvg,
    rerender: h.rerender,
    isMounted: h.isMounted,
    pendingRevealRef: h.pendingRevealRef,
    nodes: {}
  })
}))

vi.mock('../../../context/container-node-provider', () => ({
  useContainerNodeContext: () => ({
    serialContainerConfig: { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, nodeGap: 0, serialGroupAdjustment: 0 },
    parallelContainerConfig: { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, nodeGap: 0, parallelGroupAdjustment: 0 },
    portComponent: h.portComponent,
    layout: h.layout
  })
}))

const PATH = 'pipeline.children.0'

// A serial container node with one leaf child (enough for the expand animation to have content).
const makeNode = (config?: Record<string, unknown>, children = [{ containerType: 'leaf', type: 'Step', path: `${PATH}.children.0` }]) => ({
  type: 'SerialStepGroup',
  path: PATH,
  containerType: 'serial',
  config,
  children
})

const renderContainer = (node: ReturnType<typeof makeNode> = makeNode()) =>
  // Props are cast — the test only drives collapse/animation/layout behaviour, not production typing.
  render(
    <SerialNodeContainer node={node as never} level={0} relativeIndex={0} parentNode={undefined as never} isFirst isLast parentNodeType="serial" mode="Edit" />
  )

const initialOf = () => screen.getByTestId('motion').getAttribute('data-initial')

describe('SerialNodeContainer', () => {
  beforeEach(() => {
    h.collapsedMap = {}
    h.collapse.mockClear()
    h.setShowSvg.mockClear()
    h.rerender.mockClear()
    h.isMounted = { current: false }
    h.pendingRevealRef = { current: 0 }
    h.layout = { type: 'center' }
    h.portComponent = undefined
  })

  describe('enter-animation gate', () => {
    it('does not animate when it mounts already-expanded (fresh mount / remount after index shift)', () => {
      h.collapsedMap = { [PATH]: false }
      renderContainer()

      // `false` = framer renders straight to the open state, no enter animation replay.
      expect(initialOf()).toBe('false')
    })

    it('does not render the animated body when it mounts collapsed', () => {
      h.collapsedMap = { [PATH]: true }
      renderContainer()

      expect(screen.queryByTestId('motion')).toBeNull()
    })

    it('does not render the animated body when the node has no children', () => {
      h.collapsedMap = { [PATH]: false }
      renderContainer(makeNode(undefined, []))

      expect(screen.queryByTestId('motion')).toBeNull()
    })

    it('animates on a user expand toggle and syncs the global collapse state', () => {
      h.collapsedMap = { [PATH]: true }
      renderContainer()

      fireEvent.click(screen.getByTestId('expand'))

      expect(initialOf()).toBe('"hidden"')
      // Expanding must NOT hide the edges at click — the children may load asynchronously, and hiding
      // now would blank the connectors through that gap. The current (collapsed-layout) edges stay
      // until the expand animation starts; onAnimationStart hides them right before the layout changes.
      expect(h.setShowSvg).not.toHaveBeenCalledWith(false)
      expect(h.collapse).toHaveBeenCalledWith(PATH, false)
    })

    it('snaps open without animating when the collapsed prop flips true→false (slot reuse after a delete/insert)', () => {
      // A programmatic expand is never a live transition on this instance: nodes are keyed by their
      // index path, so a delete/insert reuses this (collapsed) instance for a different, already-open
      // node. It must appear open immediately, not replay an enter animation. Only user toggles animate.
      h.collapsedMap = { [PATH]: true }
      const { rerender } = renderContainer()

      h.collapsedMap = { [PATH]: false }
      rerender(
        <SerialNodeContainer node={makeNode() as never} level={0} relativeIndex={0} parentNode={undefined as never} isFirst isLast parentNodeType="serial" mode="Edit" />
      )

      // `false` = render straight to open, no enter animation.
      expect(initialOf()).toBe('false')
      // Programmatic expand has no framer animation (no onAnimationStart), so the sync effect must
      // hide the SVG itself; the ResizeObserver safety net re-reveals it once the layout settles.
      // Otherwise edges draw at preliminary positions before the children settle (lines before nodes).
      expect(h.setShowSvg).toHaveBeenCalledWith(false)
    })
  })

  describe('programmatic collapse (collapsed prop is the source of truth)', () => {
    it('snaps the body closed when the collapsed prop flips false→true without a remount', () => {
      // Repro of the delete-before-a-collapsed-sibling bug: nodes are keyed by index path, so deleting
      // an earlier sibling reuses this (open) instance to render a node the prop now says is collapsed.
      // The instance does not remount, so only the prop change can close it.
      h.collapsedMap = { [PATH]: false }
      const { rerender } = renderContainer()
      expect(screen.queryByTestId('motion')).not.toBeNull()

      h.collapsedMap = { [PATH]: true }
      rerender(
        <SerialNodeContainer node={makeNode() as never} level={0} relativeIndex={0} parentNode={undefined as never} isFirst isLast parentNodeType="serial" mode="Edit" />
      )

      expect(screen.queryByTestId('motion')).toBeNull()
    })

    it('does not replay an animation when a prop change reopens a reused instance that a prior toggle left animate-flagged', () => {
      // Regression: a user collapse toggle sets the instance's internal animate flag true and it is
      // never reset. When a delete/insert then reuses this collapsed instance for a different,
      // already-open node (collapsed prop flips true→false), the body must snap open — the stale flag
      // must not make it replay an enter animation.
      h.collapsedMap = { [PATH]: true }
      const { rerender } = renderContainer()
      // Prior user collapse toggle on this instance → leaves the animate flag set.
      fireEvent.click(screen.getByTestId('collapse'))

      // Delete/insert reuses this instance for an expanded node.
      h.collapsedMap = { [PATH]: false }
      rerender(
        <SerialNodeContainer node={makeNode() as never} level={0} relativeIndex={0} parentNode={undefined as never} isFirst isLast parentNodeType="serial" mode="Edit" />
      )

      expect(initialOf()).toBe('false')
    })
  })

  describe('collapse toggle', () => {
    it('hides the SVG and unmounts the body on a user collapse toggle', () => {
      h.collapsedMap = { [PATH]: false }
      renderContainer()

      fireEvent.click(screen.getByTestId('collapse'))

      expect(h.setShowSvg).toHaveBeenCalledWith(false)
      expect(screen.queryByTestId('motion')).toBeNull()
      // Collapse does not push state until the exit animation completes, so no collapse(true) yet.
      expect(h.collapse).not.toHaveBeenCalledWith(PATH, true)
    })
  })

  describe('animation lifecycle', () => {
    it('hides the SVG when the animation starts (right before the layout changes)', () => {
      h.collapsedMap = { [PATH]: false }
      renderContainer()

      fireEvent.click(screen.getByTestId('anim-start'))

      expect(h.setShowSvg).toHaveBeenCalledWith(false)
    })
  })

  describe('animation-complete handling', () => {
    it('re-reveals the SVG and rerenders connections when the enter animation completes', () => {
      h.collapsedMap = { [PATH]: false }
      renderContainer()

      fireEvent.click(screen.getByTestId('anim-complete-visible'))

      expect(h.rerender).toHaveBeenCalled()
      expect(h.setShowSvg).toHaveBeenCalledWith(true)
      expect(h.isMounted.current).toBe(true)
      // 'visible' is not an exit, so it must not commit a collapsed state.
      expect(h.collapse).not.toHaveBeenCalledWith(PATH, true)
    })

    it('commits the collapsed state when the exit animation completes', () => {
      h.collapsedMap = { [PATH]: false }
      renderContainer()

      fireEvent.click(screen.getByTestId('anim-complete-exit'))

      expect(h.collapse).toHaveBeenCalledWith(PATH, true)
      expect(h.setShowSvg).toHaveBeenCalledWith(true)
    })
  })

  describe('pending-reveal counter', () => {
    it('adds only its own contribution to the shared counter (expand +1, animation start -1, no double-decrement)', () => {
      h.collapsedMap = { [PATH]: true }
      renderContainer()

      // User expand marks a reveal pending on the shared counter so the ResizeObserver settle can't
      // paint edges during the async child-load gap.
      fireEvent.click(screen.getByTestId('expand'))
      expect(h.pendingRevealRef.current).toBe(1)

      // The animation starting clears exactly this instance's contribution.
      fireEvent.click(screen.getByTestId('anim-start'))
      expect(h.pendingRevealRef.current).toBe(0)

      // A later onAnimationComplete clears again, but this instance no longer holds a contribution, so
      // it must NOT drive the shared counter negative (which would wrongly reveal a sibling's edges).
      fireEvent.click(screen.getByTestId('anim-complete-visible'))
      expect(h.pendingRevealRef.current).toBe(0)
    })
  })

  describe('layout and ports', () => {
    it('renders under the harness layout when expanded', () => {
      h.collapsedMap = { [PATH]: false }
      h.layout = { type: 'harness', getHeaderHeight: () => 20, leafPortPosition: 10, collapsedPortPositionPerType: {} }
      renderContainer()

      expect(screen.queryByTestId('motion')).not.toBeNull()
    })

    it('renders under the harness layout when collapsed (collapsed port adjustment branch)', () => {
      h.collapsedMap = { [PATH]: true }
      h.layout = { type: 'harness', getHeaderHeight: () => 20, collapsedPortPositionPerType: { SerialStepGroup: 5 } }
      renderContainer()

      expect(screen.queryByTestId('motion')).toBeNull()
    })

    it('renders custom port components when portComponent is a function', () => {
      const React = require('react')
      h.collapsedMap = { [PATH]: false }
      // portComponent is curried: portComponent(portProps) returns the render fn ({ side }) => node.
      h.portComponent = () => ({ side }: { side: string }) =>
        React.createElement('div', { 'data-testid': `custom-port-${side}` })
      renderContainer()

      expect(screen.queryByTestId('custom-port-left')).not.toBeNull()
      expect(screen.queryByTestId('custom-port-right')).not.toBeNull()
    })

    it('omits the ports when the node config hides them', () => {
      const React = require('react')
      h.collapsedMap = { [PATH]: false }
      h.portComponent = () => ({ side }: { side: string }) =>
        React.createElement('div', { 'data-testid': `custom-port-${side}` })
      renderContainer(makeNode({ hideLeftPort: true, hideRightPort: true, minWidth: 100, minHeight: 50 }))

      expect(screen.queryByTestId('custom-port-left')).toBeNull()
      expect(screen.queryByTestId('custom-port-right')).toBeNull()
    })
  })
})
