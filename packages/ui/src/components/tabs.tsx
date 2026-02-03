import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import type { NavLinkRenderProps } from 'react-router-dom'

import { motion } from 'framer-motion'

import { CounterBadge } from '@/components/counter-badge'
import { IconPropsV2, IconV2 } from '@/components/icon-v2'
import { LogoPropsV2, LogoSymbol, LogoV2, SymbolNamesType } from '@/components/logo-v2'
import { NavLinkProps, useRouterContext } from '@/context'
import { afterFrames, cn, getShadowActiveElement, useMergeRefs } from '@/utils'
import * as TabsPrimitive from '@radix-ui/react-tabs'
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
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const { type, activeTabValue } = useContext(TabsContext)
    const [showLeftFade, setShowLeftFade] = useState(false)
    const [showRightFade, setShowRightFade] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null)

    const mergedRef = useMergeRefs<HTMLDivElement>([
      node => {
        if (!node) return

        contentRef.current = node
      },
      ref
    ])

    const checkOverflow = useRef(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const hasOverflow = container.scrollWidth > container.clientWidth
      setIsOverflowing(hasOverflow)
    })

    const updateFadeIndicators = useRef(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const { scrollLeft, scrollWidth, clientWidth } = container
      const scrollableWidth = scrollWidth - clientWidth

      setShowLeftFade(scrollLeft > 5)
      setShowRightFade(scrollLeft < scrollableWidth - 5)
    })

    const scrollActiveTabIntoView = useRef(() => {
      const container = scrollContainerRef.current
      const contentEl = contentRef.current
      if (!container || !contentEl) return

      const activeTab = contentEl.querySelector<HTMLElement>('[role="tab"].cn-tabs-trigger-active')
      if (!activeTab) return

      const containerRect = container.getBoundingClientRect()
      const activeTabRect = activeTab.getBoundingClientRect()

      const isVisible = activeTabRect.left >= containerRect.left && activeTabRect.right <= containerRect.right

      if (!isVisible) {
        const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    })

    const updateIndicator = useCallback(() => {
      if (variant && variant !== 'underlined') return

      const contentEl = contentRef.current
      if (!contentEl) return

      const activeTab = contentEl.querySelector<HTMLElement>(
        '[role="tab"][data-state="active"], [role="tab"].cn-tabs-trigger-active, [role="tab"][aria-current="page"]'
      )

      if (!activeTab) {
        setIndicatorStyle(null)
        return
      }

      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth
      })
    }, [variant])

    useEffect(() => {
      scrollActiveTabIntoView.current()
      updateIndicator()
    }, [activeTabValue, updateIndicator])

    useEffect(() => {
      const container = scrollContainerRef.current
      const contentEl = contentRef.current
      if (!container || !contentEl) return

      checkOverflow.current()
      updateFadeIndicators.current()
      scrollActiveTabIntoView.current()
      updateIndicator()

      const handleScroll = () => {
        updateFadeIndicators.current()
      }

      const resizeObserver = new ResizeObserver(() => {
        checkOverflow.current()
        updateFadeIndicators.current()
        updateIndicator()
      })

      const mutationObserver = new MutationObserver(() => {
        scrollActiveTabIntoView.current()
        updateIndicator()
      })

      container.addEventListener('scroll', handleScroll, { passive: true })
      resizeObserver.observe(container)

      const triggers = contentEl.querySelectorAll('[role="tab"]')
      triggers.forEach(trigger => {
        mutationObserver.observe(trigger, {
          attributes: true,
          attributeFilter: ['class']
        })
      })

      return () => {
        container.removeEventListener('scroll', handleScroll)
        resizeObserver.disconnect()
        mutationObserver.disconnect()
      }
    }, [updateIndicator])

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

    const listContent = (
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
            {(!variant || variant === 'underlined') && indicatorStyle && (
              <motion.div
                className="cn-tabs-indicator"
                initial={false}
                animate={{
                  x: indicatorStyle.left,
                  width: indicatorStyle.width
                }}
                transition={{
                  type: 'tween',
                  ease: 'easeOut',
                  duration: 0.2
                }}
              />
            )}
          </TabsPrimitive.List>
        )}

        {type === 'tabsnav' && (
          <nav ref={mergedRef} className={cn(tabsListVariants({ variant }), className)} {...props}>
            {children}
            {(!variant || variant === 'underlined') && indicatorStyle && (
              <motion.div
                className="cn-tabs-indicator"
                initial={false}
                animate={{
                  x: indicatorStyle.left,
                  width: indicatorStyle.width
                }}
                transition={{
                  type: 'tween',
                  ease: 'easeOut',
                  duration: 0.2
                }}
              />
            )}
          </nav>
        )}
      </TabsListContext.Provider>
    )

    return (
      <div className="cn-tabs-scroll-container">
        {isOverflowing && showLeftFade && <div className="cn-tabs-fade cn-tabs-fade-left" />}
        <div ref={scrollContainerRef} className="cn-tabs-scroll-wrapper">
          {listContent}
        </div>
        {isOverflowing && showRightFade && <div className="cn-tabs-fade cn-tabs-fade-right" />}
      </div>
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
  symbol?: never
}

interface TabsTriggerBasePropsWithLogo extends TabsTriggerBaseProps {
  icon?: never
  logo?: LogoPropsV2['name']
  symbol?: never
}

interface TabsTriggerBasePropsWithSymbol extends TabsTriggerBaseProps {
  icon?: never
  logo?: never
  symbol?: SymbolNamesType
}

type TabsTriggerExtendedProps = (TabsTriggerBasePropsWithIcon | TabsTriggerBasePropsWithLogo | TabsTriggerBasePropsWithSymbol) & {
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
  const { className, children, value, icon, logo, symbol, counter, ...restProps } = props
  const { variant, activeClassName } = useContext(TabsListContext)
  const { type, activeTabValue, onValueChange } = useContext(TabsContext)
  const { NavLink, isRouterVersion5 } = useRouterContext()

  const TabTriggerContent = () => (
    <>
      {!!icon && <IconV2 size="sm" name={icon} />}
      {!!logo && <LogoV2 size="xs" name={logo} />}
      {!!symbol && <LogoSymbol size="xs" name={symbol} />}
      {children}
      {Number.isInteger(counter) && <CounterBadge>{counter}</CounterBadge>}
    </>
  )

  if (type === 'tabsnav') {
    const { linkProps, disabled, ..._restProps } = restProps as TabsTriggerLinkProps

    const handleClick = (e: MouseEvent) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onValueChange?.(value)
    }

    const versionsProps = isRouterVersion5
      ? {
          activeClassName: `cn-tabs-trigger-active ${activeClassName ?? ''}`,
          className: cn(tabsTriggerVariants({ variant }), className)
        }
      : {
          className: ({ isActive }: NavLinkRenderProps) => {
            return cn(
              tabsTriggerVariants({ variant }),
              { 'cn-tabs-trigger-active': isActive, [activeClassName ?? '']: isActive },
              className
            )
          }
        }

    return (
      <NavLink
        role="tab"
        to={value}
        onClick={handleClick}
        aria-disabled={disabled}
        {...versionsProps}
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

    return <TabsPrimitive.Content ref={ref} className={cn('cn-tabs-content', className)} {...props} tabIndex={-1} />
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
