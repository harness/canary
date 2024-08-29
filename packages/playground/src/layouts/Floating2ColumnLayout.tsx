import React from 'react'
import { cn } from '@harnessio/canary'

interface Floating2ColumnLayoutProps {
  className?: string
  leftColumn: React.ReactNode
  rightColumn: React.ReactNode
}

const Floating2ColumnLayout = ({ className, leftColumn, rightColumn }: Floating2ColumnLayoutProps) => {
  return (
    <div className={cn('grid grid-flow-col grid-cols-[1fr_220px] gap-x-8', className)}>
      <div className="flex flex-col">{leftColumn}</div>
      {rightColumn}
    </div>
  )
}

export default Floating2ColumnLayout
