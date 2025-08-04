import { ElementType, forwardRef, HTMLAttributes, ReactNode } from 'react'

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

const gapVariants = cva('', {
  variants: {
    gap: {
      none: 'gap-0',
      '4xs': 'gap-cn-4xs',
      '3xs': 'gap-cn-3xs',
      '2xs': 'gap-cn-2xs',
      xs: 'gap-cn-xs',
      sm: 'gap-cn-sm',
      md: 'gap-cn-md',
      lg: 'gap-cn-lg',
      xl: 'gap-cn-xl',
      '2xl': 'gap-cn-2xl',
      '3xl': 'gap-cn-3xl',
      '4xl': 'gap-cn-4xl'
    },
    gapX: {
      none: 'gap-x-0',
      '4xs': 'gap-x-cn-4xs',
      '3xs': 'gap-x-cn-3xs',
      '2xs': 'gap-x-cn-2xs',
      xs: 'gap-x-cn-xs',
      sm: 'gap-x-cn-sm',
      md: 'gap-x-cn-md',
      lg: 'gap-x-cn-lg',
      xl: 'gap-x-cn-xl',
      '2xl': 'gap-x-cn-2xl',
      '3xl': 'gap-x-cn-3xl',
      '4xl': 'gap-x-cn-4xl'
    },
    gapY: {
      none: 'gap-y-0',
      '4xs': 'gap-y-cn-4xs',
      '3xs': 'gap-y-cn-3xs',
      '2xs': 'gap-y-cn-2xs',
      xs: 'gap-y-cn-xs',
      sm: 'gap-y-cn-sm',
      md: 'gap-y-cn-md',
      lg: 'gap-y-cn-lg',
      xl: 'gap-y-cn-xl',
      '2xl': 'gap-y-cn-2xl',
      '3xl': 'gap-y-cn-3xl',
      '4xl': 'gap-y-cn-4xl'
    }
  }
})

/**
 * GapSize defines the available sizes for gaps in the layout.
 *
 * | Size | CSS Variable |
 * |------|--------------|
 * | none | No gap |
 * | 4xs  | var(--cn-spacing-half) |
 * | 3xs  | var(--cn-spacing-1) |
 * | 2xs  | var(--cn-spacing-1-half) |
 * | xs   | var(--cn-spacing-2) |
 * | sm   | var(--cn-spacing-3) |
 * | md   | var(--cn-spacing-4) |
 * | lg   | var(--cn-spacing-5) |
 * | xl   | var(--cn-spacing-6) |
 * | 2xl  | var(--cn-spacing-8) |
 * | 3xl  | var(--cn-spacing-10) |
 * | 4xl  | var(--cn-spacing-20) |
 */
type GapSize = 'none' | '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

interface LayoutProps {
  children?: ReactNode
  className?: string
  gap?: GapSize
  gapX?: GapSize
  gapY?: GapSize
  as?: ElementType
}

interface FlexProps extends LayoutProps, VariantProps<typeof flexVariants> {}

interface GridProps extends LayoutProps, VariantProps<typeof gridVariants> {
  columns?: string | number
  rows?: string | number
  flow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'
}

const Flex = forwardRef<HTMLDivElement, FlexProps & HTMLAttributes<HTMLDivElement>>(
  ({ children, className, direction, align, justify, gap, gapX, gapY, wrap, as: Comp = 'div', ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(flexVariants({ direction, align, justify, wrap }), gapVariants({ gap, gapX, gapY }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Flex.displayName = 'LayoutFlex'

const Grid = forwardRef<HTMLDivElement, GridProps & HTMLAttributes<HTMLDivElement>>(
  (
    { children, className, columns, rows, flow, align, justify, gap, gapX, gapY, as: Comp = 'div', style, ...props },
    ref
  ) => {
    return (
      <Comp
        ref={ref}
        className={cn(gridVariants({ align, justify }), gapVariants({ gap, gapX, gapY }), className)}
        // We need to use inline styles here instead of Tailwind classes because:
        // 1. Tailwind's compiler processes classes at build time and drops runtime references
        // 2. Dynamic values (like user-provided columns/rows) can't be properly handled by Tailwind
        // 3. This approach ensures consistent rendering regardless of what values are passed at runtime
        style={{
          ...style,
          gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns,
          gridTemplateRows: typeof rows === 'number' ? `repeat(${rows}, minmax(0, auto))` : rows,
          gridAutoFlow: flow
        }}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Grid.displayName = 'LayoutGrid'

interface HorizontalProps extends Omit<FlexProps, 'direction'> {}

const Horizontal = forwardRef<HTMLDivElement, HorizontalProps & HTMLAttributes<HTMLDivElement>>(
  ({ children, className, gap = 'md', ...props }, ref) => {
    return (
      <Flex ref={ref} direction="row" className={className} gap={gap} {...props}>
        {children}
      </Flex>
    )
  }
)
Horizontal.displayName = 'LayoutHorizontal'

interface VerticalProps extends Omit<FlexProps, 'direction'> {}

const Vertical = forwardRef<HTMLDivElement, VerticalProps & HTMLAttributes<HTMLDivElement>>(
  ({ children, className, gap = 'md', ...props }, ref) => {
    return (
      <Flex ref={ref} direction="column" className={className} gap={gap} {...props}>
        {children}
      </Flex>
    )
  }
)
Vertical.displayName = 'LayoutVertical'

export const Layout = {
  Grid,
  Flex,
  Horizontal,
  Vertical
}
