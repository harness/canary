import { RefObject, useCallback } from 'react'

import { cn } from '@utils/cn'

interface DraggableSidebarDividerProps {
  width: number
  setWidth: (width: number) => void
  containerRef?: RefObject<HTMLElement>
  minWidth?: number
  maxWidth?: number
  ariaLabel?: string
  className?: string
}

export const SIDEBAR_MIN_WIDTH = 264
export const SIDEBAR_MAX_WIDTH = 528

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
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const step = e.shiftKey ? 50 : 10 // Larger steps with Shift key

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setWidth(Math.max(minWidth, width - step))
          break
        case 'ArrowRight':
          e.preventDefault()
          setWidth(Math.min(maxWidth, width + step))
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
    [setWidth, minWidth, maxWidth, width]
  )

  return (
    <button
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      className={cn(
        'mt-cn-xl after:bg-cn-gray-soft focus:after:bg-cn-brand relative w-px shrink-0 cursor-col-resize select-none after:transition-[width,background] before:absolute before:left-[-150%] before:top-0 before:h-full before:w-1 after:absolute after:top-0 after:h-full after:w-px hover:after:w-1 focus:after:w-1 after:left-1/2 after:-translate-x-1/2',
        className
      )}
      role="slider"
      aria-valuenow={width}
      aria-valuemax={maxWidth}
      aria-valuemin={minWidth}
      aria-label={ariaLabel}
    />
  )
}
