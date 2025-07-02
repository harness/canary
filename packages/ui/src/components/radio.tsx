import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  ReactElement,
  useContext,
  useMemo
} from 'react'

import { CommonInputsProp, ControlGroup, FormCaption, Label } from '@/components'
import { generateAlphaNumericHash } from '@/utils'
import { cn } from '@/utils/cn'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva } from 'class-variance-authority'

const radioRootVariants = cva('cn-radio-root', {
  variants: {
    error: {
      true: 'cn-radio-error'
    }
  },
  defaultVariants: {
    error: false
  }
})

interface RadioItemProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string | ReactElement
  caption?: string | ReactElement
}

export interface RadioProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    Omit<CommonInputsProp, 'warning' | 'error'> {
  error?: boolean
}

type RadioContextType = Pick<RadioProps, 'optional' | 'disabled'>

const RadioContext = createContext<RadioContextType>({
  optional: false
})

/**
 * A styled radio button input component
 * @component
 * @example
 * <Radio.Item value="option1" name="group" label="Option 1" caption="This is option 1" />
 */
const RadioItem = forwardRef<ElementRef<typeof RadioGroupPrimitive.Item>, Omit<RadioItemProps, 'required'>>(
  ({ className, label, caption, ...props }, ref) => {
    const { optional, disabled: disabledRoot } = useContext(RadioContext)

    const isDisabled = props?.disabled || disabledRoot

    const radioId = useMemo(() => props?.id || `radio-${generateAlphaNumericHash(10)}`, [props?.id])

    return (
      <div className={cn('cn-radio-item-wrapper', className)}>
        <RadioGroupPrimitive.Item ref={ref} id={radioId} className="cn-radio-item" {...props}>
          <RadioGroupPrimitive.Indicator className="cn-radio-item-indicator" />
        </RadioGroupPrimitive.Item>

        {(label || caption) && (
          <div className="cn-radio-item-label-wrapper">
            <Label htmlFor={radioId} optional={optional} disabled={isDisabled}>
              {label}
            </Label>
            <FormCaption disabled={isDisabled}>{caption}</FormCaption>
          </div>
        )}
      </div>
    )
  }
)
RadioItem.displayName = RadioGroupPrimitive.Item.displayName

/**
 * A container component for radio group items
 * @component
 * @example
 * <Radio.Root onValueChange={(value) => console.log(value)}>
 *   <Radio.Item value="option1" name="group" label="Option 1" />
 * </Radio.Root>
 */
const RadioRoot = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, RadioProps>(
  (
    {
      className,
      label,
      error,
      wrapperClassName,
      orientation,
      informerProps,
      informerContent,
      caption,
      optional,
      labelSuffix,
      ...props
    },
    ref
  ) => {
    // If there is no label for the group, the optionality indicator is shown on the radio item label.
    const optionalValue = !label && optional

    return (
      <RadioContext.Provider value={{ optional: optionalValue, disabled: props?.disabled }}>
        <ControlGroup.Root className={cn('cn-radio-control', wrapperClassName)} orientation={orientation}>
          {(!!label || !!caption) && (
            <ControlGroup.LabelWrapper>
              {!!label && (
                <Label
                  optional={optional}
                  suffix={labelSuffix}
                  informerProps={informerProps}
                  informerContent={informerContent}
                >
                  {label}
                </Label>
              )}
              {!!caption && <FormCaption>{caption}</FormCaption>}
            </ControlGroup.LabelWrapper>
          )}
          <ControlGroup.InputWrapper>
            <RadioGroupPrimitive.Root className={cn(radioRootVariants({ error }), className)} {...props} ref={ref} />
          </ControlGroup.InputWrapper>
        </ControlGroup.Root>
      </RadioContext.Provider>
    )
  }
)
RadioRoot.displayName = RadioGroupPrimitive.Root.displayName

export const Radio = {
  Root: RadioRoot,
  Item: RadioItem
}
