import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resetObservers, triggerResize } from '../../config/test-observers'
import PipelineGraphInternal from '../pipeline-graph-internal'

// Spy on the edge renderer and the context setters so we can assert the layout effect and the
// ResizeObserver safety net both drive the expected graph wiring.
const h = vi.hoisted(() => ({
  drawEdges: vi.fn(),
  setShowSvg: vi.fn(),
  setInitialized: vi.fn(),
  setCanvasTransform: vi.fn(),
  setTargetEl: vi.fn(),
  initialized: false
}))

vi.mock('../render/draw-edges', () => ({ drawEdges: h.drawEdges }))
vi.mock('../render/render-node', () => ({ renderNode: () => null }))

// addPaths is layout maths we don't exercise here — pass the data through unchanged.
vi.mock('../utils/path-utils', () => ({ addPaths: (data: unknown) => data }))

vi.mock('../context/graph-provider', () => ({
  useGraphContext: () => ({
    initialized: h.initialized,
    nodes: {},
    rerenderConnections: 0,
    setInitialized: h.setInitialized,
    isCollapsed: () => false,
    setShowSvg: h.setShowSvg
  })
}))

vi.mock('../context/canvas-provider', () => ({
  useCanvasContext: () => ({
    setCanvasTransform: h.setCanvasTransform,
    canvasTransformRef: { current: { scale: 1, translateX: 0, translateY: 0 } },
    config: {},
    setTargetEl: h.setTargetEl
  })
}))

vi.mock('../context/container-node-provider', () => ({
  useContainerNodeContext: () => ({
    serialContainerConfig: { nodeGap: 0 }
  })
}))

const data = [{ type: 'Step', path: 'pipeline.children.0', containerType: 'leaf' }]

const renderGraph = (props: Record<string, unknown> = {}) =>
  render(<PipelineGraphInternal data={data as never} {...props} />)

describe('PipelineGraphInternal', () => {
  beforeEach(() => {
    h.drawEdges.mockClear()
    h.setShowSvg.mockClear()
    h.setInitialized.mockClear()
    h.setCanvasTransform.mockClear()
    h.setTargetEl.mockClear()
    h.initialized = false
  })

  afterEach(() => {
    resetObservers()
    vi.restoreAllMocks()
  })

  describe('layout effect', () => {
    // jsdom reports zero-size rects, so the layout effect bails before sizing. Give the nodes
    // container a real size so the initialize + canvas-transform path runs.
    const giveLayoutSize = () =>
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 200,
        height: 100,
        top: 0,
        left: 0,
        right: 200,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect)

    it('draws edges, initializes, and sets the initial transform under the center layout', () => {
      giveLayoutSize()
      renderGraph({ layout: { type: 'center' } })

      expect(h.drawEdges).toHaveBeenCalled()
      expect(h.setInitialized).toHaveBeenCalled()
      expect(h.setCanvasTransform).toHaveBeenCalledWith(expect.objectContaining({ isInitial: true }))
      expect(h.setTargetEl).toHaveBeenCalled()
    })

    it('initializes under the harness layout, top aligned', () => {
      giveLayoutSize()
      renderGraph({ layout: { type: 'harness', leafPortPosition: 10 }, config: { align: 'top' } })

      expect(h.setCanvasTransform).toHaveBeenCalledWith(expect.objectContaining({ isInitial: true }))
    })

    it('initializes under the harness layout, center aligned', () => {
      giveLayoutSize()
      renderGraph({ layout: { type: 'harness', leafPortPosition: 10 }, config: { align: 'center' } })

      expect(h.setCanvasTransform).toHaveBeenCalledWith(expect.objectContaining({ isInitial: true }))
    })
  })

  describe('ResizeObserver edge-render safety net', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.runOnlyPendingTimers()
      vi.useRealTimers()
    })

    it('redraws edges and reveals the SVG after the layout settles', () => {
      renderGraph()

      // Ignore the mount-time draw from the layout effect; only the settle redraw matters here.
      h.drawEdges.mockClear()

      triggerResize()
      expect(h.drawEdges).not.toHaveBeenCalled() // debounced — nothing until the settle window elapses
      expect(h.setShowSvg).not.toHaveBeenCalled()

      vi.advanceTimersByTime(150)

      expect(h.drawEdges).toHaveBeenCalledTimes(1)
      expect(h.setShowSvg).toHaveBeenCalledWith(true)
    })

    it('debounces a burst of resizes into a single redraw', () => {
      renderGraph()
      h.drawEdges.mockClear()

      triggerResize()
      vi.advanceTimersByTime(100)
      triggerResize() // resets the settle timer before it fires
      vi.advanceTimersByTime(100)
      expect(h.drawEdges).not.toHaveBeenCalled() // 100ms since the last resize — still within the window

      vi.advanceTimersByTime(50)

      expect(h.drawEdges).toHaveBeenCalledTimes(1)
      expect(h.setShowSvg).toHaveBeenCalledTimes(1)
    })
  })
})
