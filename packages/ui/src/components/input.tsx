import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

import { Caption, ControlGroup, Icon, IconProps, Label, Message, MessageTheme } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  'bg-cn-background-2 px-3 py-1 text-cn-foreground-1 disabled:cursor-not-allowed disabled:bg-cn-background-3 disabled:text-cn-foreground-3',
  {
    variants: {
      variant: {
        default:
          'flex w-full rounded border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cn-foreground-3 focus-visible:rounded focus-visible:outline-none',
        extended: 'grow border-none focus-visible:outline-none'
      },
      size: {
        sm: 'h-8',
        md: 'h-9'
      },
      theme: {
        default:
          'border-cn-borders-2 focus-within:border-cn-borders-3 focus-visible:border-cn-borders-3 disabled:border-cn-borders-2 disabled:placeholder:text-cn-foreground-disabled',
        danger: 'border-cn-borders-danger',
        clean: 'bg-transparent outline-none focus:outline-none',
        sidebar:
          'border-cn-borders-2 bg-transparent text-sidebar-foreground-1 placeholder:text-sidebar-foreground-4 focus-within:border-sidebar-border-4 focus-visible:border-sidebar-border-4'
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
  inputIconName?: IconProps['name']
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
          'pl-8': !!inputIconName,
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
              'flex items-center text-muted-foreground rounded border',
              rightElementVariant === 'filled' ? 'bg-muted border-l' : '',
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
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-icons-9" name={inputIconName} size={14} />
          {baseInputComp}
        </span>
      ) : (
        baseInputComp
      )
    }

    return (
      <ControlGroup className={wrapperClassName}>
        {!!label && (
          <Label className="mb-2.5" color={disabled ? 'disabled-dark' : 'secondary'} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}

        {renderInput()}

        {!!error && (
          <Message className="mt-0.5" theme={MessageTheme.ERROR}>
            {error}
          </Message>
        )}

        {caption && <Caption className={cn({ 'text-cn-foreground-disabled': disabled })}>{caption}</Caption>}
      </ControlGroup>
    )
  }
)

Input.displayName = 'Input'

export { Input }
