import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

interface SpotlightsProps {
  children: React.ReactNode
  highlightTop?: string
  highlightBottom?: string
  className?: string
}

function Root({ children, highlightTop = '#4786B8', highlightBottom = '#AD79D2', className }: SpotlightsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        let animationFrameId: number
        const circles = [
          { x: 24, y: 24, color: highlightTop, radius: 24, angle: 0 }, // Start at top-left
          {
            x: canvas.width - 24,
            y: canvas.height - 24,
            color: highlightBottom,
            radius: 24,
            angle: Math.PI // Start at bottom-right
          }
        ]

        const draw = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          circles.forEach(circle => {
            ctx.beginPath()
            ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
            ctx.fillStyle = circle.color
            ctx.filter = 'blur(12px)'
            ctx.fill()
          })
        }

        const update = () => {
          // Update angles for movement
          circles[0].angle += 0.005 // Slower clockwise movement
          circles[1].angle -= 0.005 // Slower counter-clockwise movement

          // Update positions based on the angle
          const radius = Math.min(canvas.width, canvas.height) / 2 - 24 // To keep circles within bounds

          // Circle 1 - clockwise movement starting from the top-left corner
          circles[0].x = 24 + radius * Math.cos(circles[0].angle + Math.PI / 2) // Offset to start at top-left
          circles[0].y = 24 + radius * Math.sin(circles[0].angle + Math.PI / 2)

          // Circle 2 - counter-clockwise movement starting from the bottom-right corner
          circles[1].x = canvas.width - 24 + radius * Math.cos(circles[1].angle) // Offset to start at bottom-right
          circles[1].y = canvas.height - 24 + radius * Math.sin(circles[1].angle)
        }

        const animate = () => {
          update()
          draw()
          animationFrameId = requestAnimationFrame(animate)
        }

        // Initial draw
        draw()

        // Start the animation
        animate()

        // Cleanup on unmount
        return () => {
          cancelAnimationFrame(animationFrameId)
        }
      }
    }
  }, [])

  return (
    <div className={cn('relative flex h-full w-full place-content-center items-center overflow-hidden', className)}>
      <canvas ref={canvasRef} width="100%" height="100%" className="contrast-110 absolute inset-0 size-full" />
      <div className="absolute inset-0 z-10 size-full bg-black opacity-50" />
      {children}
    </div>
  )
}

interface ContentProps {
  children: React.ReactNode
  className?: string
}

function Content({ children, className }: ContentProps) {
  return <div className={cn('z-10 flex max-w-96 flex-col justify-center p-8', className)}>{children}</div>
}

export { Root, Content }
