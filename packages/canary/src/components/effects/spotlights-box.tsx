import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '../icon'
import { cn } from '@/lib/utils'

interface PageProps {
  children: React.ReactNode
  logo: React.ReactElement<SVGSVGElement>
  logoSize?: number
  highlightTop?: string
  highlightBottom?: string
}

function Root({ logo, logoSize = 84, children }: PageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const circle1Ref = useRef<HTMLDivElement>(null)
  const circle2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateCircleDimensions = () => {
      const width = circle1Ref.current?.offsetWidth || 0
      const height = circle1Ref.current?.offsetHeight || 0
      const circleRadius = Math.min(width, height) / 2

      // Set CSS variables for animations
      if (circle1Ref.current && circle2Ref.current) {
        circle1Ref.current.style.setProperty('--circle-start-x', `-${circleRadius}px`)
        circle1Ref.current.style.setProperty('--circle-start-y', `-${circleRadius}px`)
        circle1Ref.current.style.setProperty('--circle-end-x', `${circleRadius}px`)
        circle1Ref.current.style.setProperty('--circle-end-y', `${circleRadius}px`)

        circle2Ref.current.style.setProperty('--circle-start-x', `${circleRadius}px`)
        circle2Ref.current.style.setProperty('--circle-start-y', `${circleRadius}px`)
        circle2Ref.current.style.setProperty('--circle-end-x', `-${circleRadius}px`)
        circle2Ref.current.style.setProperty('--circle-end-y', `-${circleRadius}px`)
      }
    }

    updateCircleDimensions()
    window.addEventListener('resize', updateCircleDimensions)

    return () => {
      window.removeEventListener('resize', updateCircleDimensions)
    }
  }, [])

  return (
    <div
      className="relative w-full h-[220px] overflow-hidden rounded-md border border-primary/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Circle 1 */}
      <div
        ref={circle1Ref}
        className={cn(
          'circle-1 bg-[radial-gradient(50%_50%_at_50%_50%,_hsl(var(--green))_0%,_transparent_100%)] absolute w-full h-full',
          isHovered ? 'animate-clockwise-slow' : ''
        )}></div>

      {/* Circle 2 */}
      <div
        ref={circle2Ref}
        className={cn(
          'circle-2 bg-[radial-gradient(50%_50%_at_50%_50%,_hsl(var(--mint))_0%,_transparent_100%)] absolute w-full h-full',
          isHovered ? 'animate-anticlockwise-slow' : ''
        )}></div>

      {/* Overlay */}
      <div className="absolute inset-[1px] bg-black/70 rounded-[5px]"></div>

      {/* Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        {logo && <Icon name={logo} size={logoSize} />}
      </div>

      {/* Children */}
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="absolute bottom-0 w-full px-4 py-3">{children}</div>
}

export { Root, Content }
