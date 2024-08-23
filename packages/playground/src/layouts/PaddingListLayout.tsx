import React from 'react'
import { cn } from '@harnessio/canary'

interface PaddingListLayoutProps {
  className?: string
  children: React.ReactNode
}

const PaddingListLayout = ({ className, children }: PaddingListLayoutProps) => {
  return <div className={cn('pt-10 px-6 pb-16 max-w-[1200px] min-w-[770px] mx-auto', className)}>{children}</div>
}

export default PaddingListLayout
