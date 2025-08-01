import { Children, forwardRef, HTMLAttributes, ImgHTMLAttributes, isValidElement, ReactNode } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva('cn-card', {
  variants: {
    size: {
      sm: 'cn-card-sm',
      md: 'cn-card-md',
      lg: 'cn-card-lg'
    },
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
    size: 'md',
    orientation: 'vertical',
    position: 'start',
    selected: false,
    disabled: false
  }
})

export interface CardRootProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  children: ReactNode
  wrapperClassname?: string
}

const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
  (
    {
      className,
      size = 'md',
      selected = false,
      disabled = false,
      orientation = 'vertical',
      position = 'start',
      children,
      wrapperClassname,
      ...props
    },
    ref
  ) => {
    const { imageContent, otherContent } = Children.toArray(children).reduce<{
      imageContent: ReactNode | null
      otherContent: ReactNode[]
    }>(
      (acc, child) => {
        if (isValidElement(child) && child.type === CardImage) {
          if (!acc.imageContent) acc.imageContent = child
        } else {
          acc.otherContent.push(child)
        }
        return acc
      },
      { imageContent: null, otherContent: [] }
    )

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            size,
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
        <div className={cn('cn-card-content-wrapper', wrapperClassname)}>{otherContent}</div>
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
  <div ref={ref} className={cn('cn-card-content', className)} {...props} />
))
CardContent.displayName = 'CardContent'

interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string
  height?: number | string
}
const CardImage = forwardRef<HTMLImageElement, CardImageProps>(({ className, width, height, ...props }, ref) => (
  <img
    ref={ref}
    alt={props.alt}
    className={cn('cn-card-image', className)}
    style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height
    }}
    {...props}
  />
))
CardImage.displayName = 'CardImage'

const Card = {
  Root: CardRoot,
  Title: CardTitle,
  Content: CardContent,
  Image: CardImage
}

export { Card, cardVariants }
