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
  as?: React.ElementType
}

interface FlexProps extends LayoutProps, VariantProps<typeof flexVariants> {}

interface GridProps extends LayoutProps, VariantProps<typeof gridVariants> {
  columns?: string | number
  rows?: string | number
  flow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'
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
      className={cn(flexVariants({ direction, align, justify, wrap }), gapVariants({ gap, gapX, gapY }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

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
      className={cn(gridVariants({ align, justify }), gapVariants({ gap, gapX, gapY }), className)}
      // We need to use inline styles here instead of Tailwind classes because:
      // 1. Tailwind's compiler processes classes at build time and drops runtime references
      // 2. Dynamic values (like user-provided columns/rows) can't be properly handled by Tailwind
      // 3. This approach ensures consistent rendering regardless of what values are passed at runtime
      style={{
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

export const Layout = {
  Grid,
  Flex,
  Horizontal,
  Vertical
}
