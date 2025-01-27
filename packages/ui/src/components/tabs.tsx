import * as React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tabsListVariants = cva('text-foreground-4 inline-flex items-center', {
  variants: {
    variant: {
      default: 'bg-muted h-9 justify-center rounded-lg p-1',
      underline: 'h-11 justify-center gap-4',
      navigation: 'border-borders-5 h-[44px] w-full justify-start gap-6 border-b px-6',
      tabnav:
        'before:bg-borders-1 relative flex w-full before:absolute before:bottom-0 before:left-0 before:h-px before:w-full'
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
  'data-[state=active]:text-foreground-1 group relative inline-flex items-center justify-center whitespace-nowrap px-3 py-1 font-medium transition-all focus-visible:duration-0 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-background rounded-md data-[state=active]:shadow',
        underline:
          'data-[state=active]:border-primary m-0 h-11 border-b-2 border-solid border-b-transparent px-0 font-normal',
        navigation:
          'text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-9 m-0 -mb-px h-[44px] border-b border-solid border-b-transparent px-0 font-normal duration-150 ease-in-out',
        tabnav:
          'text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:bg-background-1 data-[state=active]:text-foreground-1 h-[36px] rounded-t-md border-x border-t border-transparent px-3.5 font-normal'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const tabsContentVariants = cva(
  'ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
        underline: '',
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

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsListVariants | typeof tabsTriggerVariants> {}

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ children, variant, ...props }, ref) => (
    <TabsPrimitive.Root ref={ref} {...props}>
      <TabsContext.Provider value={{ variant }}>{children}</TabsContext.Provider>
    </TabsPrimitive.Root>
  )
)
Tabs.displayName = 'Tabs'
interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, fontSize, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          tabsListVariants({
            variant: context.variant ?? variant,
            fontSize,
            className
          })
        )}
        {...props}
      />
    )
  }
)
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps
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
        {context.variant === 'navigation' && (
          <span className="bg-tab-gradient-radial absolute left-1/2 top-1/2 -z-10 hidden h-[calc(100%+40px)] w-[calc(100%+60px)] -translate-x-1/2 -translate-y-1/2 group-data-[state=active]:block" />
        )}
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

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsListProps, TabsProps }
