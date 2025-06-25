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

const spacingVariants = cva('', {
  variants: {
    spacing: {
      small: 'gap-[var(--cn-spacing-2)]',
      medium: 'gap-[var(--cn-spacing-4)]',
      large: 'gap-[var(--cn-spacing-6)]'
    }
  },
  defaultVariants: {
    spacing: 'medium'
  }
})

const gapVariants = cva('', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-[var(--cn-layout-xs,var(--cn-spacing-2))]',
      sm: 'gap-[var(--cn-layout-sm,var(--cn-spacing-3))]',
      md: 'gap-[var(--cn-layout-md,var(--cn-spacing-4))]',
      lg: 'gap-[var(--cn-layout-lg,var(--cn-spacing-6))]',
      xl: 'gap-[var(--cn-layout-xl,var(--cn-spacing-8))]'
    },
    gapX: {
      none: 'gap-x-0',
      xs: 'gap-x-[var(--cn-layout-xs,var(--cn-spacing-2))]',
      sm: 'gap-x-[var(--cn-layout-sm,var(--cn-spacing-3))]',
      md: 'gap-x-[var(--cn-layout-md,var(--cn-spacing-4))]',
      lg: 'gap-x-[var(--cn-layout-lg,var(--cn-spacing-6))]',
      xl: 'gap-x-[var(--cn-layout-xl,var(--cn-spacing-8))]'
    },
    gapY: {
      none: 'gap-y-0',
      xs: 'gap-y-[var(--cn-layout-xs,var(--cn-spacing-2))]',
      sm: 'gap-y-[var(--cn-layout-sm,var(--cn-spacing-3))]',
      md: 'gap-y-[var(--cn-layout-md,var(--cn-spacing-4))]',
      lg: 'gap-y-[var(--cn-layout-lg,var(--cn-spacing-6))]',
      xl: 'gap-y-[var(--cn-layout-xl,var(--cn-spacing-8))]'
    }
  }
})

type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

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

interface HorizontalProps extends Omit<FlexProps, 'direction'>, VariantProps<typeof spacingVariants> {}

const Horizontal = forwardRef<HTMLDivElement, HorizontalProps & HTMLAttributes<HTMLDivElement>>(
  ({ children, className, spacing, ...props }, ref) => {
    return (
      <Flex ref={ref} direction="row" className={cn(spacingVariants({ spacing }), className)} {...props}>
        {children}
      </Flex>
    )
  }
)
Horizontal.displayName = 'LayoutHorizontal'

interface VerticalProps extends Omit<FlexProps, 'direction'>, VariantProps<typeof spacingVariants> {}

const Vertical = forwardRef<HTMLDivElement, VerticalProps & HTMLAttributes<HTMLDivElement>>(
  ({ children, className, spacing, ...props }, ref) => {
    return (
      <Flex ref={ref} direction="column" className={cn(spacingVariants({ spacing }), className)} {...props}>
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
