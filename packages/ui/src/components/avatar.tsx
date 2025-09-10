import { ComponentPropsWithoutRef, forwardRef } from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2 } from './icon-v2'
import { Tooltip, TooltipProps } from './tooltip'

export const avatarVariants = cva('cn-avatar', {
  variants: {
    size: {
      xs: 'cn-avatar-xs',
      sm: 'cn-avatar-sm',
      md: 'cn-avatar-md',
      lg: 'cn-avatar-lg'
    },
    rounded: {
      true: 'cn-avatar-rounded',
      false: ''
    }
  },
  defaultVariants: {
    size: 'sm',
    rounded: false
  }
})

export type AvatarTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

export interface AvatarProps extends ComponentPropsWithoutRef<'span'> {
  name?: string
  src?: string
  size?: VariantProps<typeof avatarVariants>['size']
  rounded?: boolean
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ name, src, size = 'sm', rounded = false, className, ...props }, ref) => {
    const initials = getInitials(name || '')

    return (
      <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, rounded }), className)} {...props}>
        {src ? (
          <>
            <AvatarPrimitive.Image src={src} alt={name || ''} className="cn-avatar-image" />
            <AvatarPrimitive.Fallback className="cn-avatar-fallback">
              {/* TODO: Design system: Check whether we need cn-avatar-icon */}
              {initials || <IconV2 name="user" className="cn-avatar-icon" />}
            </AvatarPrimitive.Fallback>
          </>
        ) : (
          <AvatarPrimitive.Fallback className="cn-avatar-fallback" delayMs={0}>
            {initials || <IconV2 name="user" className="cn-avatar-icon" />}
          </AvatarPrimitive.Fallback>
        )}
      </AvatarPrimitive.Root>
    )
  }
)

Avatar.displayName = 'Avatar'

export interface AvatarWithTooltipProps extends AvatarProps {
  tooltipProps?: AvatarTooltipProps
}

const AvatarWithTooltip = forwardRef<HTMLSpanElement, AvatarWithTooltipProps>(
  ({ tooltipProps, ...avatarProps }, ref) => {
    return (
      <Tooltip content={tooltipProps?.content || avatarProps.name || ''} {...tooltipProps}>
        <Avatar ref={ref} {...avatarProps} />
      </Tooltip>
    )
  }
)

AvatarWithTooltip.displayName = 'AvatarWithTooltip'

export { Avatar, AvatarWithTooltip }
