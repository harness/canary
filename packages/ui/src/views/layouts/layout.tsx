import { ReactNode } from 'react'

import { cn } from '@utils/cn'

interface LayoutProps {
  children: ReactNode
  gap?: string
  className?: string
}

const Vertical: React.FC<LayoutProps> = ({ children, gap = 'space-y-cn-md', className }) => {
  return <div className={cn(`flex flex-col ${gap}`, className)}>{children}</div>
}

const Horizontal: React.FC<LayoutProps> = ({ children, gap = 'space-x-cn-md', className }) => {
  return <div className={cn(`flex ${gap}`, className)}>{children}</div>
}

export const Layout = {
  Vertical,
  Horizontal
}
