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
      style,
      ...props
    },
    ref
  ) => {
    const { portalContainer } = usePortal()

    return (
      <PopoverPrimitive.Portal container={portalContainer}>
        <PopoverPrimitive.Content
          className={cn('cn-popover-content', { 'cn-popover-content-max-size': !noMaxWidth }, className)}
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
