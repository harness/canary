import { ComponentPropsWithoutRef, createContext, ElementRef, forwardRef, ReactNode, useContext } from 'react'

import { Logo, LogoProps } from '@components/logo'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { Icon, IconProps } from '../icon'

const accordionVariants = cva('cn-accordion', {
  variants: {
    size: {
      default: '',
      md: 'cn-accordion-md'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

const AccordionContext = createContext<{ withLeftIndicator?: boolean }>({ withLeftIndicator: false })

type AccordionRootProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants> & {
    onValueChange?: (value: string | string[]) => void
    withLeftIndicator?: boolean
  }
const AccordionRoot = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, AccordionRootProps>(
  ({ onValueChange, className, size, children, withLeftIndicator, ...props }, ref) => (
    <AccordionPrimitive.Root
      ref={ref}
      {...props}
      className={cn(accordionVariants({ size }), className)}
      onValueChange={onValueChange}
    >
      <AccordionContext.Provider value={{ withLeftIndicator }}>{children}</AccordionContext.Provider>
    </AccordionPrimitive.Root>
  )
)
AccordionRoot.displayName = 'AccordionRoot'

type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

const AccordionItem = forwardRef<ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('cn-accordion-item', className)} {...props} />
  )
)
AccordionItem.displayName = 'AccordionItem'

type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  suffix?: ReactNode
  indicatorProps?: Omit<IconProps, 'name'>
}

const AccordionTrigger = forwardRef<ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, children, suffix, indicatorProps, ...props }, ref) => {
    const { withLeftIndicator } = useContext(AccordionContext)
    const withSuffix = !!suffix

    const Indicator = () => (
      <Icon
        name="chevron-down"
        size={14}
        {...indicatorProps}
        className={cn('cn-accordion-trigger-indicator', indicatorProps?.className)}
      />
    )

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger ref={ref} className={cn('cn-accordion-trigger', className)} {...props}>
          {withLeftIndicator && <Indicator />}

          <span className="cn-accordion-trigger-text">{children}</span>
          {withSuffix && <span className="cn-accordion-trigger-suffix">{suffix}</span>}

          {!withLeftIndicator && <Indicator />}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  }
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionTriggerIcon = (props: Omit<IconProps, 'size'>) => <Icon size={18} {...props} role="presentation" />
const AccordionTriggerLogo = (props: Omit<LogoProps, 'size'>) => <Logo size={18} {...props} role="presentation" />

type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>

const AccordionContent = forwardRef<ElementRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content ref={ref} className="cn-accordion-content-container" {...props}>
      <div className={cn('cn-accordion-content', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
)
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  TriggerIcon: AccordionTriggerIcon,
  TriggerLogo: AccordionTriggerLogo,
  Content: AccordionContent
}

export { Accordion, AccordionRootProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps }
