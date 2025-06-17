import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Text } from '@/components/text'
import { usePortal } from '@/context'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@utils/cn'

import { Illustration } from './illustration'
import { Link, LinkProps } from './link'

const PopoverRoot = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

interface PopoverContentProps extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  title?: string
  description?: string
  linkProps?: Omit<LinkProps, 'children'> & { text: string }
  showArrow?: boolean
}

const PopoverContent = forwardRef<ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  (
    { className, children, title, description, linkProps, showArrow, align = 'center', sideOffset = 4, ...props },
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

          {showArrow && (
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

const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Anchor: PopoverAnchor
}

export { Popover }
