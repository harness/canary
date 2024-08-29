import React from 'react'
import { cn } from '@harnessio/canary'

interface Floating1ColumnLayoutProps {
  className?: string
  children: React.ReactNode
}

const Floating1ColumnLayout = ({ className, children }: Floating1ColumnLayoutProps) => {
  return <div className={cn('px-8 pb-8 max-w-[1200px] mx-auto', className)}>{children}</div>
}

export default Floating1ColumnLayout
