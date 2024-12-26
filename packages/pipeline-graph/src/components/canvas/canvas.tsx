import React, { useEffect, useRef } from 'react'

import { useCanvasContext } from '../../context/canvas-provider'
import { calculateTransform, MousePoint } from './canvas-utils'

import './canvas.css'

export function Canvas({ children }: React.PropsWithChildren) {
  const { setCanvasTransform, canvasTransformRef, config } = useCanvasContext()

  const mainRef = useRef<HTMLDivElement | null>(null)

  // handle zoom-to-pinch (wheel)
  useEffect(() => {
    if (mainRef.current) {
      const handler = (event: WheelEvent) => {
        const targetEl = mainRef.current?.children[0] as HTMLDivElement | undefined

        if (!targetEl || !mainRef.current) return

        event.preventDefault()

        if (!event.ctrlKey) {
          const newTransform = calculateTransform({
            scaleDiff: 1,
            originX: event.deltaX,
            originY: event.deltaY,
            panX: -event.deltaX,
            panY: -event.deltaY,
            currentScale: canvasTransformRef.current.scale,
            currentTranslateX: canvasTransformRef.current.translateX,
            currentTranslateY: canvasTransformRef.current.translateY
          })

          setCanvasTransform(newTransform)

          canvasTransformRef.current = newTransform

          return
        }

        const currentRect = targetEl.getBoundingClientRect()

        let { deltaY } = event
        const { ctrlKey, deltaMode } = event

        if (deltaMode === 1) {
          // 1 = "lines", 0 = "pixels"
          deltaY *= 15
        }

        const divisor = ctrlKey ? 100 : 250
        const scaleDiff = 1 - deltaY / divisor

        const newTransform = calculateTransform({
          scaleDiff,
          originX: event.clientX - currentRect.left,
          originY: event.clientY - currentRect.top,
          currentScale: canvasTransformRef.current.scale,
          currentTranslateX: canvasTransformRef.current.translateX,
          currentTranslateY: canvasTransformRef.current.translateY
        })

        if (newTransform.scale < config.minScale) return

        setCanvasTransform(newTransform)
        canvasTransformRef.current = newTransform
      }

      mainRef.current.addEventListener('wheel', handler)

      return () => {
        mainRef.current?.removeEventListener('wheel', handler)
      }
    }
  }, [mainRef])

  // handle pan (mousedown/move/up)
  const latestPointRef = useRef<MousePoint | null>(null)

  const mouseMoveHandler = (event: MouseEvent) => {
    const targetEl = mainRef.current?.children[0] as HTMLDivElement | undefined

    const prevPoint = latestPointRef.current
    const currPoint = event

    if (!targetEl || !mainRef.current || !prevPoint || !currPoint) return

    event.preventDefault()

    const currentRect = targetEl.getBoundingClientRect()

    const originX = prevPoint.clientX - currentRect.left
    const originY = prevPoint.clientY - currentRect.top

    const newTransform = calculateTransform({
      originX,
      originY,
      scaleDiff: 1,
      panX: currPoint.clientX - prevPoint.clientX,
      panY: currPoint.clientY - prevPoint.clientY,
      currentScale: canvasTransformRef.current.scale,
      currentTranslateX: canvasTransformRef.current.translateX,
      currentTranslateY: canvasTransformRef.current.translateY
    })

    setCanvasTransform(newTransform)
    canvasTransformRef.current = newTransform
    latestPointRef.current = event
  }

  const mouseUpHandler = (event: MouseEvent) => {
    mainRef.current?.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
    latestPointRef.current = null
  }

  const mouseDownHandler = (event: MouseEvent | any) => {
    if (mainRef.current) {
      latestPointRef.current = event
      mainRef.current.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    }
  }

  useEffect(() => {
    if (mainRef.current) {
      return () => {
        mainRef.current?.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }
    }
  }, [mainRef])

  return (
    <div ref={mainRef} className="PipelineGraph-Canvas" onMouseDown={mouseDownHandler}>
      {children}
    </div>
  )
}
