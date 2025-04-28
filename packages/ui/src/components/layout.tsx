import { FC, forwardRef, ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface LayoutProps {
  children: ReactNode
  gap?: string
  className?: string
}

const Vertical = forwardRef<HTMLDivElement, LayoutProps>(({ children, gap = 'space-y-4', className }, ref) => {
  return (
    <div ref={ref} className={cn(`flex flex-col ${gap}`, className)}>
      {children}
    </div>
  )
})
Vertical.displayName = 'VerticalLayout'

const Horizontal = forwardRef<HTMLDivElement, LayoutProps>(({ children, gap = 'space-x-4', className }) => {
  return <div className={cn(`flex ${gap}`, className)}>{children}</div>
})
Horizontal.displayName = 'HorizontalLayout'

export const Layout = {
  Vertical,
  Horizontal
}
