import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva('tag', {
  variants: {
    variant: {
      outline: 'tag-outline',
      secondary: 'tag-secondary'
    },
    size: {
      default: '',
      sm: 'tag-sm'
    },
    theme: {
      gray: 'tag-gray',
      blue: 'tag-blue',
      brown: 'tag-brown',
      cyan: 'tag-cyan',
      green: 'tag-green',
      indigo: 'tag-indigo',
      lime: 'tag-lime',
      mint: 'tag-mint',
      orange: 'tag-orange',
      pink: 'tag-pink',
      purple: 'tag-purple',
      red: 'tag-red',
      violet: 'tag-violet',
      yellow: 'tag-yellow'
    },
    rounded: {
      true: 'tag-rounded'
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
  ...props
}: TagProps) {
  if (label) {
    return <TagSplit {...{ variant, size, theme, rounded, icon, showIcon, showReset, onReset, label: label, value }} />
  }

  return (
    <div tabIndex={-1} className={cn(tagVariants({ variant, size, theme, rounded }), className)} {...props}>
      {showIcon && <Icon skipSize name={icon || 'tag-2'} className="tag-icon" />}
      <span className="truncate" title={value}>
        {value}
      </span>
      {showReset && (
        <button onClick={onReset}>
          <Icon skipSize name="close-2" className="tag-reset-icon" />
        </button>
      )}
    </div>
  )
}

function TagSplit({ variant, size, theme, rounded, icon, showIcon, showReset, value, label = '', onReset }: TagProps) {
  const sharedProps = { variant, size, theme, rounded, icon }

  return (
    <div className="w-fit flex items-center justify-center cursor-pointer tag-split">
      {/* LEFT TAG - should never have a Reset Icon */}
      <Tag {...sharedProps} showIcon={showIcon} value={label} className="tag-split-left" />

      {/* RIGHT TAG - should never have a tag Icon */}
      <Tag {...sharedProps} showReset={showReset} onReset={onReset} value={value} className="tag-split-right" />
    </div>
  )
}

export { Tag }
