import React, { useEffect, useRef } from 'react'

import { useCanvasContext } from '../../context/CanvasProvider'
import { calculateTransform, MousePoint } from './canvas-utils'

import './canvas.css'

export function Canvas({ children }: React.PropsWithChildren) {
  const { config, setCanvasTransform, canvasTransform } = useCanvasContext()

  const canvasTransformRef = useRef(canvasTransform)
  canvasTransformRef.current = canvasTransform

  const mainRef = useRef<HTMLDivElement | null>(null)

  // handle zoom-to-pinch (wheel)
  useEffect(() => {
    if (mainRef.current) {
      const handler = (event: WheelEvent) => {
        const targetEl = mainRef.current?.children[0] as HTMLDivElement | undefined

        if (!targetEl || !mainRef.current) return

        event.preventDefault()

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

  useEffect(() => {
    if (mainRef.current) {
      const mouseDownHandler = (event: MouseEvent) => {
        if (mainRef.current) {
          latestPointRef.current = event
          mainRef.current.addEventListener('mousemove', mouseMoveHandler)
          document.addEventListener('mouseup', mouseUpHandler)
        }
      }

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

      mainRef.current.addEventListener('mousedown', mouseDownHandler)

      return () => {
        mainRef.current?.removeEventListener('mousedown', mouseDownHandler)
        mainRef.current?.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }
    }
  }, [mainRef])

  return (
    <div
      style={{
        display: 'block',
        overflow: 'hidden',
        touchAction: 'none',
        height: '100%'
      }}
      ref={mainRef}
      className="PipelineGraph-Canvas"
    >
      {children}
    </div>
  )
}
