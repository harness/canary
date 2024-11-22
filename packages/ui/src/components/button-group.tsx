import React from 'react'

import { cn } from '@utils/cn'

interface ButtonGroupProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
  spacing?: string
  verticalAlign?: string
}

function Root({ children, direction = 'horizontal', className, spacing = '4', verticalAlign }: ButtonGroupProps) {
  const gapClass = `gap-${spacing}`
  const verticalAlignClass = verticalAlign ? `items-${verticalAlign}` : ''

  return (
    <div className={cn('flex', direction === 'vertical' ? 'flex-col' : '', gapClass, verticalAlignClass, className)}>
      {children}
    </div>
  )
}

export { Root }
