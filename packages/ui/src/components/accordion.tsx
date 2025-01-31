import * as React from 'react'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@utils/cn'

import { Icon } from './icon'

type AccordionRootProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  onValueChange?: (value: string | string[]) => void
}
const AccordionRoot = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Root>, AccordionRootProps>(
  ({ onValueChange, ...props }, ref) => <AccordionPrimitive.Root ref={ref} {...props} onValueChange={onValueChange} />
)
AccordionRoot.displayName = 'AccordionRoot'

type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  isLast?: boolean
}

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, isLast = false, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('border-b', { 'border-b-0': isLast }, className)} {...props} />
  )
)
AccordionItem.displayName = 'AccordionItem'

const ChevronIcon = ({ chevronClassName }: { chevronClassName?: string }) => {
  return (
    <Icon
      name="chevron-down"
      size={12}
      className={cn(
        'chevron-down text-icons-1 group-hover:text-icons-2 transition-colors duration-200 size-3 shrink-0',
        chevronClassName
      )}
    />
  )
}

type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  hideChevron?: boolean
  leftChevron?: boolean
  rotateChevron?: boolean
  chevronClassName?: string
}

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  (
    {
      className,
      hideChevron = false,
      leftChevron = false,
      rotateChevron = 'false',
      chevronClassName = '',
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
            'gap-1.5': leftChevron,
            '[&>svg]:-rotate-90 [&>svg]:data-[state=open]:-rotate-0': rotateChevron
          },
          className
        )}
        {...props}
      >
        {leftChevron && !hideChevron && <ChevronIcon chevronClassName={chevronClassName} />}
        {children}
        {!leftChevron && !hideChevron && <ChevronIcon chevronClassName={chevronClassName} />}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>

const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
)
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent
}

export { Accordion, AccordionRootProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps }
