import { Button } from '@components/button'
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

// Base props without theme-specific requirements
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
  return keyName ? (
    <TagSplit
      variant={variant}
      size={size}
      theme={theme}
      rounded={rounded}
      icon={icon}
      showIcon={showIcon}
      showReset={showReset}
      onReset={onReset}
      keyName={keyName}
      value={value}
    />
  ) : (
    <div
      tabIndex={-1}
      className={cn(
        tagVariants({
          variant,
          size,
          theme
        }),
        keyName ? 'tag-split-right' : '',
        rounded ? 'tag-rounded' : '',
        'cursor-pointer',
        className
      )}
      {...props}
    >
      {!keyName && showIcon ? (
        <Icon
          name={icon || 'tag-new'}
          fill={getCSSVarValue(`--cn-set-${theme || 'gray'}-surface-text`)}
          width={getCSSVarValue('--icon-size-default') || '16px'}
          height={getCSSVarValue('--icon-size-default') || '16px'}
        />
      ) : null}
      {value}
      {showReset ? (
        <Icon
          name="close-new"
          fill={getCSSVarValue(`--cn-set-${theme || 'gray'}-surface-text`)}
          width={getCSSVarValue('--icon-size-xs') || '12px'}
          height={getCSSVarValue('--icon-size-xs') || '12px'}
          role="button"
          onClick={onReset}
        />
      ) : null}
    </div>
  )
}

function TagSplit(props: TagProps) {
  return (
    <div className="w-fit flex items-center justify-center cursor-pointer tag-split">
      <Tag
        variant={props.variant}
        size={props.size}
        theme={props.theme}
        rounded={props.rounded}
        icon={props.icon}
        showIcon={props.showIcon}
        showReset={false}
        value={props.keyName || ''}
        className={`tag-split-left pointer-events-none`}
      />
      <Tag
        variant={props.variant}
        size={props.size}
        theme={props.theme}
        rounded={props.rounded}
        icon={props.icon}
        showReset={props.showReset}
        onReset={props.onReset}
        value={props.value}
        showIcon={false}
        className={`tag-split-right pointer-events-none`}
      />
    </div>
  )
}

export { Tag }
