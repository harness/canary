import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow', {
  variants: {
    variant: {
      default: '',
      plain: 'border-none bg-transparent shadow-none'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  width?: 'auto' | 'full' | 'screen' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string
}

const widthVariants = {
  auto: 'w-auto',
  full: 'w-full',
  screen: 'w-screen',
  fit: 'w-fit',
  xs: 'w-24',
  sm: 'w-48',
  md: 'w-64',
  lg: 'w-72',
  xl: 'w-80',
  '2xl': 'w-96'
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ variant, className, width = 'auto', ...props }, ref) => {
  const widthClassName = widthVariants[width as keyof typeof widthVariants] || width

  return <div ref={ref} className={cn(cardVariants({ variant }), widthClassName, className)} {...props} />
})

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = 'space-y-1.5 p-6', ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Tag = 'h3', ...props }, ref) => (
    <Tag ref={ref} className={cn('font-medium text-24 leading-snug', className)} {...props}>
      {children}
    </Tag>
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = 'p-6', ...props }, ref) => <div ref={ref} className={cn('pt-0', className)} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = 'p-6', ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
