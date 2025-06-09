import * as React from 'react'

import { useTheme } from '@/context'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

// TODO: Temporarily moved toggleVariants out of the Toggle component. To be removed when migrating the component to the new design system.
const toggleVariants = cva(
  `inline-flex items-center justify-center text-2 font-medium text-cn-foreground-2 
  transition-colors 
  hover:text-cn-foreground-2 disabled:pointer-events-none 
  disabled:opacity-50 data-[state=on]:text-cn-foreground-1`,
  {
    variants: {
      variant: {
        default: 'rounded bg-transparent',
        outline:
          'rounded border border-cn-borders-2 bg-transparent shadow-sm hover:bg-cn-background-3 hover:text-cn-foreground-1',
        compact: ''
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
        xs: 'h-6 px-[1.125rem]',
        icon: 'size-8'
      },
      theme: {
        light: 'data-[state=on]:bg-cn-background-1',
        dark: 'data-[state=on]:bg-cn-background-hover'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      theme: 'dark'
    }
  }
)

const toggleGroupVariants = cva('flex items-center justify-center gap-1', {
  variants: {
    variant: {
      default: '',
      outline: '',
      compact: 'gap-0 divide-x rounded border'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants | typeof toggleVariants>>({
  size: 'default',
  variant: 'default'
})

type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants | typeof toggleVariants>

const ToggleGroupRoot = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(
        toggleGroupVariants({
          variant: variant
        }),
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
)

ToggleGroupRoot.displayName = ToggleGroupPrimitive.Root.displayName

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>

const ToggleGroupItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, ToggleGroupItemProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    const { isLightTheme } = useTheme()

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
            theme: isLightTheme ? 'light' : 'dark'
          }),
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    )
  }
)

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem
}

export { ToggleGroup }
export type { ToggleGroupProps, ToggleGroupItemProps }
