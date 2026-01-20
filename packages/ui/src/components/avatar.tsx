import { ComponentPropsWithoutRef, forwardRef } from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2, IconV2NamesType } from './icon-v2'
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

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>

// Map avatar sizes to icon sizes
const avatarToIconSize: Record<AvatarSize, 'xs' | 'sm' | 'md'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md'
}

export interface AvatarProps extends ComponentPropsWithoutRef<'span'> {
  name?: string
  src?: string
  size?: AvatarSize
  rounded?: boolean
  noInitials?: boolean
  isGroup?: boolean
  /** Custom icon to display instead of initials or default user icon */
  icon?: IconV2NamesType
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    { name = '', src, size = 'sm', rounded = false, className, noInitials = false, isGroup = false, icon, ...props },
    ref
  ) => {
    const initials = noInitials ? name : getInitials(name)
    const iconSize = avatarToIconSize[size]

    const renderFallbackIcon = () => {
      // Custom icon takes priority
      if (icon) {
        return <IconV2 name={icon} size={iconSize} className="cn-avatar-icon" />
      }
      // Group icon
      if (isGroup) {
        return <IconV2 name="group-1" size={iconSize} className="cn-avatar-icon" />
      }
      // Initials or default user icon
      return initials || <IconV2 name="user" size={iconSize} className="cn-avatar-icon" />
    }

    return (
      <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, rounded }), className)} {...props}>
        {src ? (
          <>
            <AvatarPrimitive.Image src={src} alt={name} className="cn-avatar-image" />
            <AvatarPrimitive.Fallback className="cn-avatar-fallback">{renderFallbackIcon()}</AvatarPrimitive.Fallback>
          </>
        ) : (
          <AvatarPrimitive.Fallback
            className={`cn-avatar-fallback ${initials.length > 3 ? 'cn-avatar-fallback-small' : ''}`}
            delayMs={0}
          >
            {renderFallbackIcon()}
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
