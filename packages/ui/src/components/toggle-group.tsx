import * as React from 'react'

import { toggleVariants } from '@/components'
import { useTheme } from '@/context'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'

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
  ({ className, variant, size, children, value, ...props }, ref) => (
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
      <ToggleGroupContext.Provider value={{ variant, size, value }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
)

ToggleGroupRoot.displayName = ToggleGroupPrimitive.Root.displayName

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>

const ToggleGroupItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, ToggleGroupItemProps>(
  ({ className, children, variant, size, value, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    const { isLightTheme } = useTheme()

    // Check if this item is active
    const isActive =
      context.value === value || (Array.isArray(context.value) && context.value.includes(value as string))

    return (
      <motion.div className="relative">
        <ToggleGroupPrimitive.Item
          ref={ref}
          value={value}
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
        {isActive && (
          <motion.div
            layoutId={value}
            transition={{ duration: 0.2 }}
            // transition={{ type: 'spring', bounce: 0.6 }}
            className="bg-cn-background-hover absolute inset-0 size-full"
          />
        )}
      </motion.div>
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
