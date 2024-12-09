import * as React from 'react'

import { cn } from '@/lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

import { Icon } from './icon'

type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  onValueChange?: (value: string | string[]) => void
}
const Accordion = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  ({ onValueChange, ...props }, ref) => <AccordionPrimitive.Root ref={ref} {...props} onValueChange={onValueChange} />
)
Accordion.displayName = 'Accordion'

type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  isLast?: boolean
}

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, isLast = false, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('border-b', { 'border-b-0': isLast }, className)} {...props} />
  )
)
AccordionItem.displayName = 'AccordionItem'

type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  hideChevron?: boolean
  leftChevron?: boolean
  rotateChevron?: boolean
  chevronClass?: string
}

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  (
    {
      className,
      hideChevron = false,
      leftChevron = false,
      rotateChevron = 'false',
      chevronClass = '',
      children,
      ...props
    },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'group flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all',
          '[&>svg]:duration-100 [&>svg]:ease-in-out [&>svg]:data-[state=open]:rotate-180',
          {
            'cursor-default': hideChevron,
            'gap-3': leftChevron,
            '[&>svg]:-rotate-90 [&>svg]:data-[state=open]:-rotate-0': rotateChevron
          },
          className
        )}
        {...props}
      >
        {leftChevron && !hideChevron && (
          <Icon
            name="chevron-down"
            className={cn('chevron-down text-primary h-2.5 w-2.5 min-w-2.5 shrink-0', chevronClass)}
          />
        )}
        {children}
        {!leftChevron && !hideChevron && (
          <Icon
            name="chevron-down"
            className={cn('chevron-down text-primary h-2.5 w-2.5 min-w-2.5 shrink-0', chevronClass)}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

/**
 * @deprecated
 */
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
