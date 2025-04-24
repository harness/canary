import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { getCSSVarValue } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva('w-fit transition-colors', {
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
  keyName?: string
  value: string
}

function Tag({
  variant,
  size,
  theme,
  rounded,
  icon,
  showIcon,
  showReset,
  onReset,
  keyName,
  value,
  className,
  ...props
}: TagProps) {
  if (keyName) {
    return <TagSplit {...{ variant, size, theme, rounded, icon, showIcon, showReset, onReset, keyName, value }} />
  }

  const fillColor = getCSSVarValue(`--cn-set-${theme || 'gray'}-surface-text`)
  const baseIconProps = {
    fill: fillColor,
    width: getCSSVarValue('--icon-size-default') || '16px',
    height: getCSSVarValue('--icon-size-default') || '16px'
  }
  const resetIconProps = {
    fill: fillColor,
    width: getCSSVarValue('--icon-size-xs') || '12px',
    height: getCSSVarValue('--icon-size-xs') || '12px'
  }

  return (
    <div
      tabIndex={-1}
      className={cn(tagVariants({ variant, size, theme }), rounded && 'tag-rounded', 'cursor-pointer', className)}
      {...props}
    >
      {showIcon && <Icon name={icon || 'tag-new'} {...baseIconProps} />}
      {value}
      {showReset && <Icon name="close-new" {...resetIconProps} role="button" onClick={onReset} />}
    </div>
  )
}

function TagSplit(props: TagProps) {
  const sharedProps = {
    variant: props.variant,
    size: props.size,
    theme: props.theme,
    rounded: props.rounded,
    icon: props.icon
  }

  return (
    <div className="w-fit flex items-center justify-center cursor-pointer tag-split">
      <Tag
        {...sharedProps}
        showReset={false}
        showIcon={props.showIcon}
        value={props.keyName || ''}
        className="tag-split-left pointer-events-none"
      />
      <Tag
        {...sharedProps}
        showIcon={false}
        showReset={props.showReset}
        onReset={props.onReset}
        value={props.value}
        className="tag-split-right pointer-events-none"
      />
    </div>
  )
}

export { Tag }
