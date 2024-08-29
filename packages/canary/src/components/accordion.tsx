import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Icon } from './icon'
import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

// Define a type for the AccordionItem props, including isLast
type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  isLast?: boolean
}

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, isLast = false, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('border-b', { 'border-b-0': isLast }, className)} {...props} />
  )
)
AccordionItem.displayName = 'AccordionItem'

// Define a type for the AccordionTrigger props, including hideChevron and leftChevron
type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  hideChevron?: boolean
  leftChevron?: boolean
}

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, hideChevron = false, leftChevron = false, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all',
          {
            'cursor-default': hideChevron,
            'flex-row-reverse gap-3': leftChevron
          },
          className
        )}
        {...props}>
        {/* {!hideChevron && leftChevron && <Icon name="chevron-down" className="h-2.5 w-2.5 shrink-0 text-primary" />} */}
        {children}
        {!hideChevron && <Icon name="chevron-down" className="h-2.5 w-2.5 shrink-0 text-primary" />}
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
    {...props}>
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
