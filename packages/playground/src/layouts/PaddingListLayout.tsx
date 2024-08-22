import React from 'react'
import { cn } from '@harnessio/canary'

interface PaddingListLayoutProps {
  className?: string
}

const PaddingListLayout: React.FC<PaddingListLayoutProps> = ({ className }) => {
  return <div className={cn('p-10', className)}></div>
}

export default PaddingListLayout
