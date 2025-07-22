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
      '3xs': 'gap-[var(--cn-layout-3xs)]',
      '2xs': 'gap-[var(--cn-layout-2xs)]',
      xs: 'gap-[var(--cn-layout-xs)]',
      sm: 'gap-[var(--cn-layout-sm)]',
      md: 'gap-[var(--cn-layout-md)]',
      lg: 'gap-[var(--cn-layout-lg)]',
      xl: 'gap-[var(--cn-layout-xl)]'
    },
    gapX: {
      none: 'gap-x-0',
      '3xs': 'gap-x-[var(--cn-layout-3xs)]',
      '2xs': 'gap-x-[var(--cn-layout-2xs)]',
      xs: 'gap-x-[var(--cn-layout-xs)]',
      sm: 'gap-x-[var(--cn-layout-sm)]',
      md: 'gap-x-[var(--cn-layout-md)]',
      lg: 'gap-x-[var(--cn-layout-lg)]',
      xl: 'gap-x-[var(--cn-layout-xl)]'
    },
    gapY: {
      none: 'gap-y-0',
      '3xs': 'gap-y-[var(--cn-layout-3xs)]',
      '2xs': 'gap-y-[var(--cn-layout-2xs)]',
      xs: 'gap-y-[var(--cn-layout-xs)]',
      sm: 'gap-y-[var(--cn-layout-sm)]',
      md: 'gap-y-[var(--cn-layout-md)]',
      lg: 'gap-y-[var(--cn-layout-lg)]',
      xl: 'gap-y-[var(--cn-layout-xl)]'
    }
  }
})

type GapSize = 'none' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

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
