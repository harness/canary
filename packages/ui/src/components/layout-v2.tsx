import { FC, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'

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

interface FlexProps extends LayoutProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

interface GridProps extends LayoutProps {
  columns?: string
  rows?: string
  flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'
}

const directionClasses = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse'
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch'
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between'
}

const wrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse'
}

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

const spacingMap = {
  small: 'var(--cn-spacing-4)',
  medium: 'var(--cn-spacing-8)',
  large: 'var(--cn-spacing-12)'
}

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
    <Flex direction="row" className={cn(spacing && spacingMap[spacing], className)} {...props}>
      {children}
    </Flex>
  )
}

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
    <Flex direction="column" className={cn(spacing && spacingMap[spacing], className)} {...props}>
      {children}
    </Flex>
  )
}

export const LayoutV2 = {
  Grid,
  Flex,
  Horizontal,
  Vertical
}
