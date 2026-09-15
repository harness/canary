import { createContext, useCallback, useContext, useRef } from 'react'

import { calculateTransform } from '../components/canvas/canvas-utils'
import { useDebouncedState } from '../hooks/useDebouncedState'
import { getGraphContentRect } from '../utils/graph-position-utils'
import { useMultiCanvasContext } from './multi-canvas-provider'

interface CanvasConfig {
  minScale: number
  maxScale: number
  scaleFactor: number
  paddingForFit: number
  disableScroll: boolean
}

interface CanvasTransform {
  scale: number
  translateX: number
  translateY: number
}

interface CanvasContextProps {
  canvasTransformRef: React.MutableRefObject<CanvasTransform>
  setTargetEl: (el: HTMLDivElement) => void
  setCanvasTransform: (
    canvasTransform: CanvasTransform & { rootContainer?: HTMLDivElement; isInitial?: boolean }
  ) => void
  fit: () => void
  reset: () => void
  increase: () => void
  decrease: () => void
  config: CanvasConfig
  scale: number
}

const CanvasContext = createContext<CanvasContextProps>({
  canvasTransformRef: { current: { scale: 1, translateX: 0, translateY: 0 } },
  setTargetEl: (_el: HTMLElement) => undefined,
  setCanvasTransform: (_canvasTransform: CanvasTransform) => undefined,
  fit: () => undefined,
  reset: () => undefined,
  increase: () => undefined,
  decrease: () => undefined,
  config: { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 30, disableScroll: false },
  scale: 1
})

export interface CanvasProviderProps {
  id?: string
  config?: Partial<CanvasConfig>
  children: React.ReactNode
}

export const CanvasProvider = ({ children, config: configFromProps, id = '' }: CanvasProviderProps) => {
  const config = {
    minScale: 0.1,
    maxScale: 10,
    scaleFactor: 0.3,
    paddingForFit: 20,
    disableScroll: false,
    ...configFromProps
  }

  const canvasTransformRef = useRef<CanvasTransform>({ scale: 1, translateX: 0, translateY: 0 })
  const targetElRef = useRef<HTMLElement>()
  const initialTransformRef = useRef<CanvasTransform>({ scale: 1, translateX: 0, translateY: 0 })

  const { getCanvasTransformRef, setCanvasTransformRef } = useMultiCanvasContext()
  const [scale, setScaleDebounced] = useDebouncedState(1, 100)

  const setCanvasTransform = useCallback(
    (transform: CanvasTransform & { rootContainer?: HTMLDivElement; isInitial?: boolean }) => {
      canvasTransformRef.current = transform

      if (transform.isInitial) {
        initialTransformRef.current = {
          scale: transform.scale,
          translateX: transform.translateX,
          translateY: transform.translateY
        }

        // set canvas transform from global state
        const currTransform = getCanvasTransformRef(id)?.current
        if (currTransform) {
          canvasTransformRef.current = { ...currTransform }
        }
      }

      setCanvasTransformRef(id, canvasTransformRef)
      setScaleDebounced(canvasTransformRef.current.scale)

      const el = targetElRef.current ?? transform.rootContainer
      el?.style.setProperty('--scale', `${canvasTransformRef.current.scale}`)
      el?.style.setProperty('--x', `${canvasTransformRef.current.translateX}px`)
      el?.style.setProperty('--y', `${canvasTransformRef.current.translateY}px`)
    },
    [setCanvasTransformRef, id, setScaleDebounced, getCanvasTransformRef]
  )

  const setTargetEl = useCallback((targetEl: HTMLElement) => {
    targetElRef.current = targetEl
  }, [])

  const scaleInc = useCallback((scaleIncValue: number) => {
    const targetEl = targetElRef?.current
    const parentEl = targetEl?.parentElement

    if (!targetEl || !parentEl) return

    let newScale = canvasTransformRef.current.scale + scaleIncValue
    newScale = Math.max(newScale, config.minScale)
    newScale = Math.min(newScale, config.maxScale)

    const scaleDiff = newScale / canvasTransformRef.current.scale

    const parentElRect = parentEl.getBoundingClientRect()
    const targetElRect = targetEl.getBoundingClientRect()

    const centerX = parentElRect.left + parentElRect.width / 2
    const centerY = parentElRect.top + parentElRect.height / 2

    const originX = centerX - targetElRect.left
    const originY = centerY - targetElRect.top

    const newTransform = calculateTransform({
      scaleDiff,
      originX,
      originY,
      currentScale: canvasTransformRef.current.scale,
      currentTranslateX: canvasTransformRef.current.translateX,
      currentTranslateY: canvasTransformRef.current.translateY
    })

    setCanvasTransform(newTransform)
  }, [])

  const increase = useCallback(() => {
    scaleInc(0.25)
  }, [scaleInc])

  const decrease = useCallback(() => {
    scaleInc(-0.25)
  }, [scaleInc])

  const reset = useCallback(() => {
    setCanvasTransform({
      scale: initialTransformRef.current.scale,
      translateX: initialTransformRef.current.translateX,
      translateY: initialTransformRef.current.translateY
    })
  }, [setCanvasTransform])

  const fit = useCallback(() => {
    const targetEl = targetElRef?.current
    const parentEl = targetEl?.parentElement
    const nodesContainerEl = targetEl?.getElementsByClassName('PipelineGraph-NodesContainer')[0] as
      | HTMLDivElement
      | undefined

    if (!targetEl || !parentEl || !nodesContainerEl) return

    const { width: parentWidth, height: parentHeight } = parentEl.getBoundingClientRect()
    const targetElRect = targetEl.getBoundingClientRect()
    const contentRect = getGraphContentRect(nodesContainerEl)

    const currentScale = canvasTransformRef.current.scale

    // graph size and its offset within the target element, at scale 1
    const graphWidth = contentRect.width / currentScale
    const graphHeight = contentRect.height / currentScale
    const offsetX = (contentRect.left - targetElRect.left) / currentScale
    const offsetY = (contentRect.top - targetElRect.top) / currentScale

    if (!graphWidth || !graphHeight) return

    let scale = Math.min(
      (parentWidth - config.paddingForFit * 2) / graphWidth,
      (parentHeight - config.paddingForFit * 2) / graphHeight
    )
    scale = Math.min(Math.max(scale, config.minScale), config.maxScale)

    // center the graph on both axes - when it cannot fully fit (scale clamped
    // to minScale) the overflow is spread evenly, keeping the graph centered
    setCanvasTransform({
      scale,
      translateX: (parentWidth - graphWidth * scale) / 2 - offsetX * scale,
      translateY: (parentHeight - graphHeight * scale) / 2 - offsetY * scale
    })
  }, [])

  return (
    <CanvasContext.Provider
      value={{
        canvasTransformRef,
        setTargetEl,
        setCanvasTransform,
        fit,
        reset,
        increase,
        decrease,
        config,
        scale
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => {
  return useContext(CanvasContext)
}
