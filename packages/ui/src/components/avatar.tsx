import { ComponentPropsWithoutRef, forwardRef } from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva('cn-avatar', {
  variants: {
    size: {
      default: '',
      sm: 'cn-avatar-sm',
      lg: 'cn-avatar-lg'
    },
    rounded: {
      true: 'cn-avatar-rounded',
      false: ''
    }
  },
  defaultVariants: {
    size: 'default',
    rounded: false
  }
})

interface AvatarProps extends ComponentPropsWithoutRef<'span'> {
  name: string
  src?: string
  size?: VariantProps<typeof avatarVariants>['size']
  rounded?: boolean
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, size = 'default', rounded = false, className, ...props }, ref) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()

    return (
      <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, rounded }), className)} {...props}>
        {src ? (
          <AvatarPrimitive.Image src={src} alt={name} className="cn-avatar-image" />
        ) : (
          <AvatarPrimitive.Fallback delayMs={0} className="cn-avatar-fallback">
            {initials}
          </AvatarPrimitive.Fallback>
        )}
      </AvatarPrimitive.Root>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
