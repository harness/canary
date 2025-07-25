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
      '4xs': 'cn-layout-gap-4xs',
      '3xs': 'cn-layout-gap-3xs',
      '2xs': 'cn-layout-gap-2xs',
      xs: 'cn-layout-gap-xs',
      sm: 'cn-layout-gap-sm',
      md: 'cn-layout-gap-md',
      lg: 'cn-layout-gap-lg',
      xl: 'cn-layout-gap-xl',
      '2xl': 'cn-layout-gap-2xl',
      '3xl': 'cn-layout-gap-3xl',
      '4xl': 'cn-layout-gap-4xl'
    },
    gapX: {
      none: 'gap-x-0',
      '4xs': 'cn-layout-gap-x-4xs',
      '3xs': 'cn-layout-gap-x-3xs',
      '2xs': 'cn-layout-gap-x-2xs',
      xs: 'cn-layout-gap-x-xs',
      sm: 'cn-layout-gap-x-sm',
      md: 'cn-layout-gap-x-md',
      lg: 'cn-layout-gap-x-lg',
      xl: 'cn-layout-gap-x-xl',
      '2xl': 'cn-layout-gap-x-2xl',
      '3xl': 'cn-layout-gap-x-3xl',
      '4xl': 'cn-layout-gap-x-4xl'
    },
    gapY: {
      none: 'gap-y-0',
      '4xs': 'cn-layout-gap-y-4xs',
      '3xs': 'cn-layout-gap-y-3xs',
      '2xs': 'cn-layout-gap-y-2xs',
      xs: 'cn-layout-gap-y-xs',
      sm: 'cn-layout-gap-y-sm',
      md: 'cn-layout-gap-y-md',
      lg: 'cn-layout-gap-y-lg',
      xl: 'cn-layout-gap-y-xl',
      '2xl': 'cn-layout-gap-y-2xl',
      '3xl': 'cn-layout-gap-y-3xl',
      '4xl': 'cn-layout-gap-y-4xl'
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
