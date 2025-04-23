import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva('w-fit transition-colors', {
  variants: {
    variant: {
      default: 'tag-default',
      label: 'tag-label',
      labelLeft: 'tag-label-left',
      labelRight: 'tag-label-right'
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
    variant: 'default',
    size: 'default',
    theme: 'gray'
  }
})

// Base props without theme-specific requirements
type TagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex' | 'aria-readonly'> & {
  variant?: VariantProps<typeof tagVariants>['variant']
  size?: VariantProps<typeof tagVariants>['size']
  theme?: VariantProps<typeof tagVariants>['theme']
}

function Tag({ className, size, theme, variant, children, ...props }: TagProps) {
  return (
    <div
      aria-readonly="true"
      tabIndex={-1}
      className={cn(
        tagVariants({
          variant,
          size,
          theme
        }),
        className
      )}
      {...props}
    >
      <Icon name="tag" />
      {children}
      <Button>
        <Icon name="close" className="font-xs" />
      </Button>
    </div>
  )
}

export { Tag, tagVariants }
