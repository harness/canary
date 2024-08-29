import React from 'react'
import { cn } from '@harnessio/canary'

interface FullWidth2ColumnLayoutProps {
  className?: string
  leftColumn: React.ReactNode
  rightColumn: React.ReactNode
}

const FullWidth2ColumnLayout = ({ className, leftColumn, rightColumn }: FullWidth2ColumnLayoutProps) => {
  return (
    <div className={cn('grid grid-flow-col grid-cols-[1fr_220px] gap-x-8', className)}>
      <div className="flex flex-col">{leftColumn}</div>
      {rightColumn}
    </div>
  )
}

export default FullWidth2ColumnLayout
