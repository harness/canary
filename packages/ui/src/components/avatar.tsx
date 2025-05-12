import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

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
  name?: string
  src?: string
  size?: VariantProps<typeof avatarVariants>['size']
  rounded?: boolean
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ name, src, size = 'default', rounded = false, className, ...props }, ref) => {
    const initials = getInitials(name || '')

    return (
      <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, rounded }), className)} {...props}>
        {src ? (
          <>
            <AvatarPrimitive.Image src={src} alt={name || ''} className="cn-avatar-image" />
            <AvatarPrimitive.Fallback className="cn-avatar-fallback">
              {initials || <Icon name="avatar" className="cn-avatar-icon" />}
            </AvatarPrimitive.Fallback>
          </>
        ) : (
          <AvatarPrimitive.Fallback className="cn-avatar-fallback" delayMs={0}>
            {initials || <Icon name="avatar" className="cn-avatar-icon" />}
          </AvatarPrimitive.Fallback>
        )}
      </AvatarPrimitive.Root>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
