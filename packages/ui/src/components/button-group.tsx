import { ReactNode } from 'react'

import { cn } from '@utils/cn'

interface ButtonGroupProps {
  children: ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
  spacing?: string
  verticalAlign?: string
}

export function ButtonGroup({
  children,
  direction = 'horizontal',
  className,
  spacing = '4',
  verticalAlign
}: ButtonGroupProps) {
  const gapClass = `gap-${spacing}`
  const verticalAlignClass = verticalAlign ? `items-${verticalAlign}` : ''

  return (
    <div
      className={cn('flex', direction === 'vertical' ? 'flex-col' : '', gapClass, verticalAlignClass, className)}
      aria-label="Button control group"
    >
      {children}
    </div>
  )
}
