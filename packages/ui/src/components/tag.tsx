import { forwardRef } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from './button'
import { IconPropsV2, IconV2, IconV2NamesType } from './icon-v2'

const tagVariants = cva('cn-tag', {
  variants: {
    variant: {
      outline: 'cn-tag-outline',
      secondary: 'cn-tag-secondary'
    },
    size: {
      md: '',
      sm: 'cn-tag-sm'
    },
    theme: {
      gray: 'cn-tag-gray',
      blue: 'cn-tag-blue',
      brown: 'cn-tag-brown',
      cyan: 'cn-tag-cyan',
      green: 'cn-tag-green',
      indigo: 'cn-tag-indigo',
      lime: 'cn-tag-lime',
      mint: 'cn-tag-mint',
      orange: 'cn-tag-orange',
      pink: 'cn-tag-pink',
      purple: 'cn-tag-purple',
      red: 'cn-tag-red',
      violet: 'cn-tag-violet',
      yellow: 'cn-tag-yellow'
    },
    rounded: {
      true: 'cn-tag-rounded'
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    theme: 'gray'
  }
})

type TagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex'> & {
  variant?: VariantProps<typeof tagVariants>['variant']
  size?: VariantProps<typeof tagVariants>['size']
  theme?: VariantProps<typeof tagVariants>['theme']
  rounded?: boolean
  icon?: IconV2NamesType
  iconProps?: Omit<IconPropsV2, 'name' | 'size' | 'fallback' | 'ref'>
  label?: string
  value: string
  disabled?: boolean
  title?: string
  enableHover?: boolean
  actionIcon?: IconV2NamesType
  onActionClick?: () => void
  labelClassName?: string
  valueClassName?: string
}

const Tag = forwardRef<HTMLDivElement, TagProps>(
  (
    {
      variant,
      size,
      theme,
      rounded,
      icon,
      label,
      value,
      className,
      disabled = false,
      enableHover = false,
      title,
      actionIcon,
      onActionClick,
      labelClassName,
      valueClassName,
      iconProps,
      ...props
    },
    ref
  ) => {
    if (label && value) {
      return (
        <TagSplit
          ref={ref}
          {...{
            variant,
            size,
            theme,
            rounded,
            icon,
            actionIcon,
            onActionClick,
            label: label,
            value,
            disabled,
            enableHover: Boolean(props.onClick),
            onClick: props.onClick,
            className,
            labelClassName,
            valueClassName
          }}
        />
      )
    }

    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          tagVariants({ variant, size, theme, rounded }),
          {
            'text-cn-disabled cursor-not-allowed': disabled,
            'cn-tag-hoverable': !disabled && (enableHover || props.onClick),
            'cursor-pointer': !disabled && props.onClick
          },
          className
        )}
        {...props}
      >
        {icon && (
          <IconV2
            size="xs"
            name={icon}
            {...iconProps}
            className={cn('cn-tag-icon', { 'text-cn-disabled': disabled }, iconProps?.className)}
          />
        )}
        <span className={cn('cn-tag-text', { 'text-cn-disabled': disabled })} title={title || value || label}>
          {value || label}
        </span>

        {actionIcon && (
          <Button
            iconOnly
            disabled={disabled}
            rounded={rounded}
            className="cn-tag-action-icon-button"
            variant="transparent"
            size={size === 'sm' ? '3xs' : '2xs'}
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
              onActionClick?.()
            }}
          >
            <IconV2 skipSize name={actionIcon} className={cn('cn-tag-icon', { 'text-cn-disabled': disabled })} />
          </Button>
        )}
      </div>
    )
  }
)
Tag.displayName = 'Tag'

const TagSplit = forwardRef<HTMLDivElement, TagProps>(
  (
    {
      variant,
      size,
      theme,
      rounded,
      icon,
      actionIcon,
      onActionClick,
      value,
      label = '',
      disabled = false,
      enableHover = false,
      onClick,
      className,
      labelClassName,
      valueClassName
    },
    ref
  ) => {
    const sharedProps = { variant, size, theme, rounded, disabled, onClick }

    return (
      <div
        className={cn('cn-tag-split flex w-fit items-center justify-center', className, {
          'cursor-not-allowed': disabled,
          'cn-tag-split-hoverable': !disabled && enableHover
        })}
        ref={ref}
      >
        {/* LEFT TAG - should never have a Reset Icon */}
        <Tag {...sharedProps} icon={icon} value={label} className={cn('cn-tag-split-left', labelClassName)} />

        {/* RIGHT TAG - should never have a tag Icon */}
        <Tag
          {...sharedProps}
          actionIcon={actionIcon}
          onActionClick={onActionClick}
          value={value}
          className={cn('cn-tag-split-right', valueClassName)}
        />
      </div>
    )
  }
)
TagSplit.displayName = 'TagSplit'

export { Tag, type TagProps }
