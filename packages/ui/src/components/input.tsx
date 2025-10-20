import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

import { Caption, ControlGroup, IconPropsV2, IconV2, Label, Message, MessageTheme } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  'bg-cn-2 px-cn-sm py-cn-3xs text-cn-1 disabled:cursor-not-allowed disabled:bg-cn-3 disabled:text-cn-3',
  {
    variants: {
      variant: {
        default:
          'flex w-full rounded border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cn-3 focus-visible:rounded focus-visible:outline-none',
        extended: 'grow border-none focus-visible:outline-none'
      },
      size: {
        sm: 'h-8',
        md: 'h-9'
      },
      theme: {
        default:
          'border-cn-2 focus-within:border-cn-1 focus-visible:border-cn-1 disabled:border-cn-disabled disabled:placeholder:text-cn-disabled',
        danger: 'border-cn-danger',
        clean: 'bg-transparent outline-none focus:outline-none'
      }
    },
    defaultVariants: {
      variant: 'default',
      theme: 'default',
      size: 'sm'
    }
  }
)

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, type, variant, size, theme, ...props }, ref) => {
    return <input className={cn(inputVariants({ variant, size, theme }), className)} type={type} ref={ref} {...props} />
  }
)

BaseInput.displayName = 'BaseInput'

export interface BaseInputWithWrapperProps extends BaseInputProps {
  children: ReactNode
}

/**
 * TODO: The component needs to be refined to cover all conditions.
 */
const BaseInputWithWrapper = forwardRef<HTMLInputElement, BaseInputWithWrapperProps>(
  ({ className, type, variant, size, theme, children, ...props }, ref) => {
    return (
      <div className={cn(inputVariants({ variant, size, theme }), 'p-0 flex items-center', className)}>
        {children}
        <input
          className={cn(inputVariants({ variant: 'extended', size, theme: 'clean' }), 'px-0')}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

BaseInputWithWrapper.displayName = 'BaseInputWithWrapper'

export interface InputProps extends BaseInputProps {
  label?: string
  caption?: ReactNode
  error?: string
  optional?: boolean
  className?: string
  wrapperClassName?: string
  inputIconName?: IconPropsV2['name']
  rightElement?: ReactNode
  rightElementVariant?: 'default' | 'filled'
  customContent?: ReactNode
}

/**
 * A form input component with support for labels, captions, and error messages.
 * @example
 * <Input
 *   label="Email"
 *   id="email"
 *   type="email"
 *   placeholder="Enter your email"
 *   caption="We'll never share your email"
 *   error='Invalid email format'
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      caption,
      error,
      id,
      theme,
      disabled,
      optional,
      className,
      wrapperClassName,
      inputIconName,
      rightElement,
      rightElementVariant,
      customContent,
      ...props
    },
    ref
  ) => {
    const InputComponent = customContent ? BaseInputWithWrapper : BaseInput

    const baseInputComp = (
      <InputComponent
        className={cn(className, {
          'pl-cn-2xl': !!inputIconName,
          'border-none': !!rightElement
        })}
        id={id}
        ref={ref}
        theme={error ? 'danger' : theme}
        disabled={disabled}
        {...props}
      >
        {customContent}
      </InputComponent>
    )

    const renderInput = () => {
      if (rightElement) {
        return (
          <div
            className={cn(
              'flex items-center text-cn-3 rounded border',
              rightElementVariant === 'filled' ? 'bg-cn-gray-secondary border-l' : '',
              className
            )}
          >
            {baseInputComp}
            {rightElement}
          </div>
        )
      }

      return inputIconName ? (
        <span className="relative">
          <IconV2 className="absolute left-3 top-1/2 -translate-y-1/2 text-cn-3" name={inputIconName} size="xs" />
          {baseInputComp}
        </span>
      ) : (
        baseInputComp
      )
    }

    return (
      <ControlGroup className={wrapperClassName}>
        {!!label && (
          <Label className="mb-cn-xs" disabled={disabled} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}

        {renderInput()}

        {!!error && (
          <Message className="mt-cn-4xs" theme={MessageTheme.ERROR}>
            {error}
          </Message>
        )}

        {caption && <Caption className={cn({ 'text-cn-disabled': disabled })}>{caption}</Caption>}
      </ControlGroup>
    )
  }
)

Input.displayName = 'Input'

export { Input }
