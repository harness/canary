import { RefObject, useCallback } from 'react'

import { cn } from '@utils/cn'

interface DraggableSidebarDividerProps {
  width: number
  setWidth: (width: number | ((prev: number) => number)) => void
  containerRef?: RefObject<HTMLElement>
  minWidth?: number
  maxWidth?: number
  ariaLabel?: string
  className?: string
}

export const SIDEBAR_MIN_WIDTH = 264
export const SIDEBAR_MAX_WIDTH = 700

export const DraggableSidebarDivider: React.FC<DraggableSidebarDividerProps> = ({
  width,
  setWidth,
  containerRef,
  minWidth = SIDEBAR_MIN_WIDTH,
  maxWidth = SIDEBAR_MAX_WIDTH,
  ariaLabel = 'Resize panel by dragging or using arrow keys (with shift for larger steps)',
  className
}) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const startX = e.clientX
      const startWidth = width
      const container = containerRef?.current || document

      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent
        const newWidth = startWidth + (mouseEvent.clientX - startX)
        setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)))
      }

      const handleMouseUp = () => {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseup', handleMouseUp)
      }

      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseup', handleMouseUp)
    },
    [width, setWidth, minWidth, maxWidth, containerRef]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 50 : 10 // Larger steps with Shift key

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setWidth(prev => Math.max(minWidth, prev - step))
          break
        case 'ArrowRight':
          e.preventDefault()
          setWidth(prev => Math.min(maxWidth, prev + step))
          break
        case 'Home':
          e.preventDefault()
          setWidth(minWidth) // Minimum width
          break
        case 'End':
          e.preventDefault()
          setWidth(maxWidth) // Maximum width
          break
      }
    },
    [setWidth, minWidth, maxWidth]
  )

  return (
    <div
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      className={cn(
        'border-cn-borders-3 focus-within:border-cn-borders-1 focus-visible:border-cn-borders-1 w-1 shrink-0 cursor-col-resize select-none border-r transition-colors',
        className
      )}
      role="slider"
      aria-valuenow={width}
      aria-valuemax={maxWidth}
      aria-valuemin={minWidth}
      tabIndex={0}
      aria-label={ariaLabel}
    />
  )
}
