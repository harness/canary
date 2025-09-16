import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  Fragment,
  PropsWithoutRef,
  ReactNode,
  useContext
} from 'react'

import { Card } from '@components/card'
import { IconPropsV2, IconV2 } from '@components/icon-v2'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const accordionVariants = cva('cn-accordion', {
  variants: {
    size: {
      sm: '',
      md: 'cn-accordion-md'
    },
    variant: {
      default: '',
      card: 'cn-accordion-card'
    }
  },
  defaultVariants: {
    size: 'sm',
    variant: 'default'
  }
})

const accordionTriggerVariants = cva('cn-accordion-trigger', {
  variants: {
    cardSize: {
      default: '',
      sm: 'cn-accordion-trigger-card-sm',
      md: 'cn-accordion-trigger-card-md',
      lg: 'cn-accordion-trigger-card-lg'
    }
  },
  defaultVariants: {
    cardSize: 'default'
  }
})

const accordionContentVariants = cva('cn-accordion-content-container', {
  variants: {
    cardSize: {
      default: '',
      sm: 'cn-accordion-content-container-card-sm',
      md: 'cn-accordion-content-container-card-md',
      lg: 'cn-accordion-content-container-card-lg'
    }
  },
  defaultVariants: {
    cardSize: 'default'
  }
})

interface AccordionContextType {
  indicatorPosition: 'left' | 'right'
  variant: 'default' | 'card'
  cardSize?: VariantProps<typeof Card.Root>['size']
}
const AccordionContext = createContext<AccordionContextType>({
  indicatorPosition: 'right',
  variant: 'default',
  cardSize: 'md'
})

type AccordionRootProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants> & {
    onValueChange?: (value: string | string[]) => void
    indicatorPosition?: 'right' | 'left'
    variant?: 'default' | 'card'
    cardSize?: VariantProps<typeof Card.Root>['size']
  }
const AccordionRoot = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, AccordionRootProps>(
  (
    {
      size,
      variant = 'default',
      className,
      onValueChange,
      indicatorPosition = 'right',
      children,
      cardSize = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <AccordionPrimitive.Root
        ref={ref}
        {...props}
        className={cn(accordionVariants({ size, variant }), className)}
        onValueChange={onValueChange}
      >
        <AccordionContext.Provider value={{ indicatorPosition, variant, cardSize }}>
          {children}
        </AccordionContext.Provider>
      </AccordionPrimitive.Root>
    )
  }
)
AccordionRoot.displayName = 'AccordionRoot'

type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
const AccordionItem = forwardRef<ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, ...props }, ref) => {
    const { variant, cardSize } = useContext(AccordionContext)

    if (variant === 'card') {
      return (
        <Card.Root size={cardSize} className="w-full" wrapperClassname="!p-0">
          <AccordionPrimitive.Item ref={ref} className="w-full" {...props} />
        </Card.Root>
      )
    }

    // fallback: plain accordion-item
    return <AccordionPrimitive.Item ref={ref} className={cn('cn-accordion-item', className)} {...props} />
  }
)
AccordionItem.displayName = 'AccordionItem'

type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  prefix?: ReactNode
  suffix?: ReactNode
  indicatorProps?: PropsWithoutRef<Omit<IconPropsV2, 'name' | 'fallback'>>
  headerClassName?: string
}

const AccordionTrigger = forwardRef<ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, children, suffix, prefix, indicatorProps, headerClassName, asChild, ...props }, ref) => {
    const { indicatorPosition, variant, cardSize } = useContext(AccordionContext)

    const Indicator = () => (
      <IconV2
        name="nav-arrow-down"
        size="xs"
        {...indicatorProps}
        className={cn('cn-accordion-trigger-indicator', indicatorProps?.className)}
      />
    )

    const Wrapper = asChild ? 'div' : Fragment

    return (
      <AccordionPrimitive.Header className={headerClassName}>
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(accordionTriggerVariants({ cardSize: variant === 'card' ? cardSize : 'default' }), className)}
          asChild={asChild}
          {...props}
        >
          <Wrapper>
            {indicatorPosition === 'left' && <Indicator />}

            {!!prefix && <span className="cn-accordion-trigger-prefix">{prefix}</span>}
            <span className="cn-accordion-trigger-text">{children}</span>
            {!!suffix && <span className="cn-accordion-trigger-suffix">{suffix}</span>}

            {indicatorPosition === 'right' && <Indicator />}
          </Wrapper>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  }
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  containerClassName?: string
}

const AccordionContent = forwardRef<ElementRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(
  ({ className, children, containerClassName, ...props }, ref) => {
    const { cardSize, variant } = useContext(AccordionContext)
    return (
      <AccordionPrimitive.Content
        ref={ref}
        className={cn(
          accordionContentVariants({ cardSize: variant === 'card' ? cardSize : 'default' }),
          containerClassName
        )}
        {...props}
      >
        <div className={cn('cn-accordion-content', className)}>{children}</div>
      </AccordionPrimitive.Content>
    )
  }
)
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent
}

export { Accordion, AccordionRootProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps }
