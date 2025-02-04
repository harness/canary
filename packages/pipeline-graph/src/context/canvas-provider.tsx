import { createContext, useCallback, useContext, useRef } from 'react'

import { calculateTransform } from '../components/canvas/canvas-utils'

interface CanvasConfig {
  minScale: number
  maxScale: number
  scaleFactor: number
  paddingForFit: number
}

interface CanvasTransform {
  scale: number
  translateX: number
  translateY: number
}

interface CanvasContextProps {
  canvasTransformRef: React.MutableRefObject<CanvasTransform>
  setTargetEl: (el: HTMLDivElement) => void
  setCanvasTransform: (canvasTransform: CanvasTransform & { rootContainer?: HTMLDivElement }) => void
  fit: () => void
  increase: () => void
  decrease: () => void
  config: CanvasConfig
}

const CanvasContext = createContext<CanvasContextProps>({
  canvasTransformRef: { current: { scale: 1, translateX: 0, translateY: 0 } },
  setTargetEl: (el: HTMLElement) => undefined,
  setCanvasTransform: (_canvasTransform: CanvasTransform) => undefined,
  fit: () => undefined,
  increase: () => undefined,
  decrease: () => undefined,
  config: { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 30 }
})

export interface CanvasProviderProps {
  config?: CanvasConfig
  children: React.ReactNode
}

export const CanvasProvider = ({
  children,
  config = { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 20 }
}: CanvasProviderProps) => {
  const canvasTransformRef = useRef<CanvasTransform>({ scale: 1, translateX: 0, translateY: 0 })
  const targetElRef = useRef<HTMLElement>()

  const setCanvasTransform = useCallback((transform: CanvasTransform & { rootContainer?: HTMLDivElement }) => {
    canvasTransformRef.current = transform

    const el = targetElRef.current ?? transform.rootContainer
    el?.style.setProperty('--scale', `${transform.scale}`)
    el?.style.setProperty('--x', `${transform.translateX}px`)
    el?.style.setProperty('--y', `${transform.translateY}px`)
  }, [])

  const setTargetEl = useCallback((targetEl: HTMLElement) => {
    targetElRef.current = targetEl
  }, [])

  const scaleInc = useCallback((scaleDiff: number) => {
    const rootContainerEl = targetElRef?.current
    const parentEl = rootContainerEl?.parentElement

    if (!rootContainerEl || !parentEl) return

    let newScale = canvasTransformRef.current.scale + scaleDiff
    newScale = Math.max(newScale, config.minScale)

    const rect = parentEl.getBoundingClientRect()

    let originX = rect.width / 2
    let originY = rect.height / 2

    const currentRect = rootContainerEl.getBoundingClientRect()
    originX -= currentRect.left
    originY -= currentRect.top

    const newTransform = calculateTransform({
      scaleDiff: newScale / canvasTransformRef.current.scale,
      originX: originX,
      originY: originY
    })

    setCanvasTransform(newTransform)
  }, [])

  const increase = useCallback(() => {
    scaleInc(0.2)
  }, [scaleInc])

  const decrease = useCallback(() => {
    scaleInc(-0.2)
  }, [scaleInc])

  const fit = useCallback(() => {
    const rootContainerEl = targetElRef?.current
    const parentEl = rootContainerEl?.parentElement
    const nodesContainerEl = rootContainerEl?.getElementsByClassName(
      'PipelineGraph-NodesContainer'
    )[0] as HTMLDivElement
    const { width: parentWidth, height: parentHeight } = parentEl?.getBoundingClientRect() ?? new DOMRect()
    const { width: graphWidth, height: graphHeight } = nodesContainerEl?.getBoundingClientRect() ?? new DOMRect()

    let scaleH = ((parentHeight - config.paddingForFit * 2) / graphHeight) * canvasTransformRef.current.scale
    let scaleW = ((parentWidth - config.paddingForFit * 2) / graphWidth) * canvasTransformRef.current.scale

    scaleH = Math.max(scaleH, config.minScale)
    scaleW = Math.max(scaleW, config.minScale)

    const translate = {
      scale: 1,
      translateX: config.paddingForFit,
      translateY: config.paddingForFit
    }

    if (scaleW < scaleH) {
      translate.translateY =
        config.paddingForFit + ((scaleH - scaleW) * graphHeight) / canvasTransformRef.current.scale / 2
      translate.scale = scaleW
    } else {
      translate.translateX =
        config.paddingForFit + ((scaleW - scaleH) * graphWidth) / canvasTransformRef.current.scale / 2
      translate.scale = scaleH
    }

    setCanvasTransform({
      scale: translate.scale,
      translateX: translate.translateX,
      translateY: translate.translateY
    })
  }, [])

  return (
    <CanvasContext.Provider
      value={{
        canvasTransformRef,
        setTargetEl,
        setCanvasTransform,
        fit,
        increase,
        decrease,
        config
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => {
  return useContext(CanvasContext)
}
