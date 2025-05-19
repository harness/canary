import { FC, ReactNode } from 'react'

import { Flex as FlexPrimitive, Grid as GridPrimitive } from '@radix-ui/themes'
import { cn } from '@utils/cn'

// Define the allowed props for Flex component based on Radix UI Themes
type ResponsiveValue<T> = T | { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }

interface LayoutProps {
  as?: 'div' | 'span'
  asChild?: boolean
  justify?: ResponsiveValue<'start' | 'center' | 'end' | 'between'>
  gap?: ResponsiveValue<string>
  gapX?: ResponsiveValue<string>
  gapY?: ResponsiveValue<string>
  children?: ReactNode
  className?: string
}

interface FlexProps extends LayoutProps {
  display?: ResponsiveValue<'none' | 'inline-flex' | 'flex'>
  direction?: ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'baseline' | 'stretch'>
  wrap?: ResponsiveValue<'nowrap' | 'wrap' | 'wrap-reverse'>
}

interface GridProps extends LayoutProps {
  display?: ResponsiveValue<'none' | 'inline-grid' | 'grid'>
  areas?: ResponsiveValue<string>
  columns?: ResponsiveValue<string>
  rows?: ResponsiveValue<string>
  flow?: ResponsiveValue<'row' | 'column'>
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'baseline' | 'stretch'>
}

const Flex = ({ children, className, ...props }: FlexProps) => {
  return (
    <FlexPrimitive {...props} className={cn('flex', className)}>
      {children}
    </FlexPrimitive>
  )
}

const Grid = ({ children, className, ...props }: GridProps) => {
  return (
    <GridPrimitive {...props} className={cn('grid', className)}>
      {children}
    </GridPrimitive>
  )
}

// Horizontal component that uses Flex internally
const Horizontal: FC<FlexProps> = ({ children, className, ...props }) => {
  return (
    <Flex direction="row" className={className} {...props}>
      {children}
    </Flex>
  )
}

// Vertical component that uses Flex internally
const Vertical: FC<FlexProps> = ({ children, className, ...props }) => {
  return (
    <Flex direction="column" className={className} {...props}>
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
