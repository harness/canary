import { FC, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const gridVariants = cva('grid', {
  variants: {
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch'
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    }
  }
})

const flexVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse'
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch'
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse'
    }
  },
  defaultVariants: {
    direction: 'row'
  }
})

const spacingVariants = cva('', {
  variants: {
    spacing: {
      small: 'var(--cn-spacing-2)',
      medium: 'var(--cn-spacing-4)',
      large: 'var(--cn-spacing-6)'
    }
  },
  defaultVariants: {
    spacing: 'medium'
  }
})

interface LayoutProps {
  children?: ReactNode
  className?: string
  gap?: string
  gapX?: string
  gapY?: string
  as?: 'div' | 'span'
}

interface FlexProps extends LayoutProps, VariantProps<typeof flexVariants> {}

interface GridProps extends LayoutProps, VariantProps<typeof gridVariants> {
  columns?: string
  rows?: string
  flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'
}

const Flex = ({
  children,
  className,
  direction,
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
        flexVariants({ direction, align, justify, wrap }),
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
        gridVariants({ align, justify }),
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

interface HorizontalProps extends Omit<FlexProps, 'direction'>, VariantProps<typeof spacingVariants> {}

const Horizontal: FC<HorizontalProps & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  spacing,
  ...props
}) => {
  return (
    <Flex direction="row" className={cn(spacingVariants({ spacing }), className)} {...props}>
      {children}
    </Flex>
  )
}

interface VerticalProps extends Omit<FlexProps, 'direction'>, VariantProps<typeof spacingVariants> {}

const Vertical: FC<VerticalProps & HTMLAttributes<HTMLDivElement>> = ({ children, className, spacing, ...props }) => {
  return (
    <Flex direction="column" className={cn(spacingVariants({ spacing }), className)} {...props}>
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
