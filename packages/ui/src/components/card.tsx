import { Children, forwardRef, HTMLAttributes, ImgHTMLAttributes, isValidElement, ReactNode } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const cardContentVariants = cva('cn-card-content', {
  variants: {
    size: {
      sm: 'cn-card-content-sm',
      default: 'cn-card-content-default',
      lg: 'cn-card-content-lg'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

const cardVariants = cva('cn-card', {
  variants: {
    orientation: {
      vertical: 'cn-card-vertical',
      horizontal: 'cn-card-horizontal'
    },
    position: {
      start: 'cn-card-position-start',
      end: 'cn-card-position-end'
    },
    selected: {
      true: 'cn-card-selected',
      false: ''
    },
    disabled: {
      true: 'cn-card-disabled',
      false: ''
    }
  },
  defaultVariants: {
    orientation: 'vertical',
    position: 'start',
    selected: false,
    disabled: false
  }
})

export interface CardRootProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  size?: 'sm' | 'default' | 'lg'
  children: ReactNode
}

const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
  (
    {
      className,
      size = 'default',
      selected = false,
      disabled = false,
      orientation = 'vertical',
      position = 'start',
      children,
      ...props
    },
    ref
  ) => {
    const { imageContent, otherContent } = Children.toArray(children).reduce<{
      imageContent: ReactNode[]
      otherContent: ReactNode[]
    }>(
      (acc, child) => {
        if (isValidElement(child) && child.type === CardImage) {
          acc.imageContent.push(child)
        } else {
          acc.otherContent.push(child)
        }
        return acc
      },
      { imageContent: [], otherContent: [] }
    )

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            orientation,
            position,
            selected,
            disabled
          }),
          className
        )}
        {...props}
      >
        {imageContent}
        <div className={cardContentVariants({ size })}>{otherContent}</div>
      </div>
    )
  }
)
CardRoot.displayName = 'CardRoot'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Tag = 'h3', ...props }, ref) => (
    <Tag ref={ref} className={cn('cn-card-title', className)} {...props}>
      {children}
    </Tag>
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-2 text-sm text-gray-700', className)} {...props} />
))
CardContent.displayName = 'CardContent'

interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string
  height?: number | string
}
const CardImage = forwardRef<HTMLImageElement, CardImageProps>(({ className, width, height, ...props }, ref) => (
  <img ref={ref} className={cn('cn-card-image', className)} style={{ width, height }} {...props} />
))
CardImage.displayName = 'CardImage'

const Card = {
  Root: CardRoot,
  Title: CardTitle,
  Content: CardContent,
  Image: CardImage
}

export { Card, cardVariants }
