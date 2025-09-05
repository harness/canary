import { ComponentPropsWithoutRef, ElementRef, forwardRef, PropsWithChildren, ReactNode, useState } from 'react'

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
      ...props
    },
    ref
  ) => {
    const { portalContainer } = usePortal()

    return (
      <PopoverPrimitive.Portal container={portalContainer}>
        <PopoverPrimitive.Content
          className={cn('cn-popover-content', className)}
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          {...props}
        >
          {(title || description) && (
            <div className="grid gap-1">
              {title && (
                <Text variant="body-strong" color="foreground-1" as="h4">
                  {title}
                </Text>
              )}

              {description && <Text>{description}</Text>}
            </div>
          )}

          {children}

          {linkProps?.text && <Link {...linkProps}>{linkProps.text}</Link>}

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
  extends PropsWithChildren<Omit<PopoverContentProps, 'children' | 'content'>>,
    Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>, 'children' | 'modal'> {
  content: ReactNode
  triggerType?: TriggerType
  hoverDelay?: number
  closeDelay?: number
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
  ...props
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen || false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }

    // Set timeout to open the popover
    const timeout = setTimeout(() => {
      handleOpenChange(true)
    }, hoverDelay)

    setHoverTimeout(timeout)
  }

  const handleMouseLeave = () => {
    // Clear any pending open timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }

    // Set timeout to close the popover
    const timeout = setTimeout(() => {
      handleOpenChange(false)
    }, closeDelay)

    setCloseTimeout(timeout)
  }

  const triggerProps =
    triggerType === 'hover'
      ? {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        }
      : {}

  const contentProps =
    triggerType === 'hover'
      ? {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        }
      : {}

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger {...triggerProps} asChild>
        {children}
      </Popover.Trigger>
      <Popover.Content {...contentProps} {...props}>
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
