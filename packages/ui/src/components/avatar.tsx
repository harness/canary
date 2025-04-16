import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      '4.5': 'size-[18px]',
      '6': 'size-6',
      '8': 'size-8',
      '20': 'size-20'
    }
  },
  defaultVariants: {
    size: '6'
  }
})

const AvatarRoot = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => {
  return <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
})
AvatarRoot.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'text-1 bg-cn-background-11 text-cn-foreground-1 flex h-full w-full items-center justify-center rounded-full',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback
}

export { Avatar }
