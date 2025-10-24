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
  setCanvasTransform: (
    canvasTransform: CanvasTransform & { rootContainer?: HTMLDivElement; isInitial?: boolean }
  ) => void
  fit: () => void
  reset: () => void
  increase: () => void
  decrease: () => void
  config: CanvasConfig
}

const CanvasContext = createContext<CanvasContextProps>({
  canvasTransformRef: { current: { scale: 1, translateX: 0, translateY: 0 } },
  setTargetEl: (el: HTMLElement) => undefined,
  setCanvasTransform: (_canvasTransform: CanvasTransform) => undefined,
  fit: () => undefined,
  reset: () => undefined,
  increase: () => undefined,
  decrease: () => undefined,
  config: { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 30 }
})

export interface CanvasProviderProps {
  config?: Partial<CanvasConfig>
  children: React.ReactNode
}

export const CanvasProvider = ({ children, config: configFromProps }: CanvasProviderProps) => {
  const config = { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 20, ...configFromProps }

  const canvasTransformRef = useRef<CanvasTransform>({ scale: 1, translateX: 0, translateY: 0 })
  const targetElRef = useRef<HTMLElement>()
  const initialTransformRef = useRef<CanvasTransform>({ scale: 1, translateX: 0, translateY: 0 })

  const setCanvasTransform = useCallback(
    (transform: CanvasTransform & { rootContainer?: HTMLDivElement; isInitial?: boolean }) => {
      canvasTransformRef.current = transform

      const el = targetElRef.current ?? transform.rootContainer
      el?.style.setProperty('--scale', `${transform.scale}`)
      el?.style.setProperty('--x', `${transform.translateX}px`)
      el?.style.setProperty('--y', `${transform.translateY}px`)

      if (transform.isInitial) {
        initialTransformRef.current = {
          scale: transform.scale,
          translateX: transform.translateX,
          translateY: transform.translateY
        }
      }
    },
    []
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

    let originX = centerX - targetElRect.left
    let originY = centerY - targetElRect.top

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
    scaleInc(0.2)
  }, [scaleInc])

  const decrease = useCallback(() => {
    scaleInc(-0.2)
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

    if (!parentEl || !nodesContainerEl) return

    const { width: parentWidth, height: parentHeight } = parentEl.getBoundingClientRect()
    const { width: graphWidth, height: graphHeight } = nodesContainerEl.getBoundingClientRect()

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
        reset,
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
