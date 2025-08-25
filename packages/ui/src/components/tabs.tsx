import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { CounterBadge } from '@/components/counter-badge'
import { IconPropsV2, IconV2 } from '@/components/icon-v2'
import { LogoPropsV2, LogoV2 } from '@/components/logo-v2'
import { NavLinkProps, useRouterContext } from '@/context'
import { afterFrames, getShadowActiveElement, useMergeRefs } from '@/utils'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const tabsListVariants = cva('cn-tabs-list', {
  variants: {
    variant: {
      underlined: 'cn-tabs-list-underlined',
      overlined: 'cn-tabs-list-overlined',
      ghost: 'cn-tabs-list-ghost',
      outlined: 'cn-tabs-list-outlined'
    }
  },
  defaultVariants: {
    variant: 'underlined'
  }
})

const tabsTriggerVariants = cva('cn-tabs-trigger', {
  variants: {
    variant: {
      underlined: 'cn-tabs-trigger-underlined',
      overlined: 'cn-tabs-trigger-overlined',
      ghost: 'cn-tabs-trigger-ghost',
      outlined: 'cn-tabs-trigger-outlined'
    }
  },
  defaultVariants: {
    variant: 'underlined'
  }
})

type TabsContextType = {
  type: 'tabs' | 'tabsnav'
  activeTabValue?: string
  onValueChange?: (value: string) => void
}

const TabsContext = createContext<TabsContextType>({ type: 'tabs' })

interface TabsProps {
  children: ReactNode
  onValueChange?: (value: string) => void
  value?: string
  defaultValue?: string
  className?: string
}

const useManageActiveTabValue = ({
  type,
  value,
  defaultValue,
  onValueChange
}: Partial<TabsProps> & { type: TabsContextType['type'] }) => {
  const [activeTabValue, setActiveTabValue] = useState<string | undefined>(value ?? defaultValue)

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue)
    if (type === 'tabsnav' && value !== undefined) return
    setActiveTabValue(newValue)
  }

  useEffect(() => {
    if (value !== undefined) {
      setActiveTabValue(value)
    }
  }, [value])

  return { activeTabValue, handleValueChange }
}

const TabsRoot = ({ children, onValueChange, value, defaultValue, className }: TabsProps) => {
  const { activeTabValue, handleValueChange } = useManageActiveTabValue({
    type: 'tabs',
    value,
    defaultValue,
    onValueChange
  })

  return (
    <TabsContext.Provider value={{ type: 'tabs', activeTabValue, onValueChange: handleValueChange }}>
      <TabsPrimitive.Root
        className={className}
        onValueChange={handleValueChange}
        value={value}
        defaultValue={defaultValue}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  )
}

const TabsNavRoot = ({ children }: TabsProps) => {
  return <TabsContext.Provider value={{ type: 'tabsnav' }}>{children}</TabsContext.Provider>
}

const TabsListContext = createContext<VariantProps<typeof tabsListVariants> & { activeClassName?: string }>({
  variant: 'underlined'
})

interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  activeClassName?: string
}

const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, children, variant, activeClassName, ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement | null>(null)
    const { type } = useContext(TabsContext)

    const mergedRef = useMergeRefs<HTMLDivElement>([
      node => {
        if (!node) return

        contentRef.current = node
      },
      ref
    ])

    /**
     * !!! This code is executed only when inside a ShadowRoot
     *
     * For correct focus on the active tab when navigating through tabs using the Tab key
     */
    const handleFocusCapture = (e: FocusEvent<HTMLDivElement>) => {
      props?.onFocusCapture?.(e)
      if (e.defaultPrevented) return

      const rootEl = contentRef.current
      if (!rootEl) return

      const { isShadowRoot } = getShadowActiveElement(rootEl)
      if (!isShadowRoot) return

      if (e.currentTarget.contains(e.relatedTarget as Node)) return

      const active = rootEl.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      afterFrames(() => active?.focus())
    }

    /**
     * !!! This code is executed only when inside a ShadowRoot
     *
     * To navigate between tabs using the left and right arrow keys
     */
    const handleKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
      props?.onKeyDownCapture?.(e)

      if (e.defaultPrevented) return
      const rootEl = contentRef.current
      if (!rootEl) return

      const { isShadowRoot, activeEl } = getShadowActiveElement(rootEl)
      if (!isShadowRoot) return

      const isPrev = e.key === 'ArrowLeft'
      const isNext = e.key === 'ArrowRight'
      if (!isPrev && !isNext) return

      const triggers = Array.from(rootEl.querySelectorAll<HTMLElement>('[role="tab"]:not([data-disabled])'))
      if (!triggers.length) return

      let i = Math.max(
        0,
        triggers.findIndex(el => el === activeEl || (activeEl && el.contains(activeEl)))
      )

      i = (i + (isNext ? 1 : -1) + triggers.length) % triggers.length

      e.preventDefault()
      e.stopPropagation()

      const next = triggers[i]
      next.focus()
      next.click()
    }

    return (
      <TabsListContext.Provider value={{ activeClassName, variant }}>
        {type === 'tabs' && (
          <TabsPrimitive.List
            ref={mergedRef}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
            onFocusCapture={handleFocusCapture}
            onKeyDownCapture={handleKeyDownCapture}
          >
            {children}
          </TabsPrimitive.List>
        )}

        {type === 'tabsnav' && (
          <nav ref={mergedRef} className={cn(tabsListVariants({ variant }), className)} {...props}>
            {children}
          </nav>
        )}
      </TabsListContext.Provider>
    )
  }
)
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerBaseProps {
  value: string
  children?: ReactNode
  className?: string
  counter?: number | null
}

interface TabsTriggerBasePropsWithIcon extends TabsTriggerBaseProps {
  icon?: IconPropsV2['name']
  logo?: never
}

interface TabsTriggerBasePropsWithLogo extends TabsTriggerBaseProps {
  icon?: never
  logo?: LogoPropsV2['name']
}

type TabsTriggerExtendedProps = (TabsTriggerBasePropsWithIcon | TabsTriggerBasePropsWithLogo) & {
  disabled?: boolean
}

type TabsTriggerButtonProps = TabsTriggerExtendedProps &
  Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, keyof TabsTriggerExtendedProps>

type TabsTriggerLinkProps = TabsTriggerExtendedProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof TabsTriggerExtendedProps | 'href'> & {
    linkProps?: Omit<NavLinkProps, 'to'>
    disabled?: boolean
  }

export type TabsTriggerProps = TabsTriggerButtonProps | TabsTriggerLinkProps

interface TabsTriggerComponent {
  (props: TabsTriggerButtonProps & { ref?: Ref<HTMLButtonElement> }): JSX.Element
  (props: TabsTriggerLinkProps): JSX.Element
  displayName?: string
}

const TabsTrigger = forwardRef<HTMLButtonElement | HTMLAnchorElement, TabsTriggerProps>((props, ref) => {
  const { className, children, value, icon, logo, counter, ...restProps } = props
  const { variant, activeClassName } = useContext(TabsListContext)
  const { type, activeTabValue, onValueChange } = useContext(TabsContext)
  const { NavLink } = useRouterContext()

  const iconSize = variant === 'ghost' || variant === 'outlined' ? 'xs' : 'sm'
  const logoSize: LogoPropsV2['size'] = variant === 'ghost' || variant === 'outlined' ? 'md' : 'sm'

  const TabTriggerContent = () => (
    <>
      {!!icon && <IconV2 size={iconSize} name={icon} />}
      {!!logo && <LogoV2 size={logoSize} name={logo} />}
      {children}
      {Number.isInteger(counter) && <CounterBadge>{counter}</CounterBadge>}
    </>
  )

  if (type === 'tabsnav') {
    const { linkProps, disabled, ..._restProps } = restProps as TabsTriggerLinkProps

    const handleClick = (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onValueChange?.(value)
    }

    return (
      <NavLink
        role="tab"
        to={value}
        onClick={handleClick}
        aria-disabled={disabled}
        className={({ isActive }) => {
          return cn(
            tabsTriggerVariants({ variant }),
            { 'cn-tabs-trigger-active': isActive, [activeClassName ?? '']: isActive },
            className
          )
        }}
        {...(linkProps as Omit<NavLinkProps, 'to' | 'className'>)}
        {...(_restProps as Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'>)}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        <TabTriggerContent />
      </NavLink>
    )
  }

  const isTabActive = activeTabValue === value

  return (
    <TabsPrimitive.Trigger
      ref={ref as Ref<HTMLButtonElement>}
      value={value}
      className={cn(
        tabsTriggerVariants({ variant }),
        { 'cn-tabs-trigger-active': isTabActive, [activeClassName ?? '']: isTabActive },
        className
      )}
      {...(restProps as Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, 'value'>)}
    >
      <TabTriggerContent />
    </TabsPrimitive.Trigger>
  )
}) as TabsTriggerComponent

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

interface TabsContentProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

const TabsContent = forwardRef<ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...props }, ref) => {
    const { type } = useContext(TabsContext)

    if (type === 'tabsnav') {
      return <div ref={ref} className={cn('cn-tabs-content', className)} {...props} />
    }

    return <TabsPrimitive.Content ref={ref} className={cn('cn-tabs-content', className)} {...props} />
  }
)
TabsContent.displayName = TabsPrimitive.Content.displayName

const Tabs = {
  Root: TabsRoot,
  NavRoot: TabsNavRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
}

export { Tabs }
