import { createContext, useCallback, useContext, useRef, useState } from 'react'

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
  canvasTransform: CanvasTransform
  setCanvasTransform: (canvasTransform: CanvasTransform) => void
  fit: () => void
  increase: () => void
  decrease: () => void
  config: CanvasConfig
  setMainRef: (ref: React.MutableRefObject<HTMLDivElement | null>) => void
}

// TODO: canvas provider causes re-render on scale/pane (refactor)
const CanvasContext = createContext<CanvasContextProps>({
  canvasTransform: { scale: 1, translateX: 0, translateY: 0 },
  setCanvasTransform: (_canvasTransform: CanvasTransform) => undefined,
  fit: () => undefined,
  increase: () => undefined,
  decrease: () => undefined,
  config: { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 30 },
  setMainRef: (ref: React.MutableRefObject<HTMLDivElement | null>) => undefined
})

export interface CanvasProviderProps {
  config?: CanvasConfig
  children: React.ReactNode
}

export const CanvasProvider = ({
  children,
  config = { minScale: 0.1, maxScale: 10, scaleFactor: 0.3, paddingForFit: 20 }
}: CanvasProviderProps) => {
  const [canvasTransform, setCanvasTransformInternal] = useState<CanvasTransform>({
    scale: 1,
    translateX: 0,
    translateY: 0
  })

  const mainRefRef = useRef<React.MutableRefObject<HTMLDivElement | null>>()
  const setMainRef = useCallback((ref: React.MutableRefObject<HTMLDivElement | null>) => {
    mainRefRef.current = ref
  }, [])

  const setCanvasTransform = (transform: CanvasTransform) => {
    setCanvasTransformInternal(transform)
    mainRefRef.current?.current?.style.setProperty('--scale', `${transform.scale}`)
    mainRefRef.current?.current?.style.setProperty('--x', `${transform.translateX}px`)
    mainRefRef.current?.current?.style.setProperty('--y', `${transform.translateY}px`)
  }

  const scaleInc = (scaleDiff: number) => {
    const rootContainerEl = mainRefRef?.current?.current
    let newScale = canvasTransform.scale + scaleDiff
    newScale = Math.max(newScale, config.minScale)
    const parentEl = rootContainerEl?.parentElement

    if (!parentEl) return

    const rect = parentEl.getBoundingClientRect()

    let originX = rect.width / 2
    let originY = rect.height / 2

    const currentRect = rootContainerEl.getBoundingClientRect()
    originX -= currentRect.left
    originY -= currentRect.top

    const newTransform = calculateTransform({
      scaleDiff: newScale / canvasTransform.scale,
      originX: originX,
      originY: originY
    })

    setCanvasTransform(newTransform)
  }

  const increase = () => {
    scaleInc(0.2)
  }

  const decrease = () => {
    scaleInc(-0.2)
  }

  const fit = () => {
    const rootContainerEl = mainRefRef.current?.current
    const parentEl = rootContainerEl?.parentElement
    const nodesContainerEl = rootContainerEl?.getElementsByClassName(
      'PipelineGraph-NodesContainer'
    )[0] as HTMLDivElement
    const { width: parentWidth, height: parentHeight } = parentEl?.getBoundingClientRect() ?? new DOMRect()
    const { width: graphWidth, height: graphHeight } = nodesContainerEl?.getBoundingClientRect() ?? new DOMRect()
    let scaleH = ((parentHeight - config.paddingForFit * 2) / graphHeight) * canvasTransform.scale
    let scaleW = ((parentWidth - config.paddingForFit * 2) / graphWidth) * canvasTransform.scale
    scaleH = Math.max(scaleH, 0.095)
    scaleW = Math.max(scaleW, 0.095)
    const translate = {
      scale: 1,
      translateX: config.paddingForFit,
      translateY: config.paddingForFit
    }
    if (scaleW < scaleH) {
      translate.translateY = config.paddingForFit + ((scaleH - scaleW) * graphHeight) / canvasTransform.scale / 2
      translate.scale = scaleW
    } else {
      translate.translateX = config.paddingForFit + ((scaleW - scaleH) * graphWidth) / canvasTransform.scale / 2
      translate.scale = scaleH
    }
    const newScale = scaleW

    setCanvasTransform({
      scale: translate.scale,
      translateX: translate.translateX,
      translateY: translate.translateY
    })
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasTransform,
        setCanvasTransform,
        fit,
        increase,
        decrease,
        config,
        setMainRef
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => {
  return useContext(CanvasContext)
}
