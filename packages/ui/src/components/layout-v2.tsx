import { FC, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'

// Simple base props shared by all layout components
interface LayoutProps {
  children?: ReactNode
  className?: string
  gap?: string
  gapX?: string
  gapY?: string
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  as?: 'div' | 'span'
}

// Simplified Flex props
interface FlexProps extends LayoutProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

// Simplified Grid props
interface GridProps extends LayoutProps {
  columns?: string
  rows?: string
  flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'
}

// Custom Flex component using Tailwind classes
const Flex = ({
  children,
  className,
  direction = 'row',
  align,
  justify,
  gap,
  gapX,
  gapY,
  wrap,
  as: Comp = 'div',
  ...props
}: FlexProps & HTMLAttributes<HTMLDivElement>) => {
  // Map direction to Tailwind classes
  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  }

  // Map align to Tailwind classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  // Map justify to Tailwind classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }

  // Map wrap to Tailwind classes
  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  }

  return (
    <Comp
      className={cn(
        'flex',
        direction && directionClasses[direction],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrap && wrapClasses[wrap],
        gap && `gap-${gap}`,
        gapX && `gap-x-${gapX}`,
        gapY && `gap-y-${gapY}`,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

// Custom Grid component using Tailwind classes
const Grid = ({
  children,
  className,
  columns,
  rows,
  flow,
  align,
  justify,
  gap,
  gapX,
  gapY,
  as: Comp = 'div',
  ...props
}: GridProps & HTMLAttributes<HTMLDivElement>) => {
  // Map align to Tailwind classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  // Map justify to Tailwind classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }

  return (
    <Comp
      className={cn(
        'grid',
        align && alignClasses[align],
        justify && justifyClasses[justify],
        gap && `gap-${gap}`,
        gapX && `gap-x-${gapX}`,
        gapY && `gap-y-${gapY}`,
        className
      )}
      style={{
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridAutoFlow: flow?.replace('-', ' ')
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}

// Map spacing values to Tailwind CSS variables
const spacingMap = {
  small: 'var(--cn-spacing-2)',
  medium: 'var(--cn-spacing-4)',
  large: 'var(--cn-spacing-6)'
}

// Simple Horizontal component (row-oriented Flex with spacing options)
interface HorizontalProps extends Omit<FlexProps, 'direction'> {
  spacing?: 'small' | 'medium' | 'large'
}

const Horizontal: FC<HorizontalProps & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  spacing = 'medium',
  ...props
}) => {
  return (
    <Flex direction="row" className={className} gap={spacing ? spacingMap[spacing] : undefined} {...props}>
      {children}
    </Flex>
  )
}

// Simple Vertical component (column-oriented Flex with spacing options)
interface VerticalProps extends Omit<FlexProps, 'direction'> {
  spacing?: 'small' | 'medium' | 'large'
}

const Vertical: FC<VerticalProps & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  spacing = 'medium',
  ...props
}) => {
  return (
    <Flex direction="column" className={className} gap={spacing ? spacingMap[spacing] : undefined} {...props}>
      {children}
    </Flex>
  )
}

// Export the LayoutV2 component with all subcomponents
export const LayoutV2 = {
  // Re-export Radix UI components with their full API
  Grid,
  Flex,
  // Custom components
  Horizontal,
  Vertical
}
