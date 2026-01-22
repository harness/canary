import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'

import { Text } from '@/components/text'
import { usePortal } from '@/context'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@utils/cn'

import { Illustration } from './illustration'
import { Link, LinkProps } from './link'

const PopoverRoot = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger
type PopoverTriggerProps = PopoverPrimitive.PopoverTriggerProps

const PopoverAnchor = PopoverPrimitive.Anchor

interface PopoverContentProps extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  title?: string
  description?: string
  linkProps?: Omit<LinkProps, 'children'> & { text: string }
  hideArrow?: boolean
  noMaxWidth?: boolean
  /**
   * Theme variant of the popover
   * - 'default': High-contrast appearance with fixed colors
   * - 'themed': Follows the current theme's color palette
   * @default 'themed'
   */
  theme?: 'default' | 'themed'
  /**
   * Custom content mode - removes padding and min-width
   * @default false
   */
  custom?: boolean
}

const PopoverContent = forwardRef<ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  (
    {
      className,
      children,
      title,
      description,
      linkProps,
      hideArrow = false,
      align = 'center',
      sideOffset = 4,
      noMaxWidth = false,
      theme = 'themed',
      custom = false,
      style,
      ...props
    },
    ref
  ) => {
    const { portalContainer } = usePortal()

    const contentClass = custom
      ? theme === 'default'
        ? 'cn-popover-content-custom-default'
        : 'cn-popover-content-custom'
      : theme === 'default'
        ? 'cn-popover-content-default'
        : 'cn-popover-content'

    return (
      <PopoverPrimitive.Portal container={portalContainer}>
        <PopoverPrimitive.Content
          className={cn(
            contentClass,
            'animate-in fade-in-50 zoom-in-97 duration-150 ease-out',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-97',
            'data-[side=bottom]:slide-in-from-top-slide-offset',
            'data-[side=left]:slide-in-from-right-slide-offset',
            'data-[side=right]:slide-in-from-left-slide-offset',
            'data-[side=top]:slide-in-from-bottom-slide-offset',
            { 'cn-popover-content-max-size': !noMaxWidth && !custom },
            className
          )}
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          style={style}
          {...props}
        >
          {(title || description) && (
            <div className="gap-cn-3xs grid">
              {title && (
                <Text variant="body-strong" color="foreground-1" as="h4">
                  {title}
                </Text>
              )}

              {description && <Text>{description}</Text>}
            </div>
          )}

          {children}

          {linkProps?.text && <Link {...(linkProps as LinkProps)}>{linkProps.text}</Link>}

          {!hideArrow && (
            <PopoverPrimitive.Arrow width={20} height={8} asChild>
              <Illustration className="cn-popover-arrow" name="tooltip-arrow" />
            </PopoverPrimitive.Arrow>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    )
  }
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

type TriggerType = 'click' | 'hover'

interface PopoverProps
  extends PropsWithChildren<Omit<PopoverContentProps, 'children' | 'content' | 'onCloseAutoFocus'>>,
    Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>, 'children' | 'modal'> {
  content: ReactNode
  triggerType?: TriggerType
  hoverDelay?: number
  closeDelay?: number
  noMaxWidth?: boolean
}

const PopoverComponent = ({
  children,
  content,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  triggerType = 'click',
  hoverDelay = 200,
  closeDelay = 300,
  noMaxWidth,
  theme,
  custom,
  ...props
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen || false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    hoverTimeoutRef.current = setTimeout(() => {
      handleOpenChange(true)
    }, hoverDelay)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      handleOpenChange(false)
    }, closeDelay)
  }

  const evenTriggerProps =
    triggerType === 'hover'
      ? {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        }
      : {}

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      {/* This button is used to programmatically focus the trigger element after closing a popover */}
      <button ref={triggerRef} className="sr-only" aria-hidden="true" tabIndex={-1} />
      <Popover.Trigger {...evenTriggerProps} asChild>
        {children}
      </Popover.Trigger>
      <Popover.Content
        {...evenTriggerProps}
        onOpenAutoFocus={(e: Event) => {
          e.preventDefault()
        }}
        onCloseAutoFocus={(e: Event) => {
          e.preventDefault()
          triggerRef.current?.focus()
        }}
        noMaxWidth={noMaxWidth}
        theme={theme}
        custom={custom}
        {...props}
      >
        {content}
      </Popover.Content>
    </Popover.Root>
  )
}

const Popover = Object.assign(PopoverComponent, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Anchor: PopoverAnchor
})

export { Popover, PopoverTriggerProps }
