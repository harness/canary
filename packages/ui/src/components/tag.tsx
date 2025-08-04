import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { CopyButton, CopyButtonProps } from './copy-button'
import { IconNameMapV2, IconV2 } from './icon-v2'

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
  icon?: keyof typeof IconNameMapV2
  showIcon?: boolean
  showReset?: boolean
  onReset?: () => void
  label?: string
  value: string
  disabled?: boolean
  showCopyButton?: boolean
  title?: string
  enableHover?: boolean
}

function Tag({
  variant,
  size,
  theme,
  rounded,
  icon,
  onReset,
  label,
  value,
  className,
  showReset = false,
  showIcon = false,
  disabled = false,
  showCopyButton = false,
  enableHover = false,
  title,
  ...props
}: TagProps) {
  if (label && value) {
    return (
      <TagSplit
        {...{
          variant,
          size,
          theme,
          rounded,
          icon,
          showIcon,
          showReset,
          onReset,
          label: label,
          value,
          disabled,
          enableHover: enableHover || !!onReset
        }}
      />
    )
  }

  return (
    <div
      tabIndex={-1}
      className={cn(
        tagVariants({ variant, size, theme, rounded }),
        {
          'text-cn-foreground-disabled cursor-not-allowed': disabled,
          'cn-tag-hoverable': !disabled && (enableHover || !!onReset),
          'pr-0': showCopyButton
        },
        className
      )}
      {...props}
    >
      {showIcon && (
        <IconV2
          size="sm"
          name={icon || 'label'}
          className={cn('cn-tag-icon', { 'text-cn-foreground-disabled': disabled })}
        />
      )}
      <span className={cn('cn-tag-text', { 'text-cn-foreground-disabled': disabled })} title={title || value || label}>
        {value || label}
      </span>
      {showReset && !disabled && (
        <button onClick={onReset}>
          <IconV2 size="xs" name="xmark" className="cn-tag-icon" />
        </button>
      )}
      {showCopyButton ? (
        <CopyButton
          name={value || label || ''}
          iconOnly
          buttonVariant="transparent"
          className="cn-tag-icon"
          // @TODO: sync with design team to get the righ tokens for the copy button
          color={theme as CopyButtonProps['color']}
          size="xs"
          iconSize="2xs"
        />
      ) : null}
    </div>
  )
}

function TagSplit({
  variant,
  size,
  theme,
  rounded,
  icon,
  showIcon,
  showReset,
  value,
  label = '',
  onReset,
  disabled = false,
  enableHover = false
}: TagProps) {
  const sharedProps = { variant, size, theme, rounded, icon, disabled }

  return (
    <div
      className={cn('cn-tag-split flex w-fit items-center justify-center', {
        'cursor-not-allowed': disabled,
        'cn-tag-split-hoverable': !disabled && enableHover
      })}
    >
      {/* LEFT TAG - should never have a Reset Icon */}
      <Tag {...sharedProps} showIcon={showIcon} value={label} className="cn-tag-split-left" />

      {/* RIGHT TAG - should never have a tag Icon */}
      <Tag {...sharedProps} showReset={showReset} onReset={onReset} value={value} className="cn-tag-split-right" />
    </div>
  )
}

export { Tag, type TagProps }
