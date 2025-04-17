import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva('tag inline-flex w-fit items-center transition-colors', {
  variants: {
    variant: {
      surface: 'tag-surface'
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
    variant: 'surface',
    size: 'default',
    theme: 'gray'
  }
})

// Base props without theme-specific requirements
type TagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex' | 'aria-readonly'> & {
  size?: 'default' | 'sm'
  theme: VariantProps<typeof tagVariants>['theme']
}

function Tag({ className, size, theme, children, ...props }: TagProps) {
  return (
    <div
      aria-readonly="true"
      tabIndex={-1}
      className={cn(
        tagVariants({
          size,
          theme
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tag, tagVariants }
