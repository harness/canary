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
        }) =>
          React.createElement(
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
      expect(h.setShowSvg).toHaveBeenCalledWith(false)
      expect(h.collapse).toHaveBeenCalledWith(PATH, false)
    })

    it('animates on a programmatic expand (execution auto-open: collapsed prop flips true→false)', () => {
      h.collapsedMap = { [PATH]: true }
      const { rerender } = renderContainer()

      // Execution advances → the collapsed map opens this node.
      h.collapsedMap = { [PATH]: false }
      rerender(
        <SerialNodeContainer node={makeNode() as never} level={0} relativeIndex={0} parentNode={undefined as never} isFirst isLast parentNodeType="serial" mode="Edit" />
      )

      expect(initialOf()).toBe('"hidden"')
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
