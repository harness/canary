import * as React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tabsListVariants = cva('inline-flex items-center text-foreground-4', {
  variants: {
    variant: {
      default: 'h-9 justify-center rounded-lg bg-muted p-1',
      underline: 'h-11 justify-center gap-4',
      /**
       * @deprecated Use TabNav component instead
       */
      navigation: '',
      tabnav:
        'relative flex w-full before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:bg-borders-1'
    },
    fontSize: {
      xs: 'text-12',
      sm: 'text-14'
    }
  },
  defaultVariants: {
    variant: 'default',
    fontSize: 'sm'
  }
})

const tabsTriggerVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap px-3 py-1 font-medium transition-all focus-visible:duration-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground-1',
  {
    variants: {
      variant: {
        default: 'rounded-md data-[state=active]:bg-background data-[state=active]:shadow',
        underline:
          'm-0 h-11 border-b-2 border-solid border-b-transparent px-0 font-normal data-[state=active]:border-primary',
        /**
         * @deprecated Use TabNav component instead
         */
        navigation: '',
        tabnav:
          'h-9 rounded-t-md border-x border-t border-transparent px-3.5 font-normal text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:bg-background-1 data-[state=active]:text-foreground-1'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const tabsContentVariants = cva(
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
        underline: '',
        /**
         * @deprecated Use TabNav component instead
         */
        navigation: '',
        tabnav: ''
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const TabsContext = React.createContext<VariantProps<typeof tabsListVariants | typeof tabsTriggerVariants>>({
  variant: 'default'
})

interface TabsRootProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsListVariants | typeof tabsTriggerVariants> {}

const TabsRoot = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsRootProps>(
  ({ children, variant, ...props }, ref) => (
    <TabsPrimitive.Root ref={ref} {...props}>
      <TabsContext.Provider value={{ variant }}>{children}</TabsContext.Provider>
    </TabsPrimitive.Root>
  )
)
TabsRoot.displayName = 'TabsRoot'

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, fontSize, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant: context.variant ?? variant, fontSize, className }))}
        {...props}
      />
    )
  }
)
TabsList.displayName = TabsPrimitive.List.displayName

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant: context.variant ?? variant, className }))}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    )
  }
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, variant, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    return (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(tabsContentVariants({ variant: context.variant ?? variant, className }))}
        {...props}
      />
    )
  }
)
TabsContent.displayName = TabsPrimitive.Content.displayName

const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
}

export { Tabs }
