import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
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
    const initials = getInitials(name)

    return (
      <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, rounded }), className)} {...props}>
        {src ? (
          <>
            <AvatarPrimitive.Image src={src} alt={name} className="cn-avatar-image" />
            <AvatarFallback>{initials}</AvatarFallback>
          </>
        ) : (
          <AvatarFallback delayMs={0}>{initials}</AvatarFallback>
        )}
      </AvatarPrimitive.Root>
    )
  }
)
Avatar.displayName = 'Avatar'

interface AvatarFallbackProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  children: ReactNode
}
const AvatarFallback = ({ children, ...props }: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback className="cn-avatar-fallback" {...props}>
    {children}
  </AvatarPrimitive.Fallback>
)

export { Avatar }
