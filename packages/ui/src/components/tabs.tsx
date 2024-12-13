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
      // TODO: Refactor - merge tabnav and branch variants
      // tabnav is used in existing components and has conflicting styles
      // Future steps:
      // 1. Analyze all tabnav usage locations
      // 2. Create a unified variant based on branch
      // 3. Update existing components
      tabnav: 'h-[36px] w-full justify-start gap-0',
      branch: 'border-borders-1 flex w-full border-b px-3'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const tabsTriggerVariants = cva(
  'data-[state=active]:text-foreground-1 group relative inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-background rounded-md data-[state=active]:shadow',
        underline:
          'data-[state=active]:border-primary m-0 h-11 border-b-2 border-solid border-b-transparent px-0 font-normal',
        navigation:
          'text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-9 m-0 -mb-px h-[44px] border-b border-solid border-b-transparent px-0 text-xs font-normal duration-150 ease-in-out',
        tabnav:
          'bg-background text-tertiary-background tabnav-inactive hover:text-foreground-1 data-[state=active]:tabnav-active [&svg]:data-[state=active]:text-icons-2 m-0 h-[36px] items-center gap-2 rounded-t-md px-4 text-sm font-normal duration-150 ease-in-out',
        branch:
          'text-foreground-2 hover:text-foreground-1 data-[state=active]:border-borders-1 data-[state=active]:text-foreground-1 -mb-px h-[34px] rounded-t-md border-x border-t border-transparent px-3.5 font-normal'
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
        tabnav: '',
        branch: ''
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
      <TabsContext.Provider value={{ variant }}>
        {variant === 'tabnav' ? (
          <div className="relative grid w-full grid-flow-col grid-cols-[auto_1fr] items-end">
            {children}
            <div className="border-border-background h-[36px] border-b" />
            <div className="border-border-background absolute right-full h-[36px] w-[9999px] border-b" />
            <div className="border-border-background absolute left-full h-[36px] w-[9999px] border-b" />
          </div>
        ) : (
          children
        )}
      </TabsContext.Provider>
    </TabsPrimitive.Root>
  )
)
Tabs.displayName = 'Tabs'
interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          tabsListVariants({
            variant: context.variant ?? variant,
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
          <span className="bg-tab-gradient-radial absolute -inset-x-[30px] -inset-y-5 hidden group-data-[state=active]:block" />
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
