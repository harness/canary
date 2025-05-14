import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva('cn-tag', {
  variants: {
    variant: {
      outline: 'cn-tag-outline',
      secondary: 'cn-tag-secondary'
    },
    size: {
      default: '',
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
    size: 'default',
    theme: 'gray'
  }
})

type TagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex'> & {
  variant?: VariantProps<typeof tagVariants>['variant']
  size?: VariantProps<typeof tagVariants>['size']
  theme?: VariantProps<typeof tagVariants>['theme']
  rounded?: boolean
  icon?: React.ComponentProps<typeof Icon>['name']
  showIcon?: boolean
  showReset?: boolean
  onReset?: () => void
  label?: string
  value: string
  disabled?: boolean
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
  ...props
}: TagProps) {
  if (label && value) {
    return (
      <TagSplit
        {...{ variant, size, theme, rounded, icon, showIcon, showReset, onReset, label: label, value, disabled }}
      />
    )
  }

  return (
    <div
      tabIndex={-1}
      className={cn(
        tagVariants({ variant, size, theme, rounded }),
        { 'text-cn-foreground-disabled cursor-not-allowed': disabled },
        className
      )}
      {...props}
    >
      {showIcon && (
        <Icon
          skipSize
          name={icon || 'tag-2'}
          className={cn('cn-tag-icon', { 'text-cn-foreground-disabled': disabled })}
        />
      )}
      <span className={cn('cn-tag-text', { 'text-cn-foreground-disabled': disabled })} title={value || label}>
        {value || label}
      </span>
      {showReset && !disabled && (
        <button onClick={onReset}>
          <Icon skipSize name="close-2" className="cn-tag-reset-icon" />
        </button>
      )}
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
  disabled = false
}: TagProps) {
  const sharedProps = { variant, size, theme, rounded, icon, disabled }

  return (
    <div className={cn('cn-tag-split flex w-fit items-center justify-center', { 'cursor-not-allowed': disabled })}>
      {/* LEFT TAG - should never have a Reset Icon */}
      <Tag {...sharedProps} showIcon={showIcon} value={label} className="cn-tag-split-left" />

      {/* RIGHT TAG - should never have a tag Icon */}
      <Tag {...sharedProps} showReset={showReset} onReset={onReset} value={value} className="cn-tag-split-right" />
    </div>
  )
}

export { Tag }
